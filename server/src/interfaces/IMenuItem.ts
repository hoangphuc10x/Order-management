import { Document } from "mongoose";
import { ICategory } from "./ICategory";

export interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: { 
    categoryId: ICategory["_id"]; 
    categoryName: string 
  };
  isAvailable: boolean;
  difficultyLevel: number;
  readyToServeItems: boolean; // Số lượng món đã chế biến xong
  createdAt: Date;
  updatedAt: Date;
}
