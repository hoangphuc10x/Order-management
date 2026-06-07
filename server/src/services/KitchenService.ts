import mongoose, { Types } from "mongoose";
import KitchenRepository from "../repositories/KitchenRepository";
import { IKitchenQueue } from "../interfaces/IKitchenQueue";
import { KitchenQueueDTO } from "../dto/KitchenQueueDTO";
import { FoodStatus } from "../enums/FoodStatus";
import OrderRepository from "../repositories/OrderRepository";
import { TableOrderStatus } from "../enums/TableOrderStatus";
import { getIo } from "../sockets/socket";
import TableRepository from "../repositories/TableRepository";
import { IUser } from "../interfaces/IUser";
import UserRepository from "../repositories/UserRepository";
import KitchenQueueModel from "../models/KitchenQueueModel";

export default class KitchenService {
  private kitchenRepository: KitchenRepository;
  private orderRepository: OrderRepository;
  private tableRepository: TableRepository;
  private userRepository: UserRepository;

  constructor(
    kitchenRepository: KitchenRepository,
    orderRepository: OrderRepository,
    tableRepository: TableRepository,
    userRepository: UserRepository
  ) {
    this.kitchenRepository = kitchenRepository;
    this.orderRepository = orderRepository;
    this.tableRepository = tableRepository;
    this.userRepository = userRepository;
  }

  private toKitchenDTO = (item: IKitchenQueue): KitchenQueueDTO => {
    const {
      _id,
      orderId,
      itemId,
      name,
      quantity,
      status,
      tableNumber,
      createdAt,
      updatedAt,
      orderItemId,
    } = item;

    return new KitchenQueueDTO(
      new Types.ObjectId(_id as string),
      new Types.ObjectId(orderId as string),
      String(itemId),
      name,
      quantity,
      status ?? FoodStatus.PENDING,
      tableNumber,
      createdAt,
      updatedAt,
      orderItemId
    );
  };

  public getAllOrderItems = async (): Promise<KitchenQueueDTO[]> => {
    const orderItems = await this.kitchenRepository.getAllOrderItems();
    return orderItems.map((item) => this.toKitchenDTO(item));
  };

  private async updateOrderItemStatus(
    orderItem: any,
    newStatus: string,
    now: Date
  ) {
    orderItem.status = newStatus as FoodStatus;
    orderItem.updatedAt = now;
    await orderItem.save();
  }

  public async updateKitchenStatus(
    orderItemIds: string[],
    newStatus: string,
    orderId?: string // Make orderId optional
  ): Promise<string[] | null> {
    try {
      const io = getIo();
      const updatedOrderIds: string[] = [];

      // Tìm tất cả các kitchenItems một lần
      const kitchenItems = await this.kitchenRepository.findByorderItemIds(
        orderItemIds
      );

      if (orderId) {
        // Tìm order lần đầu tiên và đảm bảo không phải null
        const order = await this.orderRepository.findById(orderId);
        if (!order) {
          throw new Error("Order not found");
        }

        // Kiểm tra nếu orderItem tồn tại và không có kitchenItems, cập nhật trạng thái
        const orderItem = order.orderItems.find(
          (item) => String(item._id) === orderItemIds[0]
        );
        // Nếu tìm thấy orderItem
        if (orderItem) {
          if (orderItem.status === FoodStatus.SERVED) {
            console.log("Món đã được phục vụ rồi, không cần cập nhật nữa.");
            return updatedOrderIds; // Trả về mảng rỗng nếu không có gì thay đổi
          }
          await this.updateOrderItemStatus(
            orderItem,
            FoodStatus.SERVED,
            new Date()
          );

          // Kiểm tra xem tất cả các món đã được phục vụ chưa
          if (
            order.orderItems.every((item) => item.status === FoodStatus.SERVED)
          ) {
            order.status = TableOrderStatus.ALL_SERVED;
          }
          await order.save();
          await this.tableRepository.updateWaitingTimeAt((order.tableId as any).toString());
          await this.tableRepository.updateInformStatus((order.tableId as any).toString(),false)
          updatedOrderIds.push(String(order._id));
        }
      } else {
        // Xử lý trường hợp không có orderId, chỉ dựa trên kitchenItems
        for (const item of kitchenItems) {
          if (item.status === newStatus) continue; // Nếu trạng thái không thay đổi thì bỏ qua

          const now = new Date();
          const order = await this.orderRepository.findById(
            String(item.orderId)
          );
          if (!order) continue;

          const orderItem = order.orderItems.find(
            (orderItem) => String(orderItem._id) === String(item.orderItemId)
          );
          if (!orderItem) continue;

          // Kiểm tra trạng thái tổng thể của order
          const hasProcessingItem = order.orderItems.some(
            (item) => item.status === FoodStatus.PROCESSING
          );
          const allCompleted = order.orderItems.every(
            (item) => item.status === FoodStatus.SERVED
          );
          if (hasProcessingItem) {
            order.status === TableOrderStatus.PREPARING;
          }
          if (allCompleted) {
            order.status === TableOrderStatus.ALL_SERVED;
          }
          order.updatedAt = now;
          await this.tableRepository.updateWaitingTimeAt((order.tableId as any).toString());
          await this.tableRepository.updateInformStatus((order.tableId as any).toString(),false)
          await order.save();

          // Cập nhật trạng thái của món trong Order
          await this.updateOrderItemStatus(orderItem, newStatus, now);

          // Cập nhật trạng thái bếp
          await this.updateKitchenItemStatus(
            item,
            newStatus,
            now,
            order,
            orderItem
          );

          // Emit socket events
          this.emitSocketEvents(io, item, order, newStatus);

          updatedOrderIds.push(String(item.orderId));
        }
      }

      return updatedOrderIds;
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật trạng thái món:", error);
      throw error;
    }
  }

  

  private async updateKitchenItemStatus(
    item: any,
    newStatus: string,
    now: Date,
    order: any,
    orderItem: any
  ) {
    // Nếu đang chuyển sang PROCESSING, set thời gian bắt đầu nấu nếu chưa có
    if (newStatus === FoodStatus.PROCESSING) {
      if (!item.startCookingTime) {
        item.startCookingTime = now;
      }
    }

    // Nếu chuyển sang COMPLETED, xử lý đầu bếp và thời gian
    if (newStatus === FoodStatus.COMPLETED) {
      if (item.userId) {
        const chef = await this.userRepository.findById(item.userId.toString());
        if (chef && chef.role === "chef" && chef.status === "COOKING") {
          chef.status = "STANDBY";
          chef.updatedAt = now;
          await chef.save();
          console.log(
            `✅ Đã đổi trạng thái của đầu bếp ${chef.username} về STANDBY`
          );
        }
      }

      if (!item.completionTime) {
        item.completionTime = now;
        if (item.startCookingTime) {
          item.actualCookingTime = Math.round(
            (item.completionTime.getTime() - item.createdAt.getTime()) /
              1000 /
              60
          );
        }
      }
    }

    // Cập nhật trạng thái
    item.status = newStatus as FoodStatus;
    item.updatedAt = now;
    orderItem.status = newStatus as FoodStatus;

    // Lưu lại
    await Promise.all([
      item.save({ suppressWarning: true }),
      orderItem.save({ suppressWarning: true }),
      order.save({ suppressWarning: true }),
    ]);

    // Nếu là SERVED thì xoá khỏi KitchenQueue
    if (newStatus === FoodStatus.SERVED) {
      const deleted = await KitchenQueueModel.deleteOne({
        orderItemId: item.orderItemId,
      });

      if (deleted.deletedCount > 0) {
        console.log(
          `🗑 Đã xoá món "${item.name}" khỏi kitchenQueue và cập nhật waitingTimeAt`
        );
      } else {
        console.warn(
          `⚠️ Không tìm thấy item để xoá trong KitchenQueue với orderItemId = ${item.orderItemId}`
        );
      }
    }
  }

  private emitSocketEvents(io: any, item: any, order: any, newStatus: string) {
    if (io) {
      io.emit("kitchenStatusUpdated", {
        kitchenItemId: item._id,
        status: item.status,
      });
      io.emit("orderItemStatusUpdated", {
        orderId: item.orderId,
        itemId: item.itemId,
        status: item.status,
        tableId: item.tableId,
      });
      io.emit("orderStatusUpdated", {
        orderId: item.orderId,
        status: order.status,
        tableId: order.tableId,
      });

      if (newStatus === FoodStatus.COMPLETED) {
        io.emit("client:itemCompleted", {
          tableId: item.tableId,
          itemId: item.itemId,
          name: item.name,
          orderId: item.orderId,
        });
      }
    }
  }

  public async getGroupedKitchenItems(): Promise<any[]> {
    const items = await this.kitchenRepository.findKitchenItemsForGrouping();

    const groupedMap = new Map<string, any>();
    console.log("items", items);

    for (const item of items) {
      const key = `${item.itemId}_${item.name}`;
      const hasNote = item.note && item.note.trim() !== "";

      if (item.status === "PENDING") {
        if (hasNote) {
          // ❌ Có ghi chú thì KHÔNG gộp
          groupedMap.set(`${key}_NOTE_${item._id}`, {
            itemId: item.itemId.toString(),
            name: item.name,
            quantity: item.quantity,
            status: item.status,
            updatedAt: item.updatedAt,
            orderIds: [(item.orderId as any).toString()],
            orderItemIds: [(item.orderItemId as any).toString()],
            tableNumbers: [item.tableNumber],
            tableIds: [item.tableId],
            categoryId: item.categoryId,
            note: item.note,
          });
        } else {
          // ✅ Gộp nếu không có note
          if (groupedMap.has(key)) {
            const existing = groupedMap.get(key)!;
            existing.quantity += item.quantity;
            if (!existing.orderIds.includes((item.orderId as any).toString())) {
              existing.orderIds.push((item.orderId as any).toString());
            }
            if (
              !existing.orderItemIds.includes(
                (item.orderItemId as any).toString()
              )
            ) {
              existing.orderItemIds.push((item.orderItemId as any).toString());
            }
            if (!existing.tableNumbers.includes(item.tableNumber)) {
              existing.tableNumbers.push(item.tableNumber);
            }
            if (!existing.tableIds.includes((item.tableId as any).toString())) {
              existing.tableIds.push((item.tableId as any).toString());
            }
            if (new Date(item.updatedAt) > new Date(existing.updatedAt)) {
              existing.updatedAt = item.updatedAt;
            }
          } else {
            groupedMap.set(key, {
              itemId: item.itemId.toString(),
              name: item.name,
              quantity: item.quantity,
              status: item.status,
              updatedAt: item.updatedAt,
              orderIds: [(item.orderId as any).toString()],
              orderItemIds: [(item.orderItemId as any).toString()],
              tableNumbers: [item.tableNumber],
              tableIds: [item.tableId],
              categoryId: item.categoryId,
            });
          }
        }
      } else if (item.status === "PROCESSING") {
        const updatedDate = new Date(item.updatedAt);
        const roundedTime = new Date(
          updatedDate.getFullYear(),
          updatedDate.getMonth(),
          updatedDate.getDate(),
          updatedDate.getHours(),
          updatedDate.getMinutes()
        );
        const updatedAtGroupKey = roundedTime.toISOString(); // ⏱ group theo phút
        const key = `${item.itemId}_${item.name}_${item.status}_${updatedAtGroupKey}`;

        const hasNote = item.note && item.note.trim() !== "";

        if (hasNote) {
          groupedMap.set(`${key}_NOTE_${item._id}`, {
            itemId: item.itemId.toString(),
            name: item.name,
            quantity: item.quantity,
            status: item.status,
            updatedAt: item.updatedAt,
            orderIds: [(item.orderId as any).toString()],
            orderItemIds: [(item.orderItemId as any).toString()],
            tableNumbers: [item.tableNumber],
            tableIds: [item.tableId],
            categoryId: item.categoryId,
            note: item.note,
          });
        } else {
          if (groupedMap.has(key)) {
            const existing = groupedMap.get(key)!;
            existing.quantity += item.quantity;
            if (!existing.orderIds.includes((item.orderId as any).toString())) {
              existing.orderIds.push((item.orderId as any).toString());
            }
            if (
              !existing.orderItemIds.includes(
                (item.orderItemId as any).toString()
              )
            ) {
              existing.orderItemIds.push((item.orderItemId as any).toString());
            }
            if (!existing.tableNumbers.includes(item.tableNumber)) {
              existing.tableNumbers.push(item.tableNumber);
            }
            if (!existing.tableIds.includes((item.tableId as any).toString())) {
              existing.tableIds.push((item.tableId as any).toString());
            }
            if (new Date(item.updatedAt) > new Date(existing.updatedAt)) {
              existing.updatedAt = item.updatedAt;
            }
          } else {
            groupedMap.set(key, {
              itemId: item.itemId.toString(),
              name: item.name,
              quantity: item.quantity,
              status: item.status,
              updatedAt: item.updatedAt,
              orderIds: [(item.orderId as any).toString()],
              orderItemIds: [(item.orderItemId as any).toString()],
              tableNumbers: [item.tableNumber],
              tableIds: [item.tableId],
              // kitchenIds:[(item._id as any).toString()],
              categoryId: item.categoryId,
            });
          }
        }
      }
    }

    return Array.from(groupedMap.values()).sort((a, b) => {
      if (a.status === "PENDING" && b.status === "PROCESSING") return -1;
      if (a.status === "PROCESSING" && b.status === "PENDING") return 1;
      return 0;
    });
  }

  public async getItemsByCategoryInKitchenItems(
    categoryId: string
  ): Promise<any[]> {
    return await this.kitchenRepository.getGroupedItemsByCategoryId(categoryId);
  }

  public async getAllCategoriesInKitchenQueue(): Promise<
    { categoryId: string }[]
  > {
    return await this.kitchenRepository.getAllCategoriesInKitchenQueue();
  }

  public async getOccupiedTableNames(): Promise<
    { _id: string; tableNumber: string }[]
  > {
    return await this.tableRepository.findOccupiedTableNames();
  }

  public async findKitchenItemsByTableId(
    tableId: string
  ): Promise<IKitchenQueue[]> {
    return await this.kitchenRepository.findByTableId(tableId);
  }
  public async getItemsByTableId(tableId: string): Promise<IKitchenQueue[]> {
    const items = await this.kitchenRepository.findAllByCondition({ tableId });
    if (!items) {
      throw new Error("No active order for this table");
    }
    return items; // ✅ đây là mảng
  }

  public async getCompletedKitchenItems(): Promise<IKitchenQueue[]> {
    return await this.kitchenRepository.getCompletedItems();
  }

  public async getAllItemByItemIdInKichenQueue(itemId: string): Promise<any[]> {
    return await this.kitchenRepository.getAllItemByItemIdInKichenQueue(itemId);
  }

  public async getOrderInfoByItemId(
    itemId: string,
    status: string
  ): Promise<any[]> {
    return await this.kitchenRepository.getOrdersByItemId(itemId, status);
  }

  public async findChef(): Promise<
    Pick<IUser, "_id" | "fulname" | "status">[]
  > {
    return await this.userRepository
      .findAllByCondition({ role: "chef" })
      .then((users) =>
        users.map((user) => ({
          _id: user._id,
          fulname: user.fulname,
          status: user.status,
        }))
      );
  }

  public async assignChefToKitchenItem(
    userId: string,
    orderItemIds: string[]
  ): Promise<IKitchenQueue[]> {
    const session = await mongoose.startSession();
    session.startTransaction();
    // console.log("orderItemIds: ", orderItemIds);

    try {
      const io = getIo();

      // 🔍 Lấy đầu bếp
      const chef = await this.userRepository.findById(userId);
      if (!chef || chef.role !== "chef") {
        throw new Error("Không tìm thấy đầu bếp hợp lệ");
      }

      if (chef.status !== "STANDBY") {
        throw new Error("Đầu bếp hiện không sẵn sàng (STANDBY)");
      }

      // ✅ Cập nhật trạng thái đầu bếp
      chef.status = "COOKING";
      await chef.save({ session });

      // 🔍 Lấy danh sách KitchenQueue cần gán

      const kitchenItems = await this.kitchenRepository.findByorderItemIds(
        orderItemIds
      );

      if (!kitchenItems || kitchenItems.length === 0) {
        throw new Error("Không tìm thấy món cần gán đầu bếp");
      }

      const now = new Date();
      const updatedItems: IKitchenQueue[] = [];

      // 🔍 Tìm tất cả order liên quan
      const relatedOrderIds = kitchenItems.map((i) =>
        (i.orderId as any).toString()
      );
      const orders = await this.orderRepository.findAllByCondition({
        _id: { $in: relatedOrderIds },
      });

      for (const item of kitchenItems) {
        if (item.status !== FoodStatus.PENDING) {
          throw new Error(`Món "${item.name}" không ở trạng thái PENDING`);
        }

        // ✅ Cập nhật kitchenQueue
        item.userId = (chef._id as any).toString();
        item.fulname = chef.fulname || chef.username;
        item.status = FoodStatus.PROCESSING;
        item.startCookingTime = now;
        item.updatedAt = now;
        await item.save({ session });
        updatedItems.push(item);

        // ✅ Cập nhật orderItems trong Order
        const order = orders.find(
          (o) => (o._id as any).toString() === (item.orderId as any).toString()
        );
        if (order) {
          const orderItem = order.orderItems.find(
            (oi) => oi._id.toString() === item.orderItemId.toString()
          );
          if (orderItem) {
            orderItem.status = FoodStatus.PROCESSING;
            orderItem.updatedAt = now;
          }
          order.updatedAt = now;
          await this.tableRepository.updateWaitingTimeAt((order.tableId as any).toString());
          await this.tableRepository.updateInformStatus((order.tableId as any).toString(),false)
          await order.save({ session });
        }
      }

      io?.emit("kitchenStatusUpdated", {
        kitchenItemIds: updatedItems.map((item) => item._id),
        status: FoodStatus.PROCESSING,
      });

      await session.commitTransaction();
      session.endSession();

      return updatedItems;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("❌ Lỗi assignChefToKitchenItem:", error);
      throw error;
    }
  }

  public async updateChefStatus(
    userId: string,
    newStatus: "STANDBY" | "COOKING" | "BUSYING" | "LAY-OFF"
  ): Promise<IUser | null> {
    const user = await this.userRepository.findById(userId);

    if (!user) throw new Error("Không tìm thấy người dùng");
    if (user.role !== "chef")
      throw new Error("Người dùng không phải là đầu bếp");

    user.status = newStatus;
    user.updatedAt = new Date();
    await user.save();

    // 🔥 Emit socket thông báo trạng thái đầu bếp đã thay đổi
    const io = getIo(); // lấy instance socket
    if (io) {
      io.emit("chefStatusUpdated", {
        userId: user._id,
        fullName: user.fulname || user.username,
        newStatus: user.status,
      });
      console.log(
        `📣 Đã phát socket chefStatusUpdated: ${user.username} → ${user.status}`
      );
    }

    return user;
  }

  public async getItemsByChef(userId: string): Promise<IKitchenQueue[]> {
    return await this.kitchenRepository.findByUserId(userId);
  }
}
