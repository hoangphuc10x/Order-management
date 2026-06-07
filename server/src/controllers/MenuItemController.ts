import { NextFunction, Request, Response } from "express";
import { BaseController } from "./BaseController";
import MenuItemService from "../services/MenuItemService";
import { log } from "console";

export default class MenuItemController extends BaseController {
  private menuItemService: MenuItemService;

  constructor(menuItemService: MenuItemService) {
    super();
    this.menuItemService = menuItemService;
  }

  // [GET] /menu-item/get-all
  public getAllMenuItems = async (req: Request, res: Response) => {
    try {
      const result = await this.menuItemService.getAllMenuItems();
      // Kiểm tra danh sách rỗng
      if (!result || result.length === 0) {
        return this.sendError(res, 404, "Menu items not found!");
      }
      return this.sendResponse(res, 200, { success: true, result });
    } catch (error) {
      log(error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };

  // [GET] /menu-item/:id
  public getMenuItemDetail = async (req: Request, res: Response) => {
    try {
      const menuItemId = req.params.id;
      console.log("id: ", req.params._id);

      const result = await this.menuItemService.findByMenuItemId(menuItemId);
      // Kiểm tra danh sách rỗng
      if (!result) {
        return this.sendError(res, 404, "Menu item not found!");
      }

      return this.sendResponse(res, 200, { success: true, result });
    } catch (error) {
      log(error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };

  // Show [GET] /menu-item/createShow
  public createShow = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.render("menus/create");
    } catch (error) {
      res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  // [POST] /menu-item/create
  public createMenuItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = req.body;
      console.log("Received data: ", data);

      // Kiểm tra nếu category hoặc categoryId thiếu
      if (!data.category || !data.category.categoryId) {
        return this.sendError(res, 400, "categoryId is required");
      }

      // Gọi service để tạo menu item
      const isCreated = await this.menuItemService.createMenuItem(
        data.category.categoryId, // Đúng cách truy xuất categoryId
        data
      );

      if (!isCreated) {
        return this.sendError(res, 400, "Failed to create menu item!");
      }

      return this.sendResponse(res, 201, {
        success: true,
        message: "Menu item created successfully!",
      });
    } catch (error) {
      console.error("Error in createMenuItem:", error);
      next(error);
    }
  };

  // [PUT] /menu-item/:id/edit
  public updateMenuItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const menuItemId = req.params.id;
      const data = req.body;

      const isUpdated = await this.menuItemService.updateMenuItem(
        menuItemId,
        data
      );
      if (!isUpdated) {
        return this.sendError(res, 400, "Failed to update menu item!");
      }
      return this.sendResponse(res, 200, {
        success: true,
        message: "Menu item updated successfully!",
      });
    } catch (error) {
      console.error("Error updating menu item:", error);
      next(error);
    }
  };

  // [DELETE] /menu-item/:id/delete
  public deleteMenuItem = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const menuItemId = req.params.id;
      const isDeleted = await this.menuItemService.deleteMenuItem(menuItemId);
      if (!isDeleted) {
        return this.sendError(res, 400, "Failed to delete menu item!");
      }
      return this.sendResponse(res, 200, {
        success: true,
        message: "Menu item deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      next(error);
    }
  };
}
