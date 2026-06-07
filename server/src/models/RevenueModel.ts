import mongoose, { Schema } from "mongoose";
import { IRevenue } from "../interfaces/IRevenue";

// Revenue Schema
const RevenueSchema: Schema = new Schema(
  {
    date: { type: String, required: true, unique: true },
    month: { type: String, required: true },
    year: { type: String, required: true },
    totalRevenue: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
      default: 0,
    }, // Doanh thu
    totalOrders: { type: Number, require: true, default: 0 }, // Số lượng đơn hàng
  },
  { timestamps: true }
);

const RevenueModel = mongoose.model<IRevenue>("Revenue", RevenueSchema);

export default RevenueModel;
