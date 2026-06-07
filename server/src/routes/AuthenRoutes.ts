import  AuthenController from "../controllers/AuthenController";
import { BaseRoutes } from "./BaseRoutes";

export default class AuthenRoutes extends BaseRoutes {
    private authenControler: AuthenController;
    
    constructor(authenController: AuthenController){
        super();
        this.authenControler = authenController;
        this.initiallizeRoutes();
    }

    private initiallizeRoutes(): void{
        this.router.post("/signup", AuthenController.signup);
        this.router.post("/login", AuthenController.login);
        this.router.post("/refresh-token", AuthenController.refreshToken);
        this.router.post("/logout", AuthenController.logout);
        this.router.patch("/update-profile/:id", AuthenController.updateUserInfo);
        this.router.patch("/change-password/:id", AuthenController.changePassword);
    }
}