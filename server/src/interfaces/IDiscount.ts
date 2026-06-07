import { Document } from "mongoose";

export interface IDiscount extends Document {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  maxDiscount?: number | null;
  minOrderValue?: number;
  startDate: Date;
  endDate: Date;
  usageLimit?: number | null;
  usedCount: number;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
