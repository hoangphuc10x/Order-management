import AdminController from "../controllers/AdminController";
import { BaseRoutes } from "./BaseRoutes";
import {authMiddleware} from "../middleware/authenMidleware";
import {authorizeRoles} from "../middleware/authorMidleware";

export default class AdminRoutes extends BaseRoutes {
  private adminController: AdminController;

  constructor(adminController: AdminController) {
    super();
    this.adminController = adminController;
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.get("/daily",authMiddleware,authorizeRoles(["manager"]),  this.adminController.getRevenuesDaily);
    this.router.get("/monthly",authMiddleware,authorizeRoles(["manager"]),  this.adminController.getRevenuesMonthly);
    this.router.get("/annual",authMiddleware,authorizeRoles(["manager"]),  this.adminController.getRevenueForYear);
    this.router.get("/total",authMiddleware,authorizeRoles(["manager"]),  this.adminController.getTotal);
    this.router.get("/best-sales",authMiddleware,authorizeRoles(["manager"]),  this.adminController.getBestSales);
    this.router.get("/startDay-endDay",authMiddleware,authorizeRoles(["manager"]),  this.adminController.getStartEndOrder);
    this.router.get("/order-monthly",authMiddleware,authorizeRoles(["manager"]),  this.adminController.getOrderForMonth);
    this.router.get("/all-staff",authMiddleware,authorizeRoles(["manager"]),  this.adminController.getAllStaff);
    this.router.get("/staff/:id",authMiddleware,authorizeRoles(["manager"]),  this.adminController.getDetailStaff);
    this.router.put("/update-staff/:id",authMiddleware,authorizeRoles(["manager"]),  this.adminController.updateStaff);
    this.router.delete("/delete-staff/:id",authMiddleware,authorizeRoles(["manager"]),  this.adminController.deleteStaff);
  }
}
