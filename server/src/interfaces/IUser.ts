import { Document } from "mongoose";

export interface IUser extends Document {
  fulname: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  avatarUrl: string;
  role: string;
  isActive: boolean;
  status: string;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}
