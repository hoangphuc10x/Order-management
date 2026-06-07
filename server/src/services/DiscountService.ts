import { Types } from "mongoose";
import { DiscountDTO } from "../dto/DiscountDTO";
import { IDiscount } from "../interfaces/IDiscount";
import DiscountRepository from "../repositories/DiscountRepository";
import { log } from "node:console";

export default class DiscountService {
  private discountRepository: DiscountRepository;

  constructor(discountRepository: DiscountRepository) {
    this.discountRepository = discountRepository;
  }

  private toDiscountDTO = (discount: IDiscount): DiscountDTO => {
    const {
      _id,
      code,
      type,
      value,
      maxDiscount,
      minOrderValue,
      startDate,
      endDate,
      usageLimit,
      usedCount,
      active,
      createdAt,
      updatedAt,
    } = discount;

    return new DiscountDTO(
      new Types.ObjectId(_id as string),
      code,
      type,
      value,
      maxDiscount ?? null,
      minOrderValue ?? null,
      startDate ?? new Date(),
      endDate ?? new Date(),
      usageLimit ?? null,
      usedCount ?? 0,
      active ?? false,
      createdAt ?? new Date(),
      updatedAt ?? new Date()
    );
  };

  public getAllDiscounts = async (): Promise<DiscountDTO[]> => {
    try {
      const discounts = await this.discountRepository.findAllByCondition({});
      const discountDTOs = discounts.map(this.toDiscountDTO);
      return discountDTOs;
    } catch (error) {
      throw new Error("Failed to get all discounts");
    }
  };

  public getDiscountDetail = async (
    discountId: string
  ): Promise<DiscountDTO | null> => {
    try {
      if (!discountId || !Types.ObjectId.isValid(discountId)) {
        throw new Error("Invalid discount ID");
      }
      const discount = await this.discountRepository.findDiscountByDiscountId(
        discountId
      );
      const discountDTO = discount ? this.toDiscountDTO(discount) : null;
      return discountDTO;
    } catch (error) {
      throw new Error("Failed to get discount detail");
    }
  };

  // Create a new discount
  public createDiscount = async (
    discountData: Partial<IDiscount>
  ): Promise<DiscountDTO> => {
    try {
      const newDiscount = await this.discountRepository.create(discountData);
      return this.toDiscountDTO(newDiscount);
    } catch (error) {
      throw new Error("Failed to create discount");
    }
  };

  // Delete a discount
  public deleteDiscount = async (
    discountId: string
  ): Promise<DiscountDTO | null> => {
    try {
      if (!discountId || !Types.ObjectId.isValid(discountId)) {
        throw new Error("Invalid discount ID");
      }
      const discount = await this.discountRepository.deleteDiscountById(
        discountId
      );
      if (!discount) {
        return null;
      }
      await this.discountRepository.delete(discountId);
      return this.toDiscountDTO(discount);
    } catch (error) {
      throw new Error("Failed to delete discount");
    }
  };

  // Update a discount
  updateDiscount = async (
    discountId: string,
    active: boolean
  ): Promise<DiscountDTO | null> => {
    try {
      // Kiểm tra tính hợp lệ của discountId
      if (!discountId || !Types.ObjectId.isValid(discountId)) {
        throw new Error("Invalid discount ID");
      }

      // Log thông tin cập nhật
      log("Updating discount with ID:", discountId);
      log("New active status:", active);

      // Cập nhật trạng thái active của mã giảm giá
      const updatedDiscount = await this.discountRepository.updateDiscountById(
        discountId,
        active
      );

      // Kiểm tra nếu không tìm thấy mã giảm giá để cập nhật
      if (!updatedDiscount) {
        log(`Discount with ID: ${discountId} not found`);
        return null;
      }

      // Chuyển đổi mã giảm giá đã cập nhật thành DTO và trả về
      return this.toDiscountDTO(updatedDiscount);
    } catch (error) {
      // Log thông báo lỗi chi tiết
      log("Error occurred while updating discount:", error);
      throw new Error(`Failed to update discount`);
    }
  };
}
