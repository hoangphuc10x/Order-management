import { log } from "console";
import { ITable } from "../interfaces/ITable";
import TableModel from "../models/TableModel";
import { BaseRepository } from "./BaseRepository";
import mongoose, { Types } from "mongoose";
import { TableStatus } from "../enums/TableStatus";

export default class TableRepository extends BaseRepository<ITable> {
  constructor() {
    super(TableModel);
  }

  public findAllByCondition = async (query: object): Promise<ITable[]> => {
    return await this.model.find(query).exec();
  };

  public findById = async (id: string): Promise<ITable | null> => {
    return await this.model.findById(new Types.ObjectId(id)).exec();
  };

  public async updateTableStatus(
    tableId: string,
    newStatus: TableStatus,
    session?: mongoose.ClientSession
  ) {
    try {
      const updatedTable = await TableModel.findByIdAndUpdate(
        tableId,
        { status: newStatus },
        { new: true, session } // ✅ Trả về dữ liệu sau khi cập nhật
      );

      if (!updatedTable) {
        throw new Error("Table not found");
      }

      return updatedTable;
    } catch (error) {
      console.error("❌ Error updating table status:", error);
      throw new Error("Failed to update table status");
    }
  }

  
  public createTable = async (data: ITable): Promise<ITable> => {
    try {
      const newTable = await this.model.create({
        ...data,
      });
      return newTable;
    } catch (error) {
      log("Error creating table:", error);
      throw new Error("Failed to create table");
    }
  };

  public deleteTable = async (tableId: string): Promise<boolean> => {
    const result = await this.model
      .deleteOne({ _id: new Types.ObjectId(tableId) })
      .exec();
    return result.deletedCount !== 0;
  };

  public async findOccupiedTableNames(): Promise<{ _id: string; tableNumber: string }[]> {
    const tables = await TableModel
      .find({ status: TableStatus.OCCUPIED })
      .select("_id tableNumber waitingTimeAt inform")
      .lean(); // ❗ lean để trả object JS thuần, không phải mongoose document

    return tables.map(table => ({
      _id: table._id.toString(),
      tableNumber: table.tableNumber,
      waitingTimeAt: table.waitingTimeAt,
      inform : table.inform
    }));
  }

  public async updateWaitingTimeAt( tableId: string ): Promise<void> {
    const now = new Date();
  await TableModel.updateOne(
    { _id: tableId },
    { $set: { waitingTimeAt: now } }
  );
  }

  public async updateInformStatus(
  tableId: string,
  status: boolean
): Promise<void> {
  // Truy vấn lấy trạng thái hiện tại
  const table = await TableModel.findById(tableId).select("inform");
  if (!table) {
    throw new Error(`Table ${tableId} not found`);
  }
  // Nếu trạng thái hiện tại đã đúng thì bỏ qua
  if (table.inform === status) {
    return; // ✅ không cần update
  }
  // Nếu khác thì mới update
  await TableModel.updateOne(
    { _id: new mongoose.Types.ObjectId(tableId) },
    { $set: { inform: status } }
  );
}

}
