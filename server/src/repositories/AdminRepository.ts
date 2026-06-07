import { Types } from "mongoose";
import { IRevenue } from "../interfaces/IRevenue";
import RevenueModel from "../models/RevenueModel";
import { BaseRepository } from "./BaseRepository";

export default class AdminRepository extends BaseRepository<IRevenue> {
  constructor() {
    super(RevenueModel);
  }
  public findAllByCondition = async (query: object): Promise<IRevenue[]> => {
    return await this.model.find(query).exec();
  };

  public findById = async (id: string): Promise<IRevenue | null> => {
    return await this.model.findById(new Types.ObjectId(id)).exec();
  };

  public findOne = async (query: object): Promise<IRevenue | null> => {
    return await this.model.findOne(query).exec();
  };

  public findAll(): Promise<IRevenue[]> {
    return this.model.find().exec();
  }

  public all(): Promise<IRevenue[]> {
    return this.model.find().exec();
  }

}
