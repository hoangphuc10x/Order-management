import mongoose, { Schema } from "mongoose";
import { IPayment } from "../interfaces/IPayment";

// Payment Schema
const PaymentSchema: Schema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
  amount: { type: mongoose.Types.Decimal128, required: true },
  paymentMethod: {
    type: String,
    enum: ["cash", "card", "online"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  paidAt: { type: Date },
});

const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);

export default PaymentModel;
