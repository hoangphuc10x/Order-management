import { log } from "console";
import { IOrder } from "../interfaces/IOrder";
import OrderModel from "../models/OrderModel";
import { BaseRepository } from "./BaseRepository";
import mongoose, { Types, ClientSession, startSession } from "mongoose";
import { TableOrderStatus } from "../enums/TableOrderStatus";

export default class OrderRepository extends BaseRepository<IOrder> {
  constructor() {
    super(OrderModel);
  }

  public findAllByCondition = async (query: object): Promise<IOrder[]> => {
    return await this.model.find(query).exec();
  };

  public findById = async (id: string): Promise<IOrder | null> => {
    return await this.model.findById(new Types.ObjectId(id)).exec();
  };

  public exists = async (userId: string): Promise<boolean> => {
    const order = await this.model
      .findOne({ userId: new Types.ObjectId(userId) })
      .exec();
    return !!order;
  };

  public findByTableId = async (tableId: string): Promise<IOrder | null> => {
    try {
      if (!mongoose.isValidObjectId(tableId)) {
        throw new Error("Invalid tableId format");
      }

      return await this.model
        .findOne({
          tableId: new Types.ObjectId(tableId),
          status: {
            $nin: [TableOrderStatus.COMPLETED, TableOrderStatus.CANCELLED],
          },
        })
        .lean<IOrder | null>()
        .exec();
    } catch (error) {
      console.error("Error finding order by tableId:", error);
      throw error;
    }
  };

  // Đơn đang hoạt động của 1 khách tại 1 bàn (duy nhất theo user+table)
  public findActiveByTableAndUser = async (
    tableId: string,
    userId: string
  ): Promise<IOrder | null> => {
    if (!mongoose.isValidObjectId(tableId) || !mongoose.isValidObjectId(userId)) {
      throw new Error("Invalid tableId/userId format");
    }
    return await this.model
      .findOne({
        tableId: new Types.ObjectId(tableId),
        userId: new Types.ObjectId(userId),
        status: {
          $nin: [TableOrderStatus.COMPLETED, TableOrderStatus.CANCELLED],
        },
      })
      .exec();
  };

  // Tất cả đơn đang hoạt động của 1 bàn (nhiều khách cùng bàn -> nhiều đơn)
  public findActiveOrdersByTable = async (
    tableId: string,
    session?: ClientSession
  ): Promise<IOrder[]> => {
    if (!mongoose.isValidObjectId(tableId)) {
      throw new Error("Invalid tableId format");
    }
    return await this.model
      .find({
        tableId: new Types.ObjectId(tableId),
        status: {
          $nin: [TableOrderStatus.COMPLETED, TableOrderStatus.CANCELLED],
        },
      })
      .session(session ?? null)
      .exec();
  };

  public findByUserId = async (userId: string): Promise<IOrder[]> => {
    try {
      if (!mongoose.isValidObjectId(userId)) {
        throw new Error("Invalid userId format");
      }

      return await this.model
        .find({
          userId: new Types.ObjectId(userId),
          // status: { $nin: [TableOrderStatus.COMPLETED, TableOrderStatus.CANCELED] },
        })
        .lean<IOrder[]>()
        .exec();
    } catch (error) {
      console.error("Error finding orders by userId:", error);
      throw error;
    }
  };

  // Hàm bắt đầu transaction
  public async startTransaction(): Promise<ClientSession> {
    const session = await startSession();
    session.startTransaction();
    return session;
  }

  // Thêm hỗ trợ transaction
  public createOrder = async (
    data: IOrder,
    session?: ClientSession
  ): Promise<IOrder> => {
    try {
      log("Creating order:", data);

      const [newOrder] = await this.model.create([{ ...data }], { session });
      return newOrder; // Trả về object thay vì mảng
    } catch (error) {
      log("Error creating order:", error);
      throw new Error("Failed to create order");
    }
  };

  // Cập nhật trạng thái order + phát sự kiện WebSocket
  public async updateOrderStatus(
    orderId: string,
    newStatus: string,
    session?: mongoose.ClientSession // ✅ Thêm session tùy chọn
  ): Promise<IOrder | null> {
    try {
      const updatedOrder = await this.model
        .findByIdAndUpdate(
          orderId,
          { status: newStatus },
          { new: true, session } // ✅ Sử dụng session nếu có
        )
        .exec();

      if (!updatedOrder) {
        throw new Error("Order not found");
      }

      return updatedOrder;
    } catch (error) {
      console.error("❌ Error updating order status:", error);
      throw new Error(
        "Failed to update order status: " + (error as Error).message
      );
    }
  }
}
