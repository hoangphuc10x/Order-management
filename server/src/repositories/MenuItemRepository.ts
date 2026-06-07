import { Types } from "mongoose";
import { IMenuItem } from "../interfaces/IMenuItem";
import MenuItemModel from "../models/MenuItemModel";
import { BaseRepository } from "./BaseRepository";

export default class MenuItemRepository extends BaseRepository<IMenuItem> {
  constructor() {
    super(MenuItemModel);
  }

  public findAllByCondition = async (query: object): Promise<IMenuItem[]> => {
    return await this.model.find(query).exec();
  };

  public findById = async (id: string): Promise<IMenuItem | null> => {
    return await this.model.findById(new Types.ObjectId(id)).exec();
  };

  public findByIds = async (ids: string[]): Promise<IMenuItem[]> => {
    const validIds = ids
      .filter((id) => Types.ObjectId.isValid(id))
      .map((id) => new Types.ObjectId(id));
    if (validIds.length === 0) {
      throw new Error("No valid menu item IDs provided");
    }
    return await this.model.find({ _id: { $in: validIds } }).exec();
  };

  public getAllMenuItems = async (): Promise<IMenuItem[]> => {
    return await this.model.find().exec();
  };

  public getMenuItemsById = async (id: string): Promise<IMenuItem | null> => {
    return await this.model.findById(new Types.ObjectId(id)).exec();
  };

  public createMenuItem = async (data: IMenuItem): Promise<IMenuItem> => {
    try {
      const newMenuItem = await this.model.create({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return newMenuItem;
    } catch (error) {
      throw new Error("Failed to create menu item");
    }
  };

  public updateMenuItem = async (
    id: string,
    data: IMenuItem
  ): Promise<IMenuItem | null> => {
    try {
      const updatedMenuItem = await this.model
        .findByIdAndUpdate(
          new Types.ObjectId(id),
          { ...data, updatedAt: new Date() },
          { new: true }
        )
        .exec();
      return updatedMenuItem;
    } catch (error) {
      throw new Error("Failed to update menu item");
    }
  };

  public deleteMenuItem = async (id: string): Promise<boolean> => {
    try {
      await this.model.findByIdAndDelete(new Types.ObjectId(id)).exec();
      return true;
    } catch (error) {
      throw new Error("Failed to delete menu item");
    }
  };
}
