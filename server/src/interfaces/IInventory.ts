import { Document } from "mongoose";

export interface IInventory extends Document {
  name: string;
  quantity: number;
  unit: string;
  lastUpdated: Date;
}
