import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import  User  from "../models/UserModel";
import { IUser } from "../interfaces/IUser";
import dotenv from "dotenv";
dotenv.config();


const SECRET_KEY = process.env.JWT_SECRET || "56789abcdef0123456789abcdef0123";
const REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET || "io56klasdzcbn3aw12ertui13b2xcvklam";

export default class AuthenService {
 
  //create user "Sign up"

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  } //hash password to database

  static async createUser(userData: Partial<IUser>): Promise<IUser> {
    const hashedPassword = await this.hashPassword(userData.password!);
    const user = new User({
      ...userData,
      password: hashedPassword,
    });

    return user.save();
  }

  static generateRefreshToken(user: IUser): string {
    return jwt.sign({ id: user._id, role: user.role }, REFRESH_SECRET_KEY, {
      expiresIn: "1d", // Refresh token valid for 1 day
    });
  }

  // login 
  static async comparePasswords(
    inputPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(inputPassword, hashedPassword);
  }

  static async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
  }
  
  static async changePassword(
    userId: string,
    currentPass: string,
    newPass: string
  ): Promise<IUser | null> {
    try {
      const user = await User.findById(userId);
      if (!user || !user.password) {
        console.warn("⚠️ Không tìm thấy người dùng hoặc chưa có mật khẩu");
        return null;
      }
  
      const isMatch = await this.comparePasswords(currentPass, user.password);
      if (!isMatch) {
        console.warn("⚠️ Mật khẩu hiện tại không đúng");
        return null;
      }
  
      const newHashedPassword = await this.hashPassword(newPass);
      user.password = newHashedPassword;
      await user.save();
  
      console.log(`✅ Đổi mật khẩu thành công cho user: ${user.username}`);
      return user;
    } catch (error) {
      console.error("❌ Lỗi khi đổi mật khẩu:", error);
      return null;
    }
  }
  
  

  static async findUserByUsernameOrEmail(usernameOrEmail: string): Promise<IUser | null> {
     const account = User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });
    return account
  }
  
  static async findUserByUserEmail(userEmail: string): Promise<IUser | null> {
    const account = User.findOne({email: userEmail,});
   return account
  }

  static async findUserByUserName(username: string): Promise<IUser | null> {
    const account = User.findOne({username: username });
  return account
  }

  static async findUserByUserPhoneNUmber(phoneNumber: string): Promise<IUser | null> {
    const account = User.findOne({phone: phoneNumber});
   return account
  }

  // end login 

  // static async updateLastLogin(_id: string): Promise<IUser | null> {
  //   return User.findByIdAndUpdate(
  //     _id,
  //     { lastLogin: new Date() },
  //     { new: true }
  //   );
  // }


  //refesh tocken
  static generateAccessToken(user: IUser): string {
    return jwt.sign({ id: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "30m", // Short-lived token (30 minutes)
    });
  }

  static verifyRefreshToken(token: string) {
    return jwt.verify(token, REFRESH_SECRET_KEY);
  }

  static findUserById(id: string): Promise<IUser| null>{
    const user = User.findById(id);
    return user
  }
}




