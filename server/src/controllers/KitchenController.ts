import { NextFunction, Request, Response } from "express";
import { BaseController } from "./BaseController";
import { log } from "console";
import KitchenService from "../services/KitchenService";
export default class KitchenController extends BaseController {
  private kitchenService: KitchenService;
  constructor(kitchenService: KitchenService) {
    super();
    this.kitchenService = kitchenService;
  }
  // [GET] /kitchen/get-all
  public getAllOrderItems = async (req: Request, res: Response) => {
    try {
      const result = await this.kitchenService.getAllOrderItems();
      return this.sendResponse(res, 200, { success: true, result });
    } catch (error) {
      log(error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };
  // [PATCH] /kitchens/update-status/:id
  public updateItemStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { orderItemIds, status, orderId } = req.body; // Trạng thái mới
      if (!status) {
        return this.sendError(res, 400, "Missing status in request body!");
      }
      const updatedItem = await this.kitchenService.updateKitchenStatus(
        orderItemIds,
        status,
        orderId
      );
      if (!updatedItem) {
        return this.sendError(res, 404, "Item not found in kitchen queue!");
      }
      return this.sendResponse(res, 200, { success: true, updatedItem });
    } catch (error) {
      console.error("❌ Error updating item status:", error);
      next(error);
    }
  };
  // [GET] /summary-food
  public getGroupedItems = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const groupedItems = await this.kitchenService.getGroupedKitchenItems();
      console.error("Get data succesful", groupedItems);
      res.status(200).json({ success: true, data: groupedItems });
    } catch (error) {
      console.error("❌ Error getting grouped items:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to group kitchen items" });
    }
  };
  public getItemsByCategoryInKitchenItems = async (
    req: Request,
    res: Response
  ) => {
    try {
      const categoryId = req.params.categoryId;
      if (!categoryId) {
        res
          .status(404)
          .json({ success: false, message: "categoryId not found" });
      }
      const result = await this.kitchenService.getItemsByCategoryInKitchenItems(
        categoryId
      );
      if (!result || result.length === 0) {
        return this.sendError(res, 404, "No items found for this categoryId");
      }

      return this.sendResponse(res, 200, result);
    } catch (error) {
      console.error("❌ Error:", error);
      return this.sendError(res, 500, "Server error");
    }
  };

  public getAllCategoriesInKitchenQueue = async (
    req: Request,
    res: Response
  ) => {
    try {
      const categories =
        await this.kitchenService.getAllCategoriesInKitchenQueue();
      return this.sendResponse(res, 200, categories);
    } catch (error) {
      console.error("❌ Error getting kitchen categories:", error);
      return this.sendError(res, 500, "Failed to fetch kitchen categories");
    }
  };

  // [GET] /occupied-table
  public getOccupiedTableNames = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const tableNames = await this.kitchenService.getOccupiedTableNames();
      res.status(200).json({ success: true, data: tableNames });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Error getting occupied tables" });
    }
  };

  // [GET] /items-by-table/:id
  public getItemsByTableId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const tableId = req.params.tableid;
      console.log("tableid:", tableId);

      const items = await this.kitchenService.findKitchenItemsByTableId(
        tableId
      );
      res.status(200).json({ success: true, items });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      res.status(400).json({ success: false, message });
    }
  };
  // [GET] /completed-items/
  public getCompletedItems = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const items = await this.kitchenService.getCompletedKitchenItems();
      return this.sendResponse(res, 200, items);
    } catch (error) {
      console.error("❌ Error fetching completed kitchen items:", error);
      return this.sendError(res, 500, "Failed to fetch completed items");
    }
  };
  // [GET] /all-item-by-itemid-in-kichen/:id
  public getAllItemByItemIdInKichenQueue = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const itemId = req.params.itemId;
      if (!itemId) {
        console.log("itemid đéo có");
        return this.sendError(res, 400, "No itemId found");
      }
      const results = await this.kitchenService.getAllItemByItemIdInKichenQueue(
        itemId
      );
      if (!results || results.length === 0) {
        return this.sendError(res, 404, "No Items found for this item");
      }
      return this.sendResponse(res, 200, results);
    } catch (error) {
      console.error("❌ Error fetching order info by itemId:", error);
      return this.sendError(res, 500, "Failed to fetch data");
    }
  };

  // [GET] /orders-by-item/:id
  public getOrdersByItemId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const itemId = req.query.itemId as string;
      const status = req.query.status as string;
      if (!itemId) {
        console.log("itemid đéo có");
        return this.sendError(res, 404, "No itemId found");
      }
      if (!status) {
        console.log("status đéo có");
        return this.sendError(res, 404, "No status found");
      }
      // const status =  req.body.status;
      const results = await this.kitchenService.getOrderInfoByItemId(
        itemId,
        status
      );

      if (!results || results.length === 0) {
        return this.sendError(res, 404, "No orders found for this item");
      }

      return this.sendResponse(res, 200, results);
    } catch (error) {
      console.error("❌ Error fetching order info by itemId:", error);
      return this.sendError(res, 500, "Failed to fetch data");
    }
  };

  public getChefList = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const chefs = await this.kitchenService.findChef();
      if (!chefs || chefs.length === 0) {
        return this.sendError(res, 404, "No chef found for this item");
      }
      return this.sendResponse(res, 200, chefs);
    } catch (error) {
      console.error("❌ Error fetching order info by itemId:", error);
      return this.sendError(res, 500, "Failed to fetch data");
    }
  };

  public assignChefToKitchenItem = async (req: Request, res: Response) => {
    try {
      const { userId, orderItemIds } = req.body;
      const results = await this.kitchenService.assignChefToKitchenItem(
        userId,
        orderItemIds
      );
      if (!results || results.length === 0) {
        return this.sendError(res, 404, "No orders found for this item");
      }

      return this.sendResponse(res, 200, results);
    } catch (error) {
      console.error("❌ Error fetching order info by itemId:", error);
      return this.sendError(res, 500, "Failed to fetch data");
    }
  };

  public updateChefStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.id;
      const { status } = req.body;
      const allowedStatuses = ["STANDBY", "COOKING", "BUSYING", "LAY-OFF"];
      if (!allowedStatuses.includes(status)) {
        return this.sendError(res, 400, "Trạng thái không hợp lệ");
      }
      const updatedUser = await this.kitchenService.updateChefStatus(
        userId,
        status
      );
      if (!updatedUser) {
        return this.sendError(res, 404, "Không tìm thấy người dùng");
      }
      return this.sendResponse(res, 200, {
        success: true,
        message: "Cập nhật trạng thái đầu bếp thành công",
        data: updatedUser,
      });
    } catch (error: any) {
      console.error("❌ Lỗi updateChefStatus:", error);
      return this.sendError(res, 500, error.message || "Lỗi máy chủ");
    }
  };
  public getItemsByChef = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.id;
      console.log("userID", userId);

      const items = await this.kitchenService.getItemsByChef(userId);
      if (!items || items.length === 0) {
        return this.sendResponse(res, 200, {
          success: true,
          message: "Đầu bếp chưa được gán món nào.",
          data: [],
        });
      }
      return this.sendResponse(res, 200, {
        success: true,
        message: "Danh sách món của đầu bếp",
        data: items,
      });
    } catch (error: any) {
      console.error("❌ Lỗi khi lấy món theo đầu bếp:", error);
      return this.sendError(res, 500, error.message || "Lỗi máy chủ");
    }
  };
}
