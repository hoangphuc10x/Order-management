import { Request, Response, NextFunction } from "express";

export function authorizeRoles(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Access denied. User not authenticated." });
      return; // ✅ thêm return để TypeScript hiểu middleware đã kết thúc
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: "Access denied. Insufficient permissions." });
      return; // ✅ thêm return ở đây nữa
    }

    next(); // ✅ nếu đủ quyền thì next
  };
}
