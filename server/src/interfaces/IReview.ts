import { Document } from "mongoose";
import { IUser } from "./IUser";
import { IMenuItem } from "./IMenuItem";

export interface IReview extends Document {
  userId: IUser["_id"],
  itemId: IMenuItem["_id"],
  rating: number,
  comment: string,
  createdAt: Date,
}