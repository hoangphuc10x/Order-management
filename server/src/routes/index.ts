import { Router } from "express";
// Repositories
import CategoryRepository from "../repositories/CategoryRepository";
import MenuItemRepository from "../repositories/MenuItemRepository";
import TableRepository from "../repositories/TableRepository";
import OrderRepository from "../repositories/OrderRepository";
import UserRepository from "../repositories/UserRepository";
import KitchenRepository from "../repositories/KitchenRepository";
import AdminRepository from "../repositories/AdminRepository";
import DiscountRepository from "../repositories/DiscountRepository";
// Controllers
import SiteController from "../controllers/SiteController";
import CategoryController from "../controllers/CategoryController";
import MenuItemController from "../controllers/MenuItemController";
import TableController from "../controllers/TableController";
import OrderController from "../controllers/OrderController";
import AuthenController from "../controllers/AuthenController";
import KitchenController from "../controllers/KitchenController";
import UserController from "../controllers/UserController";
import UploadController from "../controllers/UploadController";
import RevenueController from "../controllers/AdminController";
import DiscountController from "../controllers/DiscountController";

// Services
import CategoryService from "../services/CategoryService";
import MenuItemService from "../services/MenuItemService";
import TableService from "../services/TableService";
import OrderService from "../services/OrderService";
import KitchenService from "../services/KitchenService";
import UserService from "../services/UserService";
import UploadService from "../services/UploadService";
import AdminService from "../services/AdminService";
import DiscountService from "../services/DiscountService";

// Routes
import SiteRoutes from "./SiteRoutes";
import MenuItemRoutes from "./MenuItemRoutes";
import CategoryRoutes from "./CategoryRoutes";
import TableRoutes from "./TableRoutes";
import OrderRoutes from "./OrderRoutes";
import AuthenRoutes from "./AuthenRoutes";
import KitchenRoutes from "./KitchenRoutes";
import UserRoutes from "./UserRoutes";
import UploadRouter from "./UploadRoutes";
import AdminRoutes from "./AdminRoutes";
import DiscountRoutes from "./DiscountRoutes";

class Routes {
  public router: Router;

  constructor() {
    this.router = Router();

    // Khởi tạo Repositories
    const menuItemRepository = new MenuItemRepository();
    const categoryRepository = new CategoryRepository();
    const tableRepository = new TableRepository();
    const orderRepository = new OrderRepository();
    const userRepository = new UserRepository();
    const kitchenRepository = new KitchenRepository();
    const revenueRepository = new AdminRepository();
    const discountRepository = new DiscountRepository();

    // Khởi tạo Services
    const menuItemService = new MenuItemService(
      menuItemRepository,
      categoryRepository
    );
    const categoryService = new CategoryService(categoryRepository);
    const tableService = new TableService(tableRepository);
    const orderService = new OrderService(
      orderRepository,
      menuItemRepository,
      tableRepository,
      userRepository,
      kitchenRepository,
      discountRepository
    );
    const kitchenService = new KitchenService(
      kitchenRepository,
      orderRepository,
      tableRepository,
      userRepository
    );
    const userService = new UserService(userRepository);
    const uploadService = new UploadService();
    const revenueService = new AdminService(
      revenueRepository,
      orderRepository,
      userRepository,
      menuItemRepository
    ); // Khởi tạo service cho doanh thu
    const discountService = new DiscountService(discountRepository); // Khởi tạo service cho mã giảm giá

    // Khởi tạo Controllers
    const siteController = new SiteController();
    const authenController = new AuthenController();
    const userController = new UserController(userService);
    const orderController = new OrderController(orderService);
    const categoryController = new CategoryController(categoryService);
    const menuItemController = new MenuItemController(menuItemService);
    const tableController = new TableController(tableService);
    const kitchenController = new KitchenController(kitchenService);
    const uploadController = new UploadController(uploadService); // Thêm controller cho upload
    const revenueController = new RevenueController(revenueService); // Thêm controller cho doanh thu
    const discountController = new DiscountController(discountService); // Thêm controller cho mã giảm giá

    this.router.use(
      "/discounts",
      new DiscountRoutes(discountController).getRouter()
    ); // Thêm route cho mã giảm giá
    // Khởi tạo Routes
    this.router.use("/discounts",new DiscountRoutes(discountController).getRouter()); // Thêm route cho mã giảm giá
    this.router.use("/revenues",new AdminRoutes(revenueController).getRouter()); // Thêm route cho doanh thu
    this.router.use("/uploads", new UploadRouter(uploadController).getRouter());
    this.router.use("/kitchens",new KitchenRoutes(kitchenController).getRouter());
    this.router.use("/auth", new AuthenRoutes(authenController).getRouter());
    this.router.use("/orders", new OrderRoutes(orderController).getRouter());
    this.router.use("/tables", new TableRoutes(tableController).getRouter());
    this.router.use("/categories",new CategoryRoutes(categoryController).getRouter());
    this.router.use("/menu-item",new MenuItemRoutes(menuItemController).getRouter());
    this.router.use("/user", new UserRoutes(userController).getRouter());
    this.router.use("/", new SiteRoutes(siteController).getRouter());
  }
}

export default new Routes().router;
