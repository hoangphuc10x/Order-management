import { Document } from "mongoose";

export const multipleMongooseToObject = (mongooses: Document[]): object[] => {
  return mongooses.map((mongoose) => mongoose.toObject());
};

export const mongooseToObject = (mongoose: Document | null): object | null => {
  return mongoose ? mongoose.toObject() : mongoose;
};
