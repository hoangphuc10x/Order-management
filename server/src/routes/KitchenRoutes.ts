import { BaseRoutes } from "./BaseRoutes";
import KitchenController from "../controllers/KitchenController";
import {authMiddleware} from "../middleware/authenMidleware";
import {authorizeRoles} from "../middleware/authorMidleware";
export default class KitchenRouters extends BaseRoutes {
  private kitchenController: KitchenController;

  constructor(kitchenController: KitchenController) {
    super();
    this.kitchenController = kitchenController;
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // show create template
    this.router.get("/get-all", authMiddleware,authorizeRoles(["manager","chef_head","chef", "staff"]), this.kitchenController.getAllOrderItems);
    // cập nhật trạng thái món
    this.router.patch("/update-status", authMiddleware,authorizeRoles(["manager","chef_head","chef", "staff"]),this.kitchenController.updateItemStatus);
    // món trùng lặp
    this.router.get("/summary-food", authMiddleware,authorizeRoles(["manager","chef_head","chef", "staff"]), this.kitchenController.getGroupedItems);
    // món hoàn thành
    this.router.get("/completed-items", authMiddleware,authorizeRoles(["manager","chef_head","chef", "staff"]),this.kitchenController.getCompletedItems);
    // lấy các category trong kitchen queue
    this.router.get("/categories", authMiddleware,authorizeRoles(["manager","chef_head","chef", "staff"]),this.kitchenController.getAllCategoriesInKitchenQueue);
    //lọc theo categoryId
    this.router.get("/get-items-by-categoryId/:categoryId", authMiddleware,authorizeRoles(["manager","chef_head","chef", "staff"]),this.kitchenController.getItemsByCategoryInKitchenItems);
    // các bàn đang được sử dụng
    this.router.get("/occupied-table", authMiddleware,authorizeRoles(["manager","chef_head","chef", "staff"]),this.kitchenController.getOccupiedTableNames);
    // bàn có món nào truyền tableID
    this.router.get("/items-in-table/:tableid", authMiddleware,authorizeRoles(["manager","chef_head","chef", "staff"]),this.kitchenController.getItemsByTableId);
    // món có trong bàn nào truyền itemId và status
    this.router.get("/orders-of-item", authMiddleware,authorizeRoles(["manager","chef_head","chef", "staff"]),this.kitchenController.getOrdersByItemId);
    // gọi nhân viên và trạng thái nhân viên
    this.router.get("/get-all-chef-cooking", authMiddleware,authorizeRoles(["manager","chef_head"]),this.kitchenController.getChefList);
    // xem đầu bếp nào đang nấu món nào
    this.router.get("/get-items-by-chef/:id", authMiddleware,authorizeRoles(["manager","chef_head"]),this.kitchenController.getItemsByChef);
    // chọn bếp nào nấu món nào
    this.router.patch("/assign-chef-cooking/", authMiddleware,authorizeRoles(["manager","chef_head"]),this.kitchenController.assignChefToKitchenItem);
    // dổi trạng thái của đầu bếp
    this.router.patch("/chefs-change-status/:id", authMiddleware,authorizeRoles(["manager","chef_head","chef"]),this.kitchenController.updateChefStatus);



  }
}
