import { Request, Response, NextFunction } from "express";
import { BaseController } from "./BaseController";
import AuthenService from "../services/AuthenService";

export default class AuthenController extends BaseController {
  static async signup(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { fulname, username, email, password, phone, avatarUrl, role } =
        req.body;
      if (role == "guest") {
        // check value
        if (username == null) {
          console.log("User name of user is required");
          return AuthenController.prototype.sendError(
            res,
            400,
            "User name of user is required"
          );
        }
        if (phone == null) {
          console.log("Phone Number is required");
          return AuthenController.prototype.sendError(
            res,
            400,
            "Phone Number is required"
          );
        }
        if (password == null) {
          console.log("Password is required");
          return AuthenController.prototype.sendError(
            res,
            400,
            "Password is required"
          );
        }
        const existingUserPhoneNUmber =
          await AuthenService.findUserByUserPhoneNUmber(phone);
        if (existingUserPhoneNUmber) {
          console.log("phone of user is already exist");
          return AuthenController.prototype.sendError(
            res,
            400,
            "Phone of user is already exist"
          );
        }
        //check existing
        const existingUserName = await AuthenService.findUserByUserName(
          username
        );
        if (existingUserName) {
          console.log("UserName is already exist");
          return AuthenController.prototype.sendError(
            res,
            400,
            "UserName is already exist"
          );
        }

        const user = await AuthenService.createUser({
          fulname,
          username,
          email,
          password,
          phone,
          avatarUrl,
          role,
        });
        const accessToken = AuthenService.generateAccessToken(user);
        const refreshToken = AuthenService.generateRefreshToken(user);

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        AuthenController.prototype.sendResponse(res, 201, {
          user,
          accessToken,
          refreshToken,
        });
        console.log("signup successfully");
        console.log("access tocken: ", accessToken);
        console.log("refresh tocken: ", refreshToken);
      } else {
        console.log("Request body:", req.body);

        if (fulname == null) {
          console.log("Missing name");
          return AuthenController.prototype.sendError(
            res,
            400,
            "Name of user is required"
          );
        }

        if (phone == null) {
          console.log("Missing phone");
          return AuthenController.prototype.sendError(
            res,
            400,
            "Phone Number is required"
          );
        }

        if (username == null) {
          console.log("Missing username");
          return AuthenController.prototype.sendError(
            res,
            400,
            "User name of user is required"
          );
        }

        if (email == null) {
          console.log("Missing email");
          return AuthenController.prototype.sendError(
            res,
            400,
            "Email is required"
          );
        }

        if (password == null) {
          console.log("Missing password");
          return AuthenController.prototype.sendError(
            res,
            400,
            "Password is required"
          );
        }

        if (role == null) {
          console.log("Missing role");
          return AuthenController.prototype.sendError(
            res,
            400,
            "Role is required"
          );
        }
        const existingEmail = await AuthenService.findUserByUserEmail(email);
        if (existingEmail) {
          console.log("email is already exist");
          return AuthenController.prototype.sendError(
            res,
            400,
            "Email is already exist"
          );
        }
        const existingUserName = await AuthenService.findUserByUserName(
          username
        );
        if (existingUserName) {
          console.log("UserName is already exist");
          return AuthenController.prototype.sendError(
            res,
            400,
            "UserName is already exist"
          );
        }
        const existingUserPhoneNUmber =
          await AuthenService.findUserByUserPhoneNUmber(phone);
        if (existingUserPhoneNUmber) {
          console.log("phone of user is already exist");
          return AuthenController.prototype.sendError(
            res,
            400,
            "Phone of user is already exist"
          );
        }

        const user = await AuthenService.createUser({
          fulname,
          username,
          email,
          password,
          phone,
          avatarUrl,
          role,
        });
        const accessToken = AuthenService.generateAccessToken(user);
        const refreshToken = AuthenService.generateRefreshToken(user);

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        AuthenController.prototype.sendResponse(res, 201, {
          user,
          accessToken,
          refreshToken,
        });
        console.log("signup successfully");
        console.log("access tocken: ", accessToken);
        console.log("refresh tocken: ", refreshToken);
      }
    } catch (error) {
      next(error);
    }
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { usernameOrEmail, password } = req.body;

      const user = await AuthenService.findUserByUsernameOrEmail(
        usernameOrEmail
      );
      if (!user) {
        return AuthenController.prototype.sendError(res, 404, "User not found");
      }

      const isMatch = await AuthenService.comparePasswords(
        password,
        user.password
      );
      if (!isMatch) {
        return AuthenController.prototype.sendError(
          res,
          400,
          "Invalid credentials"
        );
      }

      const accessToken = AuthenService.generateAccessToken(user);
      const refreshToken = AuthenService.generateRefreshToken(user);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      AuthenController.prototype.sendResponse(res, 200, {
        user,
        accessToken,
        refreshToken,
      });
      console.log("login successfully");
      console.log("access tocken: ", accessToken);
      console.log("refresh tocken: ", refreshToken);
    } catch (error) {
      next(error);
    }
  }

  //chage password
  static async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const { currentPass, newPass } = req.body;

      const user = await AuthenService.findUserById(userId);
      if (!user || !user.password) {
        return AuthenController.prototype.sendError(
          res,
          404,
          "Không tìm thấy người dùng hoặc chưa có mật khẩu"
        );
      }

      const isMatch = await AuthenService.comparePasswords(
        currentPass,
        user.password
      );
      if (!isMatch) {
        return AuthenController.prototype.sendError(
          res,
          400,
          "Mật khẩu hiện tại không đúng"
        );
      }

      const newHashedPassword = await AuthenService.hashPassword(newPass);
      user.password = newHashedPassword;
      await user.save();

      return AuthenController.prototype.sendResponse(res, 200, {
        message: "Đổi mật khẩu thành công",
        userId: user._id,
      });
    } catch (error) {
      console.error("❌ Lỗi đổi mật khẩu:", error);
      return AuthenController.prototype.sendError(
        res,
        500,
        "Lỗi máy chủ khi đổi mật khẩu"
      );
    }
  }

  static async updateUserInfo(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const { fulname, username, email, phone, avatarUrl, role } = req.body;

      // Tìm người dùng
      const user = await AuthenService.findUserById(userId);
      if (!user) {
        return AuthenController.prototype.sendError(
          res,
          404,
          "Không tìm thấy người dùng"
        );
      }

      // Kiểm tra trùng email
      if (email && email !== user.email) {
        const existingEmail = await AuthenService.findUserByUserEmail(email);
        if (existingEmail) {
          return AuthenController.prototype.sendError(
            res,
            400,
            "Email đã tồn tại"
          );
        }
      }

      // Kiểm tra trùng username
      if (username && username !== user.username) {
        const existingUsername = await AuthenService.findUserByUserName(
          username
        );
        if (existingUsername) {
          return AuthenController.prototype.sendError(
            res,
            400,
            "Tên đăng nhập đã tồn tại"
          );
        }
      }

      // Kiểm tra trùng số điện thoại
      if (phone && phone !== user.phone) {
        const existingPhone = await AuthenService.findUserByUserPhoneNUmber(
          phone
        );
        if (existingPhone) {
          return AuthenController.prototype.sendError(
            res,
            400,
            "Số điện thoại đã tồn tại"
          );
        }
      }

      if (user.role == "chef") {
        const updated = await AuthenService.updateUser(userId, {
          fulname,
          username,
          email,
          phone,
          status: "STANDBY",
          avatarUrl,
          role,
        });
        AuthenController.prototype.sendResponse(res, 200, {
          message: "Cập nhật thông tin thành công",
          user: updated,
        });
      }
      // Cập nhật
      else {
        const updated = await AuthenService.updateUser(userId, {
          fulname,
          username,
          email,
          phone,
          avatarUrl,
          role,
        });
        AuthenController.prototype.sendResponse(res, 200, {
          message: "Cập nhật thông tin thành công",
          user: updated,
        });
      }
    } catch (error) {
      console.error("❌ Lỗi cập nhật thông tin:", error);
      next(error);
    }
  }
  /**
   * Refresh Access Token
   */
  static async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { refreshToken } = req.body;
      console.log("refreshToken :", refreshToken);

      if (!refreshToken) {
        return AuthenController.prototype.sendError(
          res,
          401,
          "No refresh token provided"
        );
      }
      const decoded = AuthenService.verifyRefreshToken(refreshToken);
      const newAccessToken = AuthenService.generateAccessToken(decoded as any);
      AuthenController.prototype.sendResponse(res, 200, {
        accessToken: newAccessToken,
      });
      console.log("access token:", newAccessToken);
    } catch (error) {
      AuthenController.prototype.sendError(res, 403, "Invalid refresh token");
    }
  }

  /**
   * Logout User - Clear Refresh Token
   */
  static async logout(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      res.clearCookie("refreshToken");
      AuthenController.prototype.sendResponse(res, 200, {
        message: "Logged out successfully",
      });
      console.log("logout successfully");
    } catch (error) {
      next(error);
    }
  }
}
