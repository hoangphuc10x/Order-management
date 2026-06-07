import { Request, Response, NextFunction } from "express";
import { BaseController } from "./BaseController";
import UserService from "../services/UserService";
import { log } from "console";

export default class UserController extends BaseController {
    private userService: UserService;

    constructor(userService: UserService) {
        super();
        this.userService = userService;
    }

    public getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const users = await this.userService.getAllUsers();

            if (!users || users.length === 0) {
                return this.sendError(res, 404, "No users found.");
            }

            this.sendResponse(res, 200, users);
            console.log("Get all users successfully: ", users);
        } catch (error) {
            log("Error fetching users:", error);
            next(error);
        }
    };

    public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.params.id;
            const user = await this.userService.getUserById(userId);

            if (!user) {
                return this.sendError(res, 404, "User not found.");
            }

            this.sendResponse(res, 200, user);
        } catch (error) {
            log("Error fetching user by ID:", error);
            next(error);
        }
    };

    public deleteUser = async (req: Request, res: Response) => {
        try {
          const { id } = req.params;
          const deleted = await this.userService.deleteUser(id);
      
          if (!deleted) {
            return this.sendError(res, 404, "User not found");
          }
      
          return this.sendResponse(res, 200, { success: true, message: "User deleted successfully" });
        } catch (error) {
          console.error("❌ Error deleting user:", error);
          return this.sendError(res, 500, "Failed to delete user");
        }
      };
      
      public updateUser = async (req: Request, res: Response) => {
        try {
          const { id } = req.params;
          const updatedUser = await this.userService.updateUser(id, req.body);
      
          if (!updatedUser) {
            return this.sendError(res, 404, "User not found");
          }
      
          return this.sendResponse(res, 200, { success: true, updatedUser });
        } catch (error) {
          console.error("❌ Error updating user:", error);
          return this.sendError(res, 500, "Failed to update user");
        }
      };
      
}
