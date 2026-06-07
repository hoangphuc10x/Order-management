import { Types } from "mongoose";

export class KitchenQueueDTO {
  constructor(
    public _id: Types.ObjectId,
    public orderId: Types.ObjectId,
    public itemId: string,
    public name: string,
    public quantity: number,
    public status: string,
    public tableNumber: string,
    public createdAt: Date,
    public updatedAt: Date,
    public orderItemId: string
  ) {}
}
