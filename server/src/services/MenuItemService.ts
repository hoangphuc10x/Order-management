import { Types } from "mongoose";
import MenuItemRepository from "../repositories/MenuItemRepository";
import { IMenuItem } from "../interfaces/IMenuItem";
import { MenuItemDTO } from "../dto/MenuItemDTO";
import { log } from "console";
import CategoryRepository from "../repositories/CategoryRepository";

export default class MenuItemService {
  private menuItemRepository: MenuItemRepository;
  private categoryRepository: CategoryRepository;

  constructor(
    menuItemRepository: MenuItemRepository,
    categoryRepository: CategoryRepository
  ) {
    this.menuItemRepository = menuItemRepository;
    this.categoryRepository = categoryRepository;
  }

  private toMenuItemDTO = (item: IMenuItem): MenuItemDTO => {
    const {
      _id,
      name,
      description,
      price, // Decimal128
      imageUrl,
      category: { categoryId, categoryName },
      isAvailable,
      createdAt,
      updatedAt,
    } = item;

    return new MenuItemDTO(
      new Types.ObjectId(_id as string),
      name,
      description ?? "",
      parseFloat(price ? price.toString() : "0"), // Kiểm tra trước khi gọi toString()
      imageUrl,
      String(categoryId),
      String(categoryName),
      isAvailable,
      createdAt,
      updatedAt
    );
  };

  private toMenuItemOrderedDTO = (item: IMenuItem): MenuItemDTO => {
    const {
      _id,
      name,
      description,
      price, // Decimal128
      imageUrl,
      category: { categoryId, categoryName },
      isAvailable,
      createdAt,
      updatedAt,
    } = item;

    return new MenuItemDTO(
      new Types.ObjectId(_id as string),
      name,
      description ?? "",
      parseFloat(price.toString()), // Chuyển Decimal128 -> number
      imageUrl,
      String(categoryId),
      String(categoryName),
      isAvailable ?? true,
      createdAt ?? new Date(),
      updatedAt ?? new Date()
    );
  };

  public getAllMenuItems = async (): Promise<MenuItemDTO[]> => {
    const menuItems = await this.menuItemRepository.getAllMenuItems();
    return menuItems.map((item) => this.toMenuItemDTO(item));
  };

  public findByMenuItemId = async (
    menuItemId: string
  ): Promise<IMenuItem | null> => {
    if (!Types.ObjectId.isValid(menuItemId)) {
      throw new Error("Invalid menu item ID format.");
    }
    return await this.menuItemRepository.findById(menuItemId);
  };

  public createMenuItem = async (
    categoryId: string,
    data: any
  ): Promise<IMenuItem | null> => {
    try {
      log("categoryId", categoryId);
      // Kiểm tra categoryId có hợp lệ không
      if (!Types.ObjectId.isValid(categoryId)) {
        console.warn(`Invalid category ID: ${categoryId}`);
        return null;
      }
      // Tìm category theo ID
      const category = await this.categoryRepository.findCategoryByCategoryId(
        categoryId
      );
      log("Has category: ", category);
      if (!category) {
        console.warn(`Category with ID ${categoryId} not found.`);
        return null;
      }
      // Kiểm tra xem data có chứa categoryId hay không
      if (!data.category.categoryId) {
        console.warn("Missing categoryId in data.");
        return null;
      }
      // Tạo JobPost dựa trên category tìm được
      const createdMenuItem = await this.menuItemRepository.createMenuItem({
        ...data,
        category: {
          categoryId: category._id,
          categoryName: category.name,
        },
      } as IMenuItem);

      log("Job posting created successfully");
      return createdMenuItem;
    } catch (error) {
      console.error("Error creating menu item:", error);
      return null;
    }
  };

  public updateMenuItem = async (
    menuItemId: string,
    data: any
  ): Promise<IMenuItem | null> => {
    try {
      log("Updating menu item with ID:", menuItemId);
      log("Updating menu item with ID:", Types.ObjectId.isValid);
      // Validate the input
      if (!menuItemId || !Types.ObjectId.isValid(menuItemId)) {
        console.warn("Invalid menu item ID");
        return null;
      }
      const updateMenuItem = await this.menuItemRepository.updateMenuItem(
        menuItemId,
        data
      );
      return updateMenuItem;
    } catch (error) {
      console.error("Error update menu item:", error);
      return null;
    }
  };

  public deleteMenuItem = async (menuItemId: string): Promise<boolean> => {
    try {
      log("Deleting menu item with ID:", menuItemId);
      // Validate the input
      if (!menuItemId || !Types.ObjectId.isValid(menuItemId)) {
        throw new Error("Invalid category ID");
      }
      const isDeleted = await this.menuItemRepository.deleteMenuItem(
        menuItemId
      );
      return isDeleted;
    } catch (error) {
      log("Error deleting menu item:", error);
      throw new Error("Failed to delete menu item");
    }
  };
}
