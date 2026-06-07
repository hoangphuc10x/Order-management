import { Types } from "mongoose";

export class MenuItemDTO {
  constructor(
    public _id: Types.ObjectId,
    public name: string,
    public description: string,
    public price: number,
    public imageUrl: string,
    public categoryId: string,
    public categoryName: string,
    public isAvailable: boolean,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
