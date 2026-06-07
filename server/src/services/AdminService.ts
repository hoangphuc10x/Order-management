import { IRevenue } from "../interfaces/IRevenue";
import RevenueModel from "../models/RevenueModel";
import OrderRepository from "../repositories/OrderRepository";
import AdminRepository from "../repositories/AdminRepository";
import { log } from "node:console";
import UserRepository from "../repositories/UserRepository";
import MenuItemRepository from "../repositories/MenuItemRepository";
import { RoleStatus } from "../enums/RoleStatus";
import { TableOrderStatus } from "../enums/TableOrderStatus";
import { IOrder } from "../interfaces/IOrder";

export default class AdminService {
  private adminRepository: AdminRepository;
  private orderRepository: OrderRepository;
  private userRepository: UserRepository;
  private menuItemRepository: MenuItemRepository;
  //

  constructor(
    adminRepository: AdminRepository,
    orderRepository: OrderRepository,
    userRepository: UserRepository,
    menuItemRepository: MenuItemRepository
  ) {
    this.adminRepository = adminRepository;
    this.orderRepository = orderRepository;
    this.userRepository = userRepository;
    this.menuItemRepository = menuItemRepository;
  }

  // [GET] /revenues/daily
  // Lấy doanh thu theo ngày
  public getRevenueForDay = async (
    dateString: string
  ): Promise<IRevenue | null> => {
    try {
      const revenueData = await RevenueModel.findOne({ date: dateString });

      log("revenueData", revenueData);

      return revenueData;
    } catch (error) {
      console.error("Error while fetching revenue data:", error);
      throw new Error("Error while fetching revenue data.");
    }
  };

  // [GET] /revenues/startDay-endDay
  // Lấy đơn đặt hàng từ ngày bắt đầu đến ngày kết thúc
  public getStartEndOrder = async (
    startDate: string,
    endDate: string
  ): Promise<IOrder[] | null> => {
    try {
      // Query luôn luôn phải có status COMPLETED
      let query: any = {
        status: TableOrderStatus.COMPLETED,
      };

      // Nếu có startDate và endDate thì thêm điều kiện thời gian
      if (startDate && endDate) {
        query.orderTime = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const revenueData = await this.orderRepository.find(query);

      log("revenueData", revenueData);

      return revenueData;
    } catch (error) {
      console.error("Error while fetching revenue data:", error);
      throw new Error("Error while fetching revenue data.");
    }
  };

  // [GET] /revenues/monthly
  // Lấy doanh thu theo tháng
  public getRevenueForMonth = async (
    month: string,
    year: string
  ): Promise<IRevenue[] | null> => {
    try {
      const revenueData = await RevenueModel.find({
        month: month,
        year: year,
      });

      return revenueData;
    } catch (error) {
      console.error("Error while fetching revenue data:", error);
      throw new Error("Error while fetching revenue data.");
    }
  };

  // [GET] /revenues/aunual
  // Lấy doanh thu theo năm
  public getRevenueForYear = async (year: string): Promise<any[] | null> => {
    try {
      const revenueData = await RevenueModel.aggregate([
        // Match để lọc theo năm
        { $match: { year: year } },

        // Dựng lại các trường "month" và "totalRevenue"
        {
          $group: {
            _id: "$month", // Nhóm theo tháng
            totalRevenue: { $sum: "$totalRevenue" }, // Tổng doanh thu cho mỗi tháng
          },
        },

        // Sắp xếp các tháng từ tháng 1 đến tháng 12
        { $sort: { _id: 1 } },
      ]);

      return revenueData;
    } catch (error) {
      console.error("Error while fetching revenue data:", error);
      throw new Error("Error while fetching revenue data.");
    }
  };

  // [GET] /revenues/total-price
  // Lấy tổng doanh thu
  public getTotal = async (): Promise<{
    totalRevenue: number;
    totalStaff: number;
    totalOrder: number;
    totalMenuItems: number;
  }> => {
    try {
      const [admins, staff, orders, menuItems] = await Promise.all([
        this.adminRepository.findAll(),
        this.userRepository.findAllByCondition({
          role: { $ne: RoleStatus.guest },
        }),
        this.orderRepository.findAllByCondition({
          status: TableOrderStatus.COMPLETED,
        }),
        this.menuItemRepository.findAll(),
      ]);

      const totalRevenue = admins.reduce((sum, admin) => {
        const value = parseFloat(admin.totalRevenue?.toString?.() || "0");
        return sum + value;
      }, 0);

      return {
        totalRevenue,
        totalStaff: staff.length,
        totalOrder: orders.length,
        totalMenuItems: menuItems.length,
      };
    } catch (error) {
      console.error("Error while fetching total:", error);
      throw new Error("Failed to fetch total summary.");
    }
  };

  // [GET] /revenues/best-sales
  // Lấy và sắp xếp các món được order nhiều nhất
  public getMostOrderedMenuItems = async (): Promise<
    Array<{ itemId: string; name: string; count: number }>
  > => {
    try {
      const completedOrders = await this.orderRepository.findAllByCondition({
        status: TableOrderStatus.COMPLETED,
      });

      const itemCountMap = new Map<
        string,
        { name: string; categoryName: string; count: number }
      >();

      for (const order of completedOrders) {
        for (const item of order.orderItems || []) {
          const existing = itemCountMap.get(item.id);
          if (existing) {
            existing.count += item.quantity || 1;
          } else {
            itemCountMap.set(item.id, {
              name: item.name,
              categoryName: item.categoryName,
              count: item.quantity || 1,
            });
          }
        }
      }

      const sortedItems = Array.from(itemCountMap.entries())
        .map(([itemId, { name, categoryName, count }]) => ({
          itemId,
          name,
          categoryName,
          count,
        }))
        .sort((a, b) => b.count - a.count); // Giảm dần theo số lượng

      return sortedItems;
    } catch (error) {
      console.error("Error fetching most ordered menu items:", error);
      throw new Error("Failed to fetch most ordered menu items.");
    }
  };

  // [GET] /revenues/order-monthly
  // Lấy doanh thu theo năm
  public getOrderForMonth = async (
    year: string
  ): Promise<{ month: number; orderCount: number }[] | null> => {
    try {
      const completedOrders = await this.orderRepository.findAllByCondition({
        status: TableOrderStatus.COMPLETED,
      });

      // Map để đếm số order mỗi tháng
      const monthOrderCountMap = new Map<number, number>();

      for (const order of completedOrders) {
        if (!order.createdAt) continue; // Nếu order không có ngày tạo thì bỏ qua

        const orderDate = new Date(order.createdAt);
        const orderYear = orderDate.getFullYear();
        const orderMonth = orderDate.getMonth() + 1; // getMonth() trả từ 0 -> 11 nên cộng 1

        if (orderYear.toString() === year) {
          monthOrderCountMap.set(
            orderMonth,
            (monthOrderCountMap.get(orderMonth) || 0) + 1
          );
        }
      }

      // Chuyển thành mảng
      const result = Array.from(monthOrderCountMap.entries())
        .map(([month, orderCount]) => ({
          month,
          orderCount,
        }))
        .sort((a, b) => a.month - b.month); // Sắp xếp theo tháng tăng dần

      return result;
    } catch (error) {
      console.error("Error fetching order count per month:", error);
      throw new Error("Failed to fetch order count per month.");
    }
  };

  // [GET] /revenues/all-staff
  // Lấy tất cả nhân viên
  public getAllStaff = async (): Promise<any[] | null> => {
    try {
      const staff = await this.userRepository.findAllByCondition({
        role: { $ne: RoleStatus.guest },
      });

      return staff;
    } catch (error) {
      console.error("Error fetching all staff:", error);
      throw new Error("Failed to fetch all staff.");
    }
  };

  // [GET] /revenues/staff/:id
  // Lấy thông tin nhân viên
  public getDetailStaff = async (id: string): Promise<any | null> => {
    try {
      const staff = await this.userRepository.findById(id);
      if (!staff) {
        console.error(`Staff with id ${id} not found`);
        return null;
      }
      return staff;
    } catch (error) {
      console.error("Error fetching staff detail:", error);
      throw new Error("Failed to fetch staff detail.");
    }
  };

  // [PUT] /revenues/update-staff/:id
  // Cập nhật thông tin nhân viên
  public updateStaff = async (
    id: string,
    data: {
      username?: string;
      role?: string;
    }
  ): Promise<any | null> => {
    try {
      // Chỉ lấy những field hợp lệ
      const updateData: Partial<{ username: string; role: string }> = {};

      if (typeof data.username === "string") {
        updateData.username = data.username;
      }
      if (typeof data.role === "string") {
        updateData.role = data.role;
      }

      // Nếu không có gì để update thì trả về luôn
      if (Object.keys(updateData).length === 0) {
        console.error("No valid fields provided for update");
        return null;
      }

      const updatedStaff = await this.userRepository.updateUserById(
        id,
        updateData
      );

      if (!updatedStaff) {
        console.error(`Staff with id ${id} not found`);
        return null;
      }

      return updatedStaff;
    } catch (error) {
      console.error("Error updating staff:", error);
      throw new Error("Failed to update staff.");
    }
  };

  // [DELETE] /revenues/delete-staff/:id
  // Xóa nhân viên
  public deleteStaff = async (id: string): Promise<any | null> => {
    try {
      const deletedStaff = await this.userRepository.deleteById(id);
      if (!deletedStaff) {
        console.error(`Staff with id ${id} not found`);
        return null;
      }
      return deletedStaff;
    } catch (error) {
      console.error("Error deleting staff:", error);
      throw new Error("Failed to delete staff.");
    }
  };
}
