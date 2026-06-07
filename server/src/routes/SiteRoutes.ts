import { BaseRoutes } from "./BaseRoutes";
import SiteController from "../controllers/SiteController";

export default class SiteRouters extends BaseRoutes {
  private siteController: SiteController;

  constructor(siteController: SiteController) {
    super();
    this.siteController = siteController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Public routes
    this.router.get("/", this.siteController.index);
    // this.router.get("/:id", this.menuItemController.getMenuItemsById);
  }
}