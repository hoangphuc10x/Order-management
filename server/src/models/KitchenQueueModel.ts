import mongoose, { Schema } from "mongoose";
import { IKitchenQueue } from "../interfaces/IKitchenQueue";
import { FoodStatus } from "../enums/FoodStatus";

// Kitchen Queue Schema
const KitchenQueueSchema: Schema = new Schema(
  {
    orderItemId: { type: Schema.Types.ObjectId,ref: "OrderItem",required: true,},
    orderId: { type: Schema.Types.ObjectId,ref: "Order",required: true,},
    itemId: { type: Schema.Types.ObjectId,ref: "Item",required: true,},
    tableNumber: { type: String,required: true,},
    tableId: { type: String,required: false,},
    name: { type: String,required: true,},
    userId:{ type: String, required: false},
    fulname:{ type: String, required: false},
    categoryId: { type: String, required: true },
    categoryName: { type: String, required: true },
    difficultyLevel: { type: Number,},
    quantity: { type: Number,required: true,},
    status: { type: String, default: FoodStatus.PENDING,required: true,},
    startCookingTime: { type: Date,},  // Thời gian bắt đầu chế biến món ăn
    completionTime: { type: Date,},  // Thời gian hoàn thành món ăn
    actualCookingTime: { type: Number, }, // Thời gian thực tế chế biến (tính từ startCookingTime đến completionTime)
    note: { type: String },
  },
  { timestamps: true } // Tự động lưu thời gian tạo và cập nhật
);

const KitchenQueueModel = mongoose.model<IKitchenQueue>(
  "KitchenQueue",
  KitchenQueueSchema
);

export default KitchenQueueModel;
