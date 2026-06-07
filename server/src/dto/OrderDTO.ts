import { Types } from "mongoose";
import { TableOrderStatus } from "../enums/TableOrderStatus";

export class OrderDTO {
  constructor(
    public _id: Types.ObjectId,
    public tableId: string,
    public tableName: string,
    public userName: string,
    public userId: string,
    public totalPrice: number,
    public status: TableOrderStatus,
    public orderItems: any[],
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
