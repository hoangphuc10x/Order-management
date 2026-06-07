import { Document } from "mongoose";

export interface IRevenue extends Document {
  date: string;
  month: string;
  year: string;
  totalRevenue: number;
  totalOrders: number;
}
