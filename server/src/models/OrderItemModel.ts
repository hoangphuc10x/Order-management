import mongoose, { Schema } from "mongoose";
import { IOrderItem } from "../interfaces/IOrderItem";
import { FoodStatus } from "../enums/FoodStatus";

// Order Item Schema
export const OrderItemSchema: Schema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, auto: true },
    itemId: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: {
      type: String,
    },
    categoryId: { type: String, required: true },
    categoryName: { type: String, required: true },
    note: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: mongoose.Types.Decimal128, required: true },
    status: {
      type: String,
      enum: Object.values(FoodStatus), // limit the value of status
      default: FoodStatus.PENDING,
    },
    difficultyLevel: { type: Number, default: 1, require: true }, // 1-5
    readyToServeItems: { type: Boolean, require: true }, // Số lượng món đã chế biến xong
  },
  { timestamps: true } // auto create createdAt, updatedAt
);

// Change `price` from Decimal128 to Number when sending data out
OrderItemSchema.set("toJSON", {
  transform: (_, ret) => {
    ret.price = parseFloat(ret.price.toString());
    return ret;
  },
});

const OrderItemModel = mongoose.model<IOrderItem>("OrderItem", OrderItemSchema);
export default OrderItemModel;
