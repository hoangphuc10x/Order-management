import { BaseRoutes } from "./BaseRoutes";
import MenuItemController from "../controllers/MenuItemController";
import {authMiddleware} from "../middleware/authenMidleware";
import {authorizeRoles} from "../middleware/authorMidleware";

export default class MenuItemRouters extends BaseRoutes {
  private menuItemController: MenuItemController;

  constructor(menuItemController: MenuItemController) {
    super();
    this.menuItemController = menuItemController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // show create template
    this.router.get("/createShow",authMiddleware, this.menuItemController.createShow);
    // Public routes
    this.router.get("/get-all",authMiddleware, this.menuItemController.getAllMenuItems);
    this.router.get("/:id",authMiddleware, this.menuItemController.getMenuItemDetail);
    this.router.post("/create",authMiddleware,authorizeRoles(["manager"]),this.menuItemController.createMenuItem);
    this.router.put("/:id/edit",authMiddleware,authorizeRoles(["manager"]),this.menuItemController.updateMenuItem);
    this.router.delete("/:id/delete",authMiddleware,authorizeRoles(["manager"]),this.menuItemController.deleteMenuItem);
  }
}
