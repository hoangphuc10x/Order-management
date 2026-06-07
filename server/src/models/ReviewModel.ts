import mongoose, { Schema } from "mongoose";
import { IReview } from "../interfaces/IReview";

// Review Schema
const ReviewSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  itemId: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);

export default ReviewModel;
