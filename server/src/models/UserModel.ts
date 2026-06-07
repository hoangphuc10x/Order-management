import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/IUser";

// User Schema
const UserSchema: Schema = new Schema(
  {
    fulname: { type: String, required: false },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, required: false },
    phone: { type: String, unique: true, required: false },
    avatarUrl: { type: String },
    role: {
      type: String,
      enum: ["manager","staff","chef_head","chef","guest"],
      required: true,
    },
    status: {
      type: String,
      enum: ["STANDBY", "COOKING","BUSYING","LAY-OFF"],
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true } // auto create createdAt, updatedAt);
);

const UserModel = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
