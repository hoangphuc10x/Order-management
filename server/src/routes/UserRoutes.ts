import { BaseRoutes } from "./BaseRoutes";
import UserController from "../controllers/UserController";
import {authMiddleware} from "../middleware/authenMidleware";
import {authorizeRoles} from "../middleware/authorMidleware";

export default class UserRoutes extends BaseRoutes {
    private userController: UserController;

    constructor(userController: UserController) {
        super();
        this.userController = userController;
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.get("/",authMiddleware,authorizeRoles(["manager"]), this.userController.getAllUsers);
        this.router.get("/:id",authMiddleware,authorizeRoles(["manager"]), this.userController.getUserById);
        this.router.delete("/:id",authMiddleware,authorizeRoles(["manager"]),  this.userController.deleteUser);
        this.router.put("/:id",authMiddleware,authorizeRoles(["manager"]),  this.userController.updateUser);

    }
}
