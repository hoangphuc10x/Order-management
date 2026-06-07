import mongoose, { Schema } from "mongoose";
import { IRecipeIngredient } from "../interfaces/IRecipeIngredient";

// Recipe Ingredients Schema
const RecipeIngredientSchema: Schema = new Schema({
  itemId: { type: Schema.Types.ObjectId, ref: "MenuItem", required: true },
  inventoryId: {
    type: Schema.Types.ObjectId,
    ref: "Inventory",
    required: true,
  },
  quantityNeeded: { type: mongoose.Types.Decimal128, required: true },
});

// Revenue Schema

const RecipeIngredientModel = mongoose.model<IRecipeIngredient>(
  "RecipeIngredient",
  RecipeIngredientSchema
);

export default RecipeIngredientModel;
