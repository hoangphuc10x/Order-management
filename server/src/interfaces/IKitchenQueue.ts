import { Document, ObjectId } from "mongoose";
import { IOrder } from "./IOrder"; // Assuming you have an IOrder interface for the order model.

export interface IKitchenQueue extends Document {
  orderItemId: string; // ID of the order items
  orderId: IOrder["_id"]; // Reference to the Order model
  itemId: ObjectId; // Reference to the Item model (should match the Item schema type)
  name: string; // Name of the item in the queue
  userId: string;
  fulname: string;
  categoryId: string; // Category of the item
  categoryName: string;
  difficultyLevel: number; // Difficulty level of the item (1-5)
  quantity: number; // Quantity of the item
  status: string; // Current status of the item (e.g., "PENDING", "PROCESSING", "COMPLETED")
  tableNumber: string; // Table number associated with the order
  tableId: string;
  note: string; // Any special note for the kitchen regarding this item
  startCookingTime?: Date; // Time when the cooking started
  completionTime?: Date; // Time when the cooking was completed
  actualCookingTime?: number; // Time taken to cook (in seconds or milliseconds)
  createdAt: Date; // Timestamp when the kitchen queue item was created
  updatedAt: Date; // Timestamp when the kitchen queue item was last updated
}
