import { Document } from "mongoose";
import { IOrder } from "./IOrder";

export interface IPayment extends Document {
  orderId: IOrder["_id"];
  amount: number;
  paymentMethod: string;
  status: string;
  paidAt: Date;
}
