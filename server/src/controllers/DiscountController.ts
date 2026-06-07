import { NextFunction, Request, Response } from "express";
import DiscountService from "../services/DiscountService";
import { BaseController } from "./BaseController";
import { log } from "console";

export default class DiscountController extends BaseController {
  private discountService: DiscountService;

  constructor(discountService: DiscountService) {
    super();
    this.discountService = discountService;
  }

  // [GET] /discount/get-all
  public getAllDiscounts = async (req: Request, res: Response) => {
    try {
      const discounts = await this.discountService.getAllDiscounts();
      if (!discounts || discounts.length === 0) {
        return this.sendError(res, 404, "No discounts found!");
      }
      return this.sendResponse(res, 200, { success: true, discounts });
    } catch (error) {
      log("Error fetching discounts:", error);
      return this.sendError(res, 500, "Internal server error");
    }
  };

  // [GET] /discount/:id
  public getDiscountDetail = async (req: Request, res: Response) => {
    try {
      const discountId = req.params.id;
      const discount = await this.discountService.getDiscountDetail(discountId);
      if (!discount) {
        return this.sendError(res, 404, "Discount not found!");
      }
      return this.sendResponse(res, 200, { success: true, discount });
    } catch (error) {
      log("Error fetching discount:", error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };
  // [POST] /discount/create
  public createDiscount = async (req: Request, res: Response) => {
    try {
      const discountData = req.body;
      const newDiscount = await this.discountService.createDiscount(
        discountData
      );
      return this.sendResponse(res, 201, {
        success: true,
        discount: newDiscount,
      });
    } catch (error) {
      log("Error creating discount:", error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };

  // [DELETE] /discount/:id/delete
  public deleteDiscount = async (req: Request, res: Response) => {
    try {
      const discountId = req.params.id;
      const deletedDiscount = await this.discountService.deleteDiscount(
        discountId
      );
      if (!deletedDiscount) {
        return this.sendError(res, 404, "Discount not found!");
      }
      return this.sendResponse(res, 200, {
        success: true,
        message: "Discount deleted successfully!",
      });
    } catch (error) {
      log("Error deleting discount:", error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };

  // [PATCH] /discount/Update/:id
  public updateDiscount = async (req: Request, res: Response) => {
    try {
      const discountId = req.params.id;
      const { active } = req.body;
      const updatedDiscount = await this.discountService.updateDiscount(
        discountId,
        active
      );
      if (!updatedDiscount) {
        return this.sendError(res, 404, "Discount not found!");
      }
      return this.sendResponse(res, 200, {
        success: true,
        message: "Discount updated successfully!",
        discount: updatedDiscount,
      });
    } catch (error) {
      log("Error updating discount:", error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };
}
