import { Document } from "mongoose";
import { IMenuItem } from "./IMenuItem";
import { IInventory } from "./IInventory";

export interface IRecipeIngredient extends Document {
  itemId: IMenuItem["_id"];
  inventoryId: IInventory["_id"];
  quantityNeeded: number;
}
