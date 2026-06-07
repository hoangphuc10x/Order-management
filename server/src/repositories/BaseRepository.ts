import { Model, Document } from "mongoose";

export abstract class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async findOne(query: any): Promise<T | null> {
    return this.model.findOne(query).exec();
  }

  async find(query: any): Promise<T[]> {
    return this.model.find(query).exec();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async create(data: Partial<T>): Promise<T> {
    const result = await this.model.create(data);
    return result;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  async updateOne(query: any, data: Partial<T>): Promise<boolean | null> {
    return await this.model.findOneAndUpdate(query, data).lean() !== null;
  }
}
