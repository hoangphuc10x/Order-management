import CategoryController from "../controllers/CategoryController";
import { BaseRoutes } from "./BaseRoutes";
import {authMiddleware} from "../middleware/authenMidleware";
import {authorizeRoles} from "../middleware/authorMidleware";

export default class CategoryRoutes extends BaseRoutes {
  private categoryController: CategoryController;

  constructor(categoryController: CategoryController) {
    super();
    this.categoryController = categoryController;
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    // show create template
    this.router.get("/createShow",authMiddleware,authorizeRoles(["manager","staff","chef_head","chef","guest"]),  this.categoryController.createShow);
    // Public routes
    this.router.get("/get-all",authMiddleware,authorizeRoles(["manager","staff","chef_head","chef","guest"]),  this.categoryController.getAllCategories);
    this.router.get("/:id",authMiddleware,authorizeRoles(["manager","staff","chef_head","chef","guest"]),  this.categoryController.getCategoryDetail);
    this.router.post("/create",authMiddleware,authorizeRoles(["manager"]),   this.categoryController.createCategory);
    this.router.put("/:id/edit",authMiddleware,authorizeRoles(["manager"]),  this.categoryController.updateCategory);
    this.router.delete("/:id/delete",authMiddleware,authorizeRoles(["manager"]),  this.categoryController.deleteCategory);
  }
}
