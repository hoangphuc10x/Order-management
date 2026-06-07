import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { log } from "console";
import AdminService from "../services/AdminService";

export default class AdminController extends BaseController {
  private adminService: AdminService;

  constructor(adminService: AdminService) {
    super();
    this.adminService = adminService;
  }

  // [GET] revenues/daily
  public getRevenuesDaily = async (req: Request, res: Response) => {
    try {
      const { date } = req.query;
      console.log("date", date);

      const result = await this.adminService.getRevenueForDay(date as string);
      if (!result) {
        return this.sendError(res, 404, "Revenues not found!");
      }
      return this.sendResponse(res, 200, { success: true, result });
    } catch (error) {
      log(error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };

  // [GET] revenues/startDay-endDay
  public getStartEndOrder = async (req: Request, res: Response) => {
    try {
      const { startDate, endDate } = req.query;
      console.log("startDate", startDate);
      console.log("endDate", endDate);

      const result = await this.adminService.getStartEndOrder(
        startDate as string,
        endDate as string
      );
      if (!result) {
        return this.sendError(res, 404, "Revenues not found!");
      }
      return this.sendResponse(res, 200, { success: true, result });
    } catch (error) {
      log(error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };

  // [GET] revenues/monthly
  public getRevenuesMonthly = async (req: Request, res: Response) => {
    try {
      const { month, year } = req.query;
      console.log("month", month);
      console.log("year", year);
      const result = await this.adminService.getRevenueForMonth(
        month as string,
        year as string
      );
      if (!result) {
        return this.sendError(res, 404, "Revenues not found!");
      }
      return this.sendResponse(res, 200, { success: true, result });
    } catch (error) {
      log(error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };

  // [GET] revenues/annual
  public getRevenueForYear = async (req: Request, res: Response) => {
    try {
      const { year } = req.query;
      console.log("year", year);
      const result = await this.adminService.getRevenueForYear(year as string);
      if (!result) {
        return this.sendError(res, 404, "Revenues not found!");
      }
      return this.sendResponse(res, 200, { success: true, result });
    } catch (error) {
      log(error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };

  // [GET] revenues/total
  public getTotal = async (req: Request, res: Response) => {
    try {
      const result = await this.adminService.getTotal();
      if (!result) {
        return this.sendError(res, 404, "Revenues not found!");
      }
      return this.sendResponse(res, 200, { success: true, result });
    } catch (error) {
      log(error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };

  // [GET] /revenues/best-sales
  public getBestSales = async (req: Request, res: Response) => {
    try {
      const result = await this.adminService.getMostOrderedMenuItems();
      if (!result) {
        return this.sendError(res, 404, "Revenues not found!");
      }
      return this.sendResponse(res, 200, { success: true, result });
    } catch (error) {
      log(error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };

  // [GET] /revenues/order-monthly
  // Lấy doanh thu theo năm
  public getOrderForMonth = async (req: Request, res: Response) => {
    try {
      const { year } = req.query;
      console.log("year", year);
      const result = await this.adminService.getOrderForMonth(year as string);
      if (!result) {
        return this.sendError(res, 404, "Revenues not found!");
      }
      return this.sendResponse(res, 200, { success: true, result });
    } catch (error) {
      log(error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };

  // [GET] /revenues/all-staff
  // Lấy tất cả nhân viên
  public getAllStaff = async (req: Request, res: Response) => {
    try {
      const result = await this.adminService.getAllStaff();
      if (!result) {
        return this.sendError(res, 404, "Revenues not found!");
      }
      return this.sendResponse(res, 200, { success: true, result });
    } catch (error) {
      log(error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };

  // [GET] /revenues/staff/:id
  // Lấy thông tin nhân viên
  public getDetailStaff = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      console.log("id", id);
      const result = await this.adminService.getDetailStaff(id as string);
      if (!result) {
        return this.sendError(res, 404, "Revenues not found!");
      }
      return this.sendResponse(res, 200, { success: true, result });
    } catch (error) {
      log(error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };

  // [PUT] /revenues/update-staff/:id
  // Cập nhật thông tin nhân viên
  public updateStaff = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { username, role } = req.body;

      const data = {
        username,
        role,
      };

      const result = await this.adminService.updateStaff(id as string, data);
      if (!result) {
        return this.sendError(res, 404, "Revenues not found!");
      }
      return this.sendResponse(res, 200, { success: true, result });
    } catch (error) {
      log(error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };

  // [DELETE] /revenues/delete-staff/:id
  // Xóa nhân viên
  public deleteStaff = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      console.log("id", id);
      const result = await this.adminService.deleteStaff(id as string);
      if (!result) {
        return this.sendError(res, 404, "Revenues not found!");
      }
      return this.sendResponse(res, 200, { success: true, result });
    } catch (error) {
      log(error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };
}
