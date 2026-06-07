import mongoose, { Schema } from "mongoose";
import { ICategory } from "../interfaces/ICategory";
import MenuItemModel from "./MenuItemModel";

// Category Schema
const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true } // auto create createdAt, updatedAt);
);
// Middleware tự động cập nhật categoryName trong MenuItem khi Category.name thay đổi
CategorySchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate(); // Lấy dữ liệu cập nhật

  if (!update || typeof update !== "object") {
    return next(); // Nếu không có update hoặc update không phải object, bỏ qua middleware
  }

  // Kiểm tra nếu update có chứa $set.name hoặc update trực tiếp có name
  const newName = (update as any)?.$set?.name ?? (update as any)?.name;

  if (newName) {
    const category = await this.model.findOne(this.getQuery());
    if (category) {
      await MenuItemModel.updateMany(
        { categoryId: category._id },
        { categoryName: newName }
      );
    }
  }

  next();
});

// Cách xóa tất cả MenuItem khi Category bị xóa
// CategorySchema.pre("findOneAndDelete", async function (next) {
//   const category = await this.model.findOne(this.getQuery());
//   if (category) {
//     await MenuItemModel.deleteMany({ categoryId: category._id });
//   }
//   next();
// });

const CategoryModel = mongoose.model<ICategory>("Category", CategorySchema);

export default CategoryModel;
