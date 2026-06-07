import { NextFunction, Request, Response } from "express";
import { BaseController } from "./BaseController";
import { log } from "console";
import TableService from "../services/TableService";
import TableModel from "../models/TableModel";
import { multipleMongooseToObject } from "../util/mongoose";

export default class TableController extends BaseController {
  private tableService: TableService;
  constructor(tableService: TableService) {
    super();
    this.tableService = tableService;
  }

  // [GET] /tables/show
  public showTables = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      TableModel.find({})
        .then((tables) => {
          // console.log("Tables: ", tables: multipleMongooseToObject(tables));
          res.render("tables/show", {
            tables: multipleMongooseToObject(tables),
          });
        })
        .catch(next);
    } catch (error) {
      res.status(400).json({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    }
  };

  // [GET] /tables/get-all
  public getAllTables = async (req: Request, res: Response) => {
    try {
      const result = await this.tableService.getAllTables();
      if (!result || result.length === 0) {
        return this.sendError(res, 404, "Tables not found!");
      }
      return this.sendResponse(res, 200, { success: true, result });
    } catch (error) {
      log(error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };

  // [GET] /tables/:id
  public getTableDetail = async (req: Request, res: Response) => {
    try {
      const tableId = req.params.id;
      const result = await this.tableService.getTableDetail(tableId);
      if (!result) {
        return this.sendError(res, 404, "Table not found!");
      }
      return this.sendResponse(res, 200, { success: true, result });
    } catch (error) {
      log(error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };

  // [POST] /tables/create
  public createTable = async (req: Request, res: Response) => {
    try {
      const data = { ...req.body };
      log(data);
      const isCreated = await this.tableService.createTable(data);
      if (!isCreated) {
        return this.sendError(res, 400, "Failed to create table!");
      }
      return this.sendResponse(res, 201, {
        success: true,
        message: "Table created successfully!",
      });
    } catch (error) {
      log(error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };

  // [PUT] /tables/:id/delete
  public deleteTable = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const tableId = req.params.id;
      const isDeleted = await this.tableService.deteteTable(tableId);
      if (!isDeleted) {
        return this.sendError(res, 400, "Failed to delete table!");
      }
      return this.sendResponse(res, 200, {
        success: true,
        message: "Table deleted successfully!",
      });
    } catch (error) {
      log(error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };
}
