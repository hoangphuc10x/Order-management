import mongoose from "mongoose";
import { IOrder } from "../interfaces/IOrder";
import OrderRepository from "../repositories/OrderRepository";
import { TableOrderStatus } from "../enums/TableOrderStatus";
import MenuItemRepository from "../repositories/MenuItemRepository";
import TableRepository from "../repositories/TableRepository";
import UserRepository from "../repositories/UserRepository";
import KitchenQueueModel from "../models/KitchenQueueModel";
import { FoodStatus } from "../enums/FoodStatus";
import { TableStatus } from "../enums/TableStatus";
import { getIo } from "../sockets/socket";
import { IOrderItem } from "../interfaces/IOrderItem";
import TableModel from "../models/TableModel";
import UserModel from "../models/UserModel";
import { log, table } from "console";
import KitchenRepository from "../repositories/KitchenRepository";
import RevenueModel from "../models/RevenueModel";
import DiscountRepository from "../repositories/DiscountRepository";
import { IDiscount } from "../interfaces/IDiscount";

export default class OrderService {
  private orderRepository: OrderRepository;
  private menuItemRepository: MenuItemRepository;
  private tableRepository: TableRepository;
  private userRepository: UserRepository;
  private kitchenRepository: KitchenRepository;
  private discountRepository: DiscountRepository;

  constructor(
    orderRepository: OrderRepository,
    menuItemRepository: MenuItemRepository,
    tableRepository: TableRepository,
    userRepository: UserRepository,
    kitchenRepository: KitchenRepository,
    discountRepository: DiscountRepository
  ) {
    this.orderRepository = orderRepository;
    this.menuItemRepository = menuItemRepository;
    this.tableRepository = tableRepository;
    this.userRepository = userRepository;
    this.kitchenRepository = kitchenRepository;
    this.discountRepository = discountRepository;
  }

  // Tạo hoặc cập nhật đơn hàng

  public async createOrUpdateOrder(
    data: any,
    _orderId?: string | undefined // không dùng nữa: đơn xác định theo (user, table)
  ): Promise<IOrder | null> {
    const session = await mongoose.startSession(); // Khởi tạo session
    session.startTransaction(); // Bắt đầu transaction
    try {
      console.log("Processing order:", JSON.stringify(data, null, 2));

      const { tableId, userId, orderItems } = data;

      // Lấy thông tin món ăn từ database
      const menuItems = await this.fetchMenuItems(orderItems);
      if (menuItems.length !== orderItems.length) {
        throw new Error("Some menu items not found");
      }

      // Cập nhật orderItems với thông tin chính xác và tính tổng giá
      const { updatedOrderItems, sumPrice } = this.updateOrderItems(
        orderItems,
        menuItems
      );

      let newOrder: IOrder | null = null;

      // Đơn hàng được xác định DUY NHẤT theo (userId, tableId). Không tin orderId
      // từ client (tránh gộp nhầm món sang bàn cũ). Nếu khách đã có đơn đang hoạt
      // động tại bàn này -> thêm món; nếu chưa -> tạo đơn mới (quét bàn khác = đơn mới).
      const activeOrder = await this.orderRepository.findActiveByTableAndUser(
        tableId,
        userId
      );

      if (activeOrder) {
        newOrder = await this.updateExistingOrder(
          (activeOrder._id as any).toString(),
          updatedOrderItems,
          sumPrice,
          tableId,
          userId,
          session
        );
      } else {
        newOrder = await this.createNewOrder(
          userId,
          tableId,
          updatedOrderItems,
          sumPrice,
          session
        );
      }

      await session.commitTransaction(); // Commit transaction sau khi tất cả thành công
      session.endSession(); // Kết thúc session
      return newOrder;
    } catch (error) {
      console.error("Error processing order:", error);
      await session.abortTransaction(); // Rollback transaction nếu có lỗi
      session.endSession(); // Kết thúc session
      throw new Error(
        `Failed to process order: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  // Kiểm tra xem người dùng có mã giảm giá hay không
  public async hasDiscount(
    userId: string
  ): Promise<IDiscount | null | undefined> {
    // Kiểm tra xem user đã từng đặt hàng chưa
    log("Checking if user has ordered before:", userId);
    const hasOrderedBefore = await this.orderRepository.exists(userId);
    log("User has ordered before:", hasOrderedBefore);

    let discount;

    if (!hasOrderedBefore) {
      // Kiểm tra nếu là lần đầu đặt hàng, tìm mã giảm giá có value > 10
      log("User is first-time order, checking for discounts with value > 10");

      // Tìm tất cả mã giảm giá có giá trị lớn hơn 10
      const discounts = await this.discountRepository.find({
        active: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
        value: { $gt: 10 }, // Chỉ tìm những mã giảm giá có value > 10
        $or: [
          { usageLimit: null },
          { $expr: { $lt: ["$usedCount", "$usageLimit"] } },
        ],
      });
      // Sắp xếp kết quả theo giá trị giảm dần (chọn mã có giá trị cao nhất)
      discounts.sort((a, b) => b.value - a.value); // Sắp xếp mảng theo giá trị giảm dần
      // Nếu có mã giảm giá, chọn mã giảm giá có giá trị cao nhất
      if (discounts.length > 0) {
        discount = discounts[0]; // Chọn mã có giá trị cao nhất
      } else {
        // Nếu không tìm thấy mã giảm giá có value > 10, lấy mã giảm giá "WELCOMETORESTAURANT"
        log(
          "No discount with value > 10 found, checking WELCOMETORESTAURANT discount"
        );
        discount = await this.discountRepository.findOne({
          code: "WELCOMETORESTAURANT",
          active: true,
          startDate: { $lte: new Date() },
          endDate: { $gte: new Date() },
          $or: [
            { usageLimit: null },
            { $expr: { $lt: ["$usedCount", "$usageLimit"] } },
          ],
        });
      }
    } else {
      // Nếu đã có lịch sử đặt hàng, tìm mã giảm giá khác
      log("User is not first-time order, checking for other discounts");
      const discounts = await this.discountRepository.find({
        active: true,
        startDate: { $lte: new Date() },
        endDate: { $gte: new Date() },
        $or: [
          { usageLimit: null },
          { $expr: { $lt: ["$usedCount", "$usageLimit"] } },
        ],
      });

      discounts.sort((a, b) => b.value - a.value); // Sắp xếp mảng theo giá trị giảm dần

      // Lấy mã giảm giá có giá trị cao nhất
      if (discounts.length > 0) {
        discount = discounts[0]; // Chọn mã có giá trị cao nhất
      }
    }

    return discount;
  }

  private async fetchMenuItems(orderItems: any[]): Promise<any[]> {
    return await this.menuItemRepository.findByIds(
      orderItems.map((item: any) => item.itemId)
    );
  }

  private updateOrderItems(
    orderItems: any[],
    menuItems: any[]
  ): { updatedOrderItems: any[]; sumPrice: number } {
    let sumPrice = 0;
    const updatedOrderItems = orderItems.map((item: any) => {
      const menuItem = menuItems.find((m: any) => m.id === item.itemId);
      if (!menuItem) {
        throw new Error(`Menu item not found: ${item.itemId}`);
      }

      const itemTotalPrice = item.quantity * item.price;
      sumPrice += itemTotalPrice;

      return {
        itemId: item.itemId,
        name: menuItem.name,
        categoryId: menuItem.category.categoryId,
        categoryName: menuItem.category.categoryName,
        note: item.note,
        status: FoodStatus.PENDING,
        quantity: item.quantity,
        price: item.price,
        difficultyLevel: menuItem.difficultyLevel,
        readyToServeItems: menuItem.readyToServeItems,
      };
    });

    return { updatedOrderItems, sumPrice };
  }

  private async updateExistingOrder(
    orderId: string,
    updatedOrderItems: any[],
    sumPrice: number,
    tableId: string,
    userId: string,
    session: any
  ): Promise<IOrder | null> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      console.warn("⚠️ Không tìm thấy đơn hàng!");
      throw new Error("Order not found");
    }

    const table = await this.tableRepository.findById(tableId);
    const tableNumber = table ? table.tableNumber : "Unknown Table";
    const user = await this.userRepository.findById(userId);
    const userName = user ? user.username : "Unknown User";

    const oldTotalPrice = Number(order.totalPrice) || 0;

    if (
      order.status === TableOrderStatus.COMPLETED ||
      order.status === TableOrderStatus.CANCELLED
    ) {
      throw new Error("Order cannot be updated");
    }

    let hasUpdates = false;

    for (const newItem of updatedOrderItems) {
      const existingItem = order.orderItems.find(
        (item) => String(item.itemId) === String(newItem.itemId)
      );

      if (existingItem) {
        if (
          existingItem.readyToServeItems === false &&
          existingItem.status === FoodStatus.PENDING
        ) {
          existingItem.quantity += newItem.quantity;
          existingItem.updatedAt = new Date();
        } else if (
          existingItem.readyToServeItems === false &&
          existingItem.status !== FoodStatus.PENDING
        ) {
          order.orderItems.push({
            ...newItem,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        } else if (
          existingItem.readyToServeItems === true &&
          existingItem.status === FoodStatus.COMPLETED
        ) {
          existingItem.quantity += newItem.quantity;
          existingItem.updatedAt = new Date();
          newItem.status = FoodStatus.COMPLETED;
        } else if (
          existingItem.readyToServeItems === true &&
          existingItem.status === FoodStatus.SERVED
        ) {
          newItem.status = FoodStatus.COMPLETED;
          order.orderItems.push({
            ...newItem,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      } else {
        if (newItem.readyToServeItems === true) {
          newItem.status = FoodStatus.COMPLETED;
        }

        order.orderItems.push({
          ...newItem,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      hasUpdates = true;
    }

    const newTotalPrice = Number(oldTotalPrice + sumPrice);

    if (hasUpdates) {
      order.updatedAt = new Date();
      order.totalPrice = newTotalPrice;
      order.tableName = tableNumber;
      order.userName = userName;
      order.orderTime = new Date();

      if (order.status === TableOrderStatus.ALL_SERVED) {
        order.status = TableOrderStatus.PREPARING;
      }

      await order.save({ session });

      await this.handleKitchenQueue(order, tableNumber, tableId, session);
      log("Order updated kitchen successfully:");
      const io = getIo();
      io.emit("orderUpdated", {
        orderId: order._id,
        order,
      });
      io.emit("newItemsAddedToOrder", {
        orderId: order._id,
        items: updatedOrderItems,
      });
    }

    return order;
  }

  private async handleKitchenQueue(
    order: any,
    tableNumber: string,
    tableId: string,
    session: any
  ) {
    const kitchenQueueItems = await this.kitchenRepository.findAllByCondition({
      orderId: order._id,
    });

    let io = getIo();

    console.log("Kitchen Queue Items: ", kitchenQueueItems);

    if (Array.isArray(kitchenQueueItems) && kitchenQueueItems.length > 0) {
      for (const item of order.orderItems) {
        const kitchenItem = kitchenQueueItems.find(
          (queueItem: any) =>
            queueItem.itemId.toString() === item.itemId.toString()
        );

        if (kitchenItem) {
          console.log(
            `Found kitchen item: ${item.name} with status: ${kitchenItem.status}`
          );

          if (kitchenItem.status === FoodStatus.PENDING) {
            console.log(
              `Kitchen item ${item.name} is pending, updating quantity`
            );

            await KitchenQueueModel.deleteOne({ _id: kitchenItem._id }).session(
              session
            ); // Xóa món ăn cũ

            const newQueueItem = this.createQueueItem(
              order._id,
              item,
              tableId,
              tableNumber
            );
            console.log("New kitchen queue item: ", newQueueItem);

            // Thêm món ăn mới vào queue
            // Kiểm tra xem món ăn này là món ăn cần chế biến hay không
            if (item.readyToServeItems === false) {
              await KitchenQueueModel.insertMany([newQueueItem], { session });
            }
          } else {
            if (item.status === FoodStatus.PENDING) {
              const newQueueItem = this.createQueueItem(
                order._id,
                item,
                tableId,
                tableNumber
              );
              console.log("New kitchen queue item: ", newQueueItem);
              // Thêm món ăn mới vào queue
              // Kiểm tra xem món ăn này là món ăn cần chế biến hay không
              if (item.readyToServeItems === false) {
                await KitchenQueueModel.insertMany([newQueueItem], { session });
              }
            }
            console.log(`Item ${item.name} already processed`);
          }
        } else {
          const newQueueItem = this.createQueueItem(
            order._id,
            item,
            tableId,
            tableNumber
          );
          console.log(
            "Item not found in kitchen, adding new item: ",
            newQueueItem
          );
          if (item.readyToServeItems === false) {
            await KitchenQueueModel.insertMany([newQueueItem], { session });
          }
        }
      }
    } else {
      console.log("No items found in kitchen queue. Adding all items.");

      const orderItemsData = order.orderItems
        .filter(
          (item: any) =>
            item.status === FoodStatus.PENDING &&
            item.readyToServeItems === false
        )
        .map((item: any) => ({
          orderItemId: item._id,
          orderId: order._id,
          itemId: item.itemId,
          tableId,
          tableNumber,
          name: item.name,
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          quantity: item.quantity,
          status: FoodStatus.PENDING,
          difficultyLevel: item.difficultyLevel,
          note: item.note,
        }));

      await KitchenQueueModel.insertMany(orderItemsData, { session });
      console.log("All items added to kitchen queue:", orderItemsData);

      await TableModel.updateOne(
        { tableNumber },
        { $set: { waitingTimeAt: new Date() } }
      );
      console.log("Table waiting time updated:", tableNumber);

      io?.emit("orderSentToKitchen", {
        orderId: order._id,
        items: order.orderItems,
      });
      console.log("Emitted orderSentToKitchen event.");
    }

    await order.save({ session });
    console.log("Order saved successfully with session:", order._id);
  }

  private async createNewOrder(
    userId: string,
    tableId: string,
    updatedOrderItems: any[],
    sumPrice: number,
    session: any
  ): Promise<IOrder | null> {
    const [userExists, tableExists] = await Promise.all([
      this.userRepository.findById(userId),
      this.tableRepository.findById(tableId),
    ]);

    if (!userExists) {
      throw new Error("User not found");
    }
    // Cho phép nhiều khách cùng 1 bàn: chỉ cần bàn tồn tại (không bắt buộc AVAILABLE).
    if (!tableExists) {
      console.warn("Table not found:", tableId);
      throw new Error("Table not found");
    }

    const newOrder = await this.orderRepository.createOrder(
      {
        userId,
        tableId,
        totalPrice: sumPrice,
        tableName: tableExists.tableNumber,
        // Hiển thị tên khách cho nhân viên chọn (guest có fulname khi đăng ký).
        userName: userExists.fulname || userExists.username,
        status: TableOrderStatus.PENDING,
        orderItems: updatedOrderItems,
      } as IOrder,
      session // Sử dụng session khi tạo đơn hàng mới
    );

    // Cập nhật trạng thái bàn & Emit Socket
    await this.tableRepository.updateTableStatus(tableId, TableStatus.OCCUPIED);
    const io = getIo();
    io.emit("tableStatusChanged", { tableId, status: TableStatus.OCCUPIED });

    // Commit transaction
    await session.commitTransaction();
    return newOrder;
  }

  private createQueueItem(
    orderId: string,
    item: any,
    tableId: string,
    tableNumber: string
  ) {
    return {
      orderItemId: item._id,
      orderId,
      itemId: item.itemId,
      tableId,
      tableNumber,
      name: item.name,
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      quantity: item.quantity,
      status: FoodStatus.PENDING,
      difficultyLevel: item.difficultyLevel,
      note: item.note,
    };
  }

  // Lấy tất cả đơn hàng
  public async getAllOrders(): Promise<IOrder[]> {
    try {
      console.log("Fetching all orders");
      const orders = await this.orderRepository.findAll();
      console.log("Orders fetched successfully:", orders);
      return orders;
    } catch (error: any) {
      console.error(`Error fetching orders: ${error.message}`);
      throw new Error(`Error fetching orders: ${error.message}`);
    }
  }

  // Lấy đơn hàng theo ID
  public async getOrderById(orderId: string): Promise<IOrder | null> {
    try {
      console.log(`Fetching order by ID: ${orderId}`);
      const order = await this.orderRepository.findById(orderId);
      if (!order) {
        console.warn("Order not found:", orderId);
        throw new Error("Order not found");
      }
      console.log("Order fetched successfully:", order);
      return order;
    } catch (error: any) {
      console.error(`Error fetching order by ID: ${error.message}`);
      throw new Error(`Error fetching order by ID: ${error.message}`);
    }
  }

  // Lấy đơn hàng theo ID table
  public async getOrderByTable(tableId: string): Promise<IOrder | null> {
    try {
      console.log(`🔍 Fetching order by tableId: ${tableId}`);

      // Tìm đơn hàng theo tableId & trạng thái chưa hoàn thành
      const order = await this.orderRepository.findByTableId(tableId);

      if (!order) {
        return null; // Không ném lỗi, chỉ trả về null nếu không có order nào
      }

      console.log("✅ Order fetched successfully:", order);
      return order;
    } catch (error: any) {
      console.error(`❌ Error fetching order by tableId: ${error.message}`);
      throw new Error(`Error fetching order by tableId: ${error.message}`);
    }
  }

  // Đơn đang hoạt động của 1 khách tại 1 bàn (cho trang "đã đặt" của khách)
  public async getActiveOrderByUserAndTable(
    tableId: string,
    userId: string
  ): Promise<IOrder | null> {
    return await this.orderRepository.findActiveByTableAndUser(tableId, userId);
  }

  // Tất cả đơn đang hoạt động của 1 bàn (cho nhân viên chọn theo tên khách)
  public async getActiveOrdersByTable(tableId: string): Promise<IOrder[]> {
    return await this.orderRepository.findActiveOrdersByTable(tableId);
  }

  // Lấy đơn hàng theo ID table
  public async getOrderByUserId(userId: string): Promise<IOrder[] | null> {
    try {
      console.log(`🔍 Fetching order by userId: ${userId}`);

      // Tìm đơn hàng theo tableId & trạng thái chưa hoàn thành
      const order = await this.orderRepository.findByUserId(userId);

      if (!order) {
        console.warn("⚠️ No active order found for user:", userId);
        return null; // Không ném lỗi, chỉ trả về null nếu không có order nào
      }

      console.log("✅ Order fetched successfully:", order);
      return order;
    } catch (error: any) {
      console.error(`❌ Error fetching order by tableId: ${error.message}`);
      throw new Error(`Error fetching order by tableId: ${error.message}`);
    }
  }

  // Hàm cập nhật trạng thái đơn hàng
  async updateOrderStatus(orderId: string, newStatus: string) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const updatedOrder = await this.updateOrder(orderId, newStatus, session);

      if (!updatedOrder) {
        throw new Error("Order not found");
      }

      const tableId = updatedOrder.tableId as string;
      const table = await this.tableRepository.findById(tableId);
      const tableNumber = table ? table.tableNumber : "Unknown Table";

      let updatedTableStatus = table ? table.status : TableStatus.AVAILABLE;

      if (newStatus === TableOrderStatus.CONFIRMED) {
        await this.handleConfirmedOrder(
          updatedOrder,
          session,
          tableNumber,
          tableId
        );
      } else if (newStatus === TableOrderStatus.CANCELLED) {
        await this.handleCancelledOrder(updatedOrder, session, tableId);
      } else if (newStatus === TableOrderStatus.BILL_REQUESTED) {
        await this.handleBillRequestOrder(updatedOrder, session, tableId);
      } else if (newStatus === TableOrderStatus.COMPLETED) {
        await this.handleCompletedOrder(updatedOrder, session, tableId);
      }

      await session.commitTransaction();
      session.endSession();
      return updatedOrder;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error("❌ Lỗi khi cập nhật trạng thái đơn hàng:", error);
      throw new Error(
        `Không thể cập nhật trạng thái đơn hàng: ${(error as Error).message}`
      );
    }
  }

  // Hàm cập nhật trạng thái đơn hàng
  private async updateOrder(orderId: string, newStatus: string, session: any) {
    return await this.orderRepository.updateOrderStatus(
      orderId,
      newStatus,
      session
    );
  }

  // Hàm xử lý đơn hàng khi trạng thái là CONFIRMED
  private async handleConfirmedOrder(
    updatedOrder: any,
    session: any,
    tableNumber: string,
    tableId: string
  ) {
    // 1. Lọc ra các món cần đưa vào bếp
    const orderItemsData = updatedOrder.orderItems
      .map((item: any) => {
        if (item.readyToServeItems === false) {
          return {
            orderItemId: item._id,
            orderId: updatedOrder._id,
            itemId: item.itemId,
            tableId,
            tableNumber,
            name: item.name,
            categoryId: item.categoryId,
            categoryName: item.categoryName,
            quantity: item.quantity,
            status: FoodStatus.PENDING,
            difficultyLevel: item.difficultyLevel,
            note: item.note,
          };
        } else {
          item.status = FoodStatus.COMPLETED;
          item.completedTime = new Date();
        }
      })
      .filter((item: any) => item !== undefined);

    // 2. Lưu vào DB
    await KitchenQueueModel.insertMany(orderItemsData, { session });

    updatedOrder.orderTime = new Date();

    await TableModel.updateOne(
      { tableNumber },
      { $set: { waitingTimeAt: new Date() } }
    );

    // Emit vào bếp
    let io = getIo();
    io?.emit("orderSentToKitchen", {
      orderId: updatedOrder._id,
      items: updatedOrder.orderItems,
    });
  }

  // Chỉ trả bàn về AVAILABLE khi không còn đơn nào đang hoạt động (nhiều khách/bàn).
  private async freeTableIfNoActiveOrders(
    tableId: string,
    currentOrderId: any,
    session: any
  ): Promise<void> {
    const activeOrders = await this.orderRepository.findActiveOrdersByTable(
      tableId,
      session
    );
    const stillActive = activeOrders.filter(
      (o) => (o._id as any).toString() !== (currentOrderId as any).toString()
    );

    if (stillActive.length > 0) {
      // Vẫn còn khách khác tại bàn -> giữ OCCUPIED.
      return;
    }

    await this.tableRepository.updateTableStatus(
      tableId,
      TableStatus.AVAILABLE,
      session
    );
    const io = getIo();
    io?.emit("tableStatusChanged", {
      tableId,
      status: TableStatus.AVAILABLE,
    });
  }

  // Hàm xử lý đơn hàng khi trạng thái là CANCELLED
  private async handleCancelledOrder(
    updatedOrder: any,
    session: any,
    tableId: string
  ) {
    await KitchenQueueModel.deleteMany(
      { orderId: updatedOrder._id },
      { session }
    );

    await this.freeTableIfNoActiveOrders(tableId, updatedOrder._id, session);
  }

  // Hàm xử lý đơn hàng khi trạng thái là COMPLETED
  private async handleCompletedOrder(
    updatedOrder: any,
    session: any,
    tableId: string
  ) {
    updatedOrder.status = TableOrderStatus.COMPLETED;
    updatedOrder.updatedAt = new Date();
    await updatedOrder.save({ session });
    await this.updateRevenue(updatedOrder); // Cập nhật doanh thu cho đơn hàng

    await this.freeTableIfNoActiveOrders(tableId, updatedOrder._id, session);

    const io = getIo();
    io?.emit("orderStatusChanged", {
      orderId: updatedOrder._id,
      status: updatedOrder.status,
      tableId: updatedOrder.tableId,
    });
  }

  private async handleBillRequestOrder(
    updatedOrder: any,
    session: any,
    tableId: string
  ) {
    const discount = await this.hasDiscount(updatedOrder.userId);
    let discountAmount = 0;
    let discountPercent = 0;
    let sumPrice = updatedOrder.totalPrice; // Tổng tiền của đơn hàng
    log("Sum Price:", sumPrice);
    if (discount) {
      if (discount.type === "fixed") {
        discountAmount = Math.min(discount.value, sumPrice); // value là số tiền giảm
      } else {
        discountAmount = Math.floor(sumPrice * (discount.value / 100)); // value là % như 10
        discountPercent = discount.value; // Lưu lại phần trăm giảm giá
      }
    }
    log("Discount Amount:", discountAmount);
    log("Discount Percent:", discountPercent);
    log("Discount Code:", discount ? discount.code : "No discount");

    updatedOrder.status = TableOrderStatus.BILL_REQUESTED;
    updatedOrder.discountAmount = discountAmount; // Lưu lại số tiền giảm giá
    updatedOrder.discountPercent = discountPercent; // Lưu lại phần trăm giảm giá
    updatedOrder.codeDiscount = discount ? discount.code : ""; // Lưu lại mã giảm giá
    updatedOrder.updatedAt = new Date();
    await updatedOrder.save({ session });

    // 🔔 Emit updates to client-side using socket.io
    const io = getIo();
    if (io) {
      io.emit("orderStatusChanged", {
        orderId: updatedOrder._id,
        status: updatedOrder.status,
        tableId: tableId,
      });
    }
  }

  public async updateRevenue(order: any) {
    const totalRevenue = order.totalPrice; // Doanh thu của đơn hàng

    // Lấy thông tin ngày, tháng, năm từ orderTime
    const date = order.orderTime;
    console.log("Order time:", date);

    const day = date.toISOString().split("T")[0]; // Format: "YYYY-MM-DD"
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Format: "MM"
    const year = date.getFullYear(); // Năm

    try {
      // Cập nhật doanh thu cho ngày
      await RevenueModel.updateOne(
        { date: day }, // Tìm theo ngày
        {
          $set: { year: year, month: month }, // Cập nhật year và month (sử dụng $set)
          $inc: { totalRevenue: totalRevenue, totalOrders: 1 }, // Cập nhật doanh thu và số lượng đơn hàng (sử dụng $inc)
        },
        { upsert: true } // Tạo mới nếu không tìm thấy
      );
    } catch (error) {
      console.error("Error updating revenue:", error);
      throw new Error("Error updating revenue data.");
    }
  }
}
