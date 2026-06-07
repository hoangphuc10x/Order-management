import { Types } from "mongoose";
import { IDiscount } from "../interfaces/IDiscount";
import DiscountModel from "../models/DiscountModel";
import { BaseRepository } from "./BaseRepository";

export default class DiscountRepository extends BaseRepository<IDiscount> {
  constructor() {
    super(DiscountModel);
  }

  public findAllByCondition = async (condition: any): Promise<any[]> => {
    try {
      return await this.model.find(condition);
    } catch (error) {
      throw new Error("Failed to find discounts by condition");
    }
  };

  public findDiscountByDiscountId = async (
    discountId: string
  ): Promise<any | null> => {
    try {
      return await this.model.findById(discountId);
    } catch (error) {
      throw new Error("Failed to find discount by ID");
    }
  };

  public findOne(query: any): Promise<IDiscount | null> {
    return this.model.findOne(query);
  }

  public create = async (discountData: any): Promise<IDiscount> => {
    try {
      return await this.model.create(discountData);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to create discount");
    }
  };

  // Delete a discount by ID
  public deleteDiscountById = async (discountId: string): Promise<any> => {
    try {
      return await this.model.findByIdAndDelete(discountId);
    } catch (error) {
      throw new Error("Failed to delete discount");
    }
  };

  public updateDiscountById = async (
    discountId: string,
    newActive: boolean // Sử dụng kiểu dữ liệu boolean thay vì any
  ): Promise<any> => {
    try {
      // Kiểm tra tính hợp lệ của discountId
      if (!Types.ObjectId.isValid(discountId)) {
        throw new Error("Invalid discount ID");
      }

      // Cập nhật mã giảm giá
      const updatedDiscount = await this.model
        .findByIdAndUpdate(
          discountId,
          { active: newActive },
          { new: true } // Trả về tài liệu đã được cập nhật
        )
        .exec();

      // Nếu không tìm thấy mã giảm giá
      if (!updatedDiscount) {
        throw new Error("Discount not found");
      }

      return updatedDiscount;
    } catch (error) {
      // Xử lý lỗi và ném ra thông báo chi tiết
      throw new Error(`Failed to update discount`);
    }
  };
}
