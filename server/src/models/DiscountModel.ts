// Import các thành phần cần thiết từ mongoose
import mongoose, { Schema } from "mongoose";

// Import interface TypeScript định nghĩa cấu trúc dữ liệu Discount
import { IDiscount } from "../interfaces/IDiscount";

// Khai báo schema cho collection "Discount"
const DiscountSchema: Schema = new Schema(
  {
    // Mã giảm giá (phải là duy nhất, viết hoa và không có khoảng trắng ở đầu/cuối)
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    // Loại giảm giá: 'percentage' (theo phần trăm) hoặc 'fixed' (số tiền cố định)
    type: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    // Giá trị của mã giảm giá (ví dụ: 10% hoặc 50000 VND)
    value: {
      type: Number,
      required: true,
      min: 0,
    },

    // Giảm tối đa được phép (chỉ áp dụng nếu là kiểu percentage)
    maxDiscount: {
      type: Number,
      default: null,
    },

    // Giá trị đơn hàng tối thiểu để được áp dụng mã giảm giá
    minOrderValue: {
      type: Number,
      default: 0,
    },

    // Ngày bắt đầu hiệu lực mã giảm giá
    startDate: {
      type: Date,
      default: Date.now,
    },

    // Ngày hết hạn của mã giảm giá
    endDate: {
      type: Date,
      required: true,
      set: function (value: any) {
        const date = new Date(value);
        date.setHours(23, 59, 59, 999); // chỉnh về cuối ngày
        return date;
      },
    },

    // Số lượt sử dụng tối đa (null nghĩa là không giới hạn)
    usageLimit: {
      type: Number,
      default: null,
    },

    // Số lượt đã sử dụng mã giảm giá
    usedCount: {
      type: Number,
      default: 0,
    },

    // Trạng thái mã giảm giá: có đang hoạt động hay không
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Tự động thêm `createdAt` và `updatedAt`
    timestamps: true,
  }
);

// Tạo model Mongoose từ schema đã khai báo
// Lưu ý: tên model là 'Inventories' có thể gây nhầm lẫn, nên nên đổi thành 'Discount'
const DiscountModel = mongoose.model<IDiscount>("Discount", DiscountSchema);

// Xuất model để sử dụng ở các phần khác của ứng dụng
export default DiscountModel;
