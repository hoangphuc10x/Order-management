import { Request, Response, NextFunction } from "express";
import { BaseController } from "./BaseController";
import OrderService from "../services/OrderService";
import { log } from "console";

export default class OrderController extends BaseController {
  private orderService: OrderService;

  constructor(orderService: OrderService) {
    super();
    this.orderService = orderService;
  }

  // [GET] /order/get-all
  public getAllOrders = async (req: Request, res: Response) => {
    try {
      const orders = await this.orderService.getAllOrders();
      if (!orders || orders.length === 0) {
        console.log("Response status:", 404);
        return this.sendError(res, 404, "No orders found!");
      }
      console.log("Response", 200);
      return this.sendResponse(res, 200, { success: true, orders });
    } catch (error) {
      console.log("Response status:", 500);
      log("Error fetching orders:", error);
      return this.sendError(res, 500, "Internal server error");
    }
  };

  // [GET] /order/:id
  //chuyển thành slug
  public getOrderById = async (req: Request, res: Response) => {
    try {
      const orderId = req.params.id;
      const order = await this.orderService.getOrderById(orderId);
      if (!order) {
        console.log("Response status: ", 404);

        return this.sendError(res, 404, "Order not found!");
      }
      return this.sendResponse(res, 200, { success: true, order });
    } catch (error) {
      console.log("Response status: ", 500);
      log("Error fetching order:", error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };

  // [GET] /orders/ordered/table/:tableId
  public getOrderByTable = async (req: Request, res: Response) => {
    try {
      const tableId = req.params.tableId;
      // Tìm order chưa hoàn thành (PENDING / CONFIRMED)
      console.log("tableId: ", tableId);
      const order = await this.orderService.getOrderByTable(tableId);

      // if (!order) {
      //   console.log("Response status: ", 404);

      //   return this.sendError(res, 404, "Order not found!");
      // }
      return this.sendResponse(res, 200, { success: true, order });
    } catch (error) {
      console.log("Response status: ", 500);
      log("Error fetching order:", error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };

  // [GET] orders/ordered/user/:userId
  public getOrderByUserId = async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const order = await this.orderService.getOrderByUserId(userId);
      if (!order) {
        console.log("Response status: ", 404);

        return this.sendError(res, 404, "Order not found!");
      }
      return this.sendResponse(res, 200, { success: true, order });
    } catch (error) {
      console.log("Response status: ", 500);
      log("Error fetching order:", error);
      return this.sendError(res, 500, "Internal Server Error!");
    }
  };

  // [PATCH] /orders/update-status/:id
  public updateOrderStatus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const orderId = req.params.id;
      const { status } = req.body;
      const updatedOrder = await this.orderService.updateOrderStatus(
        orderId,
        status
      );
      if (!updatedOrder) {
        return this.sendError(res, 404, "Order not found!");
      }
      return this.sendResponse(res, 200, { success: true, updatedOrder });
    } catch (error) {
      log("Error updating order status:", error);
      next(error);
    }
  };

  // Phương thức tạo mới hoặc cập nhật đơn hàng
  public createOrUpdateOrder = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const orderData = req.body; // Lấy dữ liệu đơn hàng từ body
      let orderId: string | undefined = req.body.orderId; // Lấy orderId từ body

      // Kiểm tra nếu có orderId thì gọi update, nếu không có thì tạo mới
      if (orderId) {
        // Nếu có orderId, gọi phương thức cập nhật
        const newOrder = await this.orderService.createOrUpdateOrder(
          orderData,
          orderId
        );
        if (!newOrder) {
          return this.sendError(res, 400, "Failed to update order!");
        }
        return this.sendResponse(res, 200, { success: true, newOrder });
      } else {
        // Nếu không có orderId, gọi phương thức tạo mới
        const newOrder = await this.orderService.createOrUpdateOrder(orderData);
        if (!newOrder) {
          return this.sendError(res, 400, "Failed to create order!");
        }
        return this.sendResponse(res, 201, { success: true, newOrder });
      }
    } catch (error) {
      console.log("Error creating or updating order:", error);
      next(error); // Chuyển lỗi cho middleware xử lý lỗi
    }
  };
}
