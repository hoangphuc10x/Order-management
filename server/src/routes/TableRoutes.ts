import { BaseRoutes } from "./BaseRoutes";
import TableController from "../controllers/TableController";
import {authMiddleware} from "../middleware/authenMidleware";
import {authorizeRoles} from "../middleware/authorMidleware";

export default class TableRoutes extends BaseRoutes {
  private tableController: TableController;

  constructor(tableController: TableController) {
    super();
    this.tableController = tableController;
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    // show create template
    this.router.get("/show",authMiddleware,authorizeRoles(["manager","chef_head","chef","staff"]), this.tableController.showTables);
    // Public routes
    this.router.get("/get-all", this.tableController.getAllTables);
    this.router.get("/:id",authMiddleware,authorizeRoles(["manager","chef_head","chef","staff"]), this.tableController.getTableDetail);
    this.router.post("/create",authMiddleware,authorizeRoles(["manager","chef_head","staff"]), this.tableController.createTable);
    // this.router.put("/:id/edit", this.tableController.updateTable);
    this.router.delete("/delete/:id",authMiddleware,authorizeRoles(["manager","chef_head","staff"]), this.tableController.deleteTable);
    
  }
}
