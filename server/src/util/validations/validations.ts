import Joi from "joi";
import mongoose, { Schema } from "mongoose";

export const orderSchema = Joi.object({
  tableId: Joi.string().required(),
  userId: Joi.string().required(),
  totalPrice: Joi.number().required(),
  orderItems: Joi.array().items(Joi.object()).required(),
});
