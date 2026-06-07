import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "56789abcdef0123456789abcdef0123";


interface DecodedToken {
  id: string;
  role: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: DecodedToken;
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided. You must login beffore" });
      console.log("Access denied. No token provided.");
      return;
    }
    const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token, your role cannot access" });
    console.log("Invalid token, your role cannot access");
  }
};

