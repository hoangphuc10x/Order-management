import { NextFunction, Request, Response } from "express";
import { BaseController } from "./BaseController";
import CategoryService from "../services/CategoryService";
import { log } from "console";

export default class CategoryController extends BaseController {
  private categoryService: CategoryService;

  constructor(categoryService: CategoryService) {
    super();
    this.categoryService = categoryService;
  }

  // [GET] /categories/get-all
  public getAllCategories = async (req: Request, res: Response) => {
    try {
      const result = await this.categoryService.getAllCategories();
      if (!result || result.length === 0) {
        return this.sendError(res, 404, "Categories not found!");
      }
      return this.sendResponse(res, 200, { success: true, result });
    } catch (error) {
      log(error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };

  // [GET] /categories/:id
  public getCategoryDetail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const categoryId = req.params.id;
      const result = await this.categoryService.getCategoryDetail(categoryId);
      if (!result) {
        return this.sendError(res, 404, "Category not found!");
      }
      return this.sendResponse(res, 200, { success: true, result });
    } catch (error) {
      log(error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };

  // [GET] /categories/create
  public createShow = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      res.render("categories/create");
    } catch (error) {
      res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  // [POST] /categories/create
  public createCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const data = { ...req.body };
      console.log(data);

      const isCreated = await this.categoryService.createCategory(data);
      if (!isCreated) {
        return this.sendError(res, 400, "Failed to create category!");
      }
      return this.sendResponse(res, 201, {
        success: true,
        message: "Job created successfully!",
      });
    } catch (error) {
      console.error("Error creating category:", error);
      next(error);
    }
  };

  // [POST] /categories/:id/update
  public updateCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const categoryId = req.params.id;
      const data = { ...req.body };

      const isUpdated = await this.categoryService.updateCategory(
        categoryId,
        data
      );
      if (!isUpdated) {
        return this.sendError(res, 400, "Failed to update category!");
      }
      return this.sendResponse(res, 200, {
        success: true,
        message: "Category updated successfully!",
      });
    } catch (error) {
      console.error("Error updating category:", error);
      next(error);
    }
  };

  // [DELETE] /categories/:id/delete
  public deleteCategory = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const categoryId = req.params.id;
      const isDeleted = await this.categoryService.deleteCategory(categoryId);
      if (!isDeleted) {
        return this.sendError(res, 400, "Failed to delete category!");
      }
      return this.sendResponse(res, 200, {
        success: true,
        message: "Category deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting category:", error);
      next(error);
    }
  };
}
