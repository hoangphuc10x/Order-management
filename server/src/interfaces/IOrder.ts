import { Document } from "mongoose";
import { ITable } from "./ITable";
import { IUser } from "./IUser";
import { IOrderItem } from "./IOrderItem";
import { TableOrderStatus } from "../enums/TableOrderStatus";
import { IDiscount } from "./IDiscount";

export interface IOrder extends Document {
  tableId: ITable["_id"];
  userId?: IUser["_id"];
  tableName: string;
  userName: string;
  totalPrice: number;
  codeDiscount: string; // 💡 mã giảm giá
  discountAmount: number; // 💡 số tiền đã giảm
  discountPercent: number; // 💡 phần trăm giảm giá
  status: TableOrderStatus;
  orderItems: IOrderItem[];
  orderTime: Date;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}
