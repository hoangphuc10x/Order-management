import { BaseRepository } from "./BaseRepository";
import KitchenQueueModel from "../models/KitchenQueueModel";
import { IKitchenQueue } from "../interfaces/IKitchenQueue";
import { FoodStatus } from "../enums/FoodStatus";
import mongoose, { Types, ClientSession, startSession } from "mongoose";
import OrderModel from "../models/OrderModel";
import { getIo } from "../sockets/socket";
import TableModel from "../models/TableModel";
import CategoryModel from "../models/CategoryModel";
export default class KitchenRepository extends BaseRepository<IKitchenQueue> {
  constructor() {
    super(KitchenQueueModel);
  }
  public async startTransaction(): Promise<ClientSession> {
    const session = await startSession();
    session.startTransaction();
    return session;
  }
  public findAllByCondition = async (
    query: object
  ): Promise<IKitchenQueue[]> => {
    return await this.model.find(query).exec();
  };
  public async findByTableId(tableId: string): Promise<IKitchenQueue[]> {
    const queue = await KitchenQueueModel.find({ tableId })
      .sort({ updatedAt: -1 })
      .exec();
    return queue;
  }

  public findById = async (id: string): Promise<IKitchenQueue | null> => {
    return await this.model.findById(new Types.ObjectId(id)).exec();
  };

  public async findByUserId(userId: string): Promise<IKitchenQueue[]> {
    return await this.model.find({ userId });
  }
  public findByIdAndUpdate = async (
    id: string,
    update: Partial<IKitchenQueue>
  ): Promise<IKitchenQueue | null> => {
    return this.model
      .findByIdAndUpdate(new Types.ObjectId(id), update, { new: true })
      .exec();
  };
  public getAllOrderItems = async (): Promise<IKitchenQueue[]> => {
    return await KitchenQueueModel.find({
      // status: { $ne: FoodStatus.COMPLETED },
    });
  };
  public getOrderItemsById = async (
    id: string
  ): Promise<IKitchenQueue | null> => {
    return await this.model.findById(new Types.ObjectId(id)).exec();
  };
  public async insertMany(
    items: Partial<IKitchenQueue>[],
    session?: ClientSession
  ): Promise<IKitchenQueue[]> {
    const result = await this.model.insertMany(items);
    return result as IKitchenQueue[];
  }
  public async findKitchenItemsForGrouping(): Promise<IKitchenQueue[]> {
    return await this.model
      .find({
        status: { $in: ["PENDING", "PROCESSING"] },
      })
      .lean();
  }

  public async getGroupedItemsByCategoryId(categoryId: string): Promise<any[]> {
    return await this.model.find({ categoryId }).lean();
  }
  public async getAllCategoriesInKitchenQueue(): Promise<
    { categoryId: string; categoryName: string }[]
  > {
    const categoryIds = await this.model.distinct("categoryId");

    const categories = await CategoryModel.find({
      _id: { $in: categoryIds },
    })
      .select("_id name")
      .lean();

    return categories.map((cat) => ({
      categoryId: cat._id.toString(),
      categoryName: cat.name,
    }));
  }

  public async getAllItemByItemIdInKichenQueue(itemId: string): Promise<any[]> {
    return await KitchenQueueModel.find({ itemId }).lean();
  }
  public async getOrdersByItemId(
    itemId: string,
    status: string
  ): Promise<any[]> {
    return await KitchenQueueModel.find({ itemId, status })
      .select("orderId tableNumber quantity note status")
      .lean();
  }

  public async getCompletedItems(): Promise<IKitchenQueue[]> {
    return await this.model.find({ status: "COMPLETED" });
  }
  public async findByItemAndOrders(
    itemId: string,
    orderIds: string[]
  ): Promise<IKitchenQueue[]> {
    return await this.model
      .find({
        itemId: new mongoose.Types.ObjectId(itemId),
        orderId: { $in: orderIds.map((id) => new mongoose.Types.ObjectId(id)) },
      })
      .exec();
  }

  public findByorderItemIds = async (
    orderItemIds: string[]
  ): Promise<IKitchenQueue[]> => {
    return await this.model
      .find({
        orderItemId: {
          $in: orderItemIds.map(
            (orderItemId) => new mongoose.Types.ObjectId(orderItemId)
          ),
        },
      })
      .exec();
  };

  public async deleteById(id: string): Promise<void> {
    await this.model.deleteOne({ orderItemId: id });
  }

  public async updateWaitingTimeAt(tableNumber: string): Promise<void> {
    await this.model
      .updateOne({ tableNumber }, { $set: { waitingTimeAt: new Date() } })
      .exec();
  }
}
