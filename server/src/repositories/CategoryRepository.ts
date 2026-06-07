import { Types } from "mongoose";
import { BaseRepository } from "./BaseRepository";
import CategoryModel from "../models/CategoryModel";
import { ICategory } from "../interfaces/ICategory";
import { log } from "console";

export default class CategoryRepository extends BaseRepository<ICategory> {
  constructor() {
    super(CategoryModel);
  }

  public findAllByCondition = async (query: object): Promise<ICategory[]> => {
    return await this.model.find(query).exec();
  };

  public findById = async (id: string): Promise<ICategory | null> => {
    return await this.model.findById(new Types.ObjectId(id)).exec();
  };

  public findCategoryByCategoryId = (
    categoryId: string
  ): Promise<ICategory | null> => {
    log("categoryId", categoryId);
    return this.model.findOne({ _id: new Types.ObjectId(categoryId) }).exec();
  };

  public createCategory = async (data: ICategory): Promise<ICategory> => {
    try {
      log("data", data);
      const newCategory = await this.model.create({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return newCategory;
    } catch (error) {
      log("Error creating category:", error);
      throw new Error("Failed to create category");
    }
  };

  public updateCategory = async (
    categoryId: string,
    data: Partial<ICategory>
  ): Promise<ICategory | null> => {
    return await this.model
      .findByIdAndUpdate(new Types.ObjectId(categoryId), data, { new: true })
      .exec();
  };

  public deleteCategory = async (categoryId: string): Promise<boolean> => {
    const result = await this.model
      .deleteOne({ _id: new Types.ObjectId(categoryId) })
      .exec();
    return result.deletedCount !== 0;
  };
}
