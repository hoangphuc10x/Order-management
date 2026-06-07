import { Types } from "mongoose";
import { BaseRepository } from "./BaseRepository";
import { IUser } from "../interfaces/IUser";
import UserModel from "../models/UserModel";

export default class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(UserModel);
  }

  public findAllByCondition = async (query: object): Promise<IUser[]> => {
    return await this.model.find(query).exec();
  };

  public findById = async (id: string): Promise<IUser | null> => {
    return await this.model.findById(new Types.ObjectId(id)).exec();
  };

  public deleteById(id: string): Promise<IUser | null> {
    return this.model.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }

  public getAllMenuItems = async (): Promise<IUser[]> => {
    return await this.model.find().exec();
  };

  public getMenuItemsById = async (id: string): Promise<IUser | null> => {
    return await this.model.findById(new Types.ObjectId(id)).exec();
  };

  public async deleteUserById(userId: string): Promise<boolean> {
    const result = await this.model.deleteOne({ _id: userId }).exec();
    return result.deletedCount === 1;
  }

  public async updateUserById(
    userId: string,
    data: Partial<IUser>
  ): Promise<IUser | null> {
    return await this.model
      .findByIdAndUpdate(userId, data, { new: true })
      .exec();
  }
}
