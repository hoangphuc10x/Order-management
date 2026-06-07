import { BaseRoutes } from "./BaseRoutes";
import OrderController from "../controllers/OrderController";
import {authMiddleware} from "../middleware/authenMidleware";
import {authorizeRoles} from "../middleware/authorMidleware";
export default class OrderRoutes extends BaseRoutes {
  private orderController: OrderController;

  constructor(orderController: OrderController) {
    super();
    this.orderController = orderController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get("/get-all",authMiddleware,authorizeRoles(["manager","chef_head","chef","staff","guest"]), this.orderController.getAllOrders);
    this.router.get("/:id",authMiddleware,authorizeRoles(["manager","chef_head","chef","staff","guest"]), this.orderController.getOrderById);
    this.router.get("/ordered/table/:tableId",authMiddleware,authorizeRoles(["manager","chef_head","chef","staff","guest"]), this.orderController.getOrderByTable);
    this.router.get("/ordered/user/:userId",authMiddleware,authorizeRoles(["manager","chef_head","chef","staff","guest"]),this.orderController.getOrderByUserId);
    // Update order status
    this.router.patch("/update-status/:id",authMiddleware,authorizeRoles(["manager","chef_head","staff","guest"]), this.orderController.updateOrderStatus);
    // Create or update an order, check if orderId exists
    // We use PUT if we want to update a specific resource or POST if it's a new resource
    this.router.post("/create-update-order",authMiddleware,authorizeRoles(["manager","chef_head","staff","guest"]), this.orderController.createOrUpdateOrder);
  }
}
