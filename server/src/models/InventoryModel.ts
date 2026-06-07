import mongoose, { Schema } from 'mongoose';
import { IInventory } from "../interfaces/IInventory";


// Inventory Schema
const InventorySchema: Schema = new Schema({
  name: { type: String, required: true },
  quantity: { type: mongoose.Types.Decimal128, required: true },
  unit: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

const InventoryModel = mongoose.model<IInventory>(
  "Inventories",
  InventorySchema
);

export default InventoryModel;
