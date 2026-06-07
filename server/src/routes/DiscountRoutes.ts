import DiscountController from "../controllers/DiscountController";
import { BaseRoutes } from "./BaseRoutes";
import {authMiddleware} from "../middleware/authenMidleware";
import {authorizeRoles} from "../middleware/authorMidleware";

export default class DiscountRoutes extends BaseRoutes {
  private discountController: DiscountController;

  constructor(discountController: DiscountController) {
    super();
    this.discountController = discountController;
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    // // Public routes
    this.router.get("/get-all",authMiddleware,authorizeRoles(["manager"]), this.discountController.getAllDiscounts);
    this.router.get("/:id",authMiddleware,authorizeRoles(["manager"]),this.discountController.getDiscountDetail);
    this.router.post("/create",authMiddleware,authorizeRoles(["manager"]), this.discountController.createDiscount);
    this.router.delete("/delete/:id",authMiddleware,authorizeRoles(["manager"]), this.discountController.deleteDiscount);
    this.router.patch("/update/:id",authMiddleware,authorizeRoles(["manager"]), this.discountController.updateDiscount);
  }
}
