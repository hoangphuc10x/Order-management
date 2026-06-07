import { Types } from "mongoose";

export class DiscountDTO {
  constructor(
    public _id: Types.ObjectId,
    public code?: string,
    public type?: "percentage" | "fixed",
    public value?: number | null,
    public maxDiscount?: number | null,
    public minOrderValue?: number | null,
    public startDate?: Date,
    public endDate?: Date,
    public usageLimit?: number | null,
    public usedCount?: number | 0,
    public active?: boolean,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}
