import { Types } from "mongoose";

export class CategoryDTO {
  constructor(
    public _id: Types.ObjectId,
    public name: string,
    public description: string,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}
