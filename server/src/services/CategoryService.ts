import { Types } from "mongoose";
import { CategoryDTO } from "../dto/CategoryDTO";
import { ICategory } from "../interfaces/ICategory";
import CategoryRepository from "../repositories/CategoryRepository";
import { log } from "console";

export default class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor(categoryRepository: CategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  private toCategoryDTO = (category: ICategory): CategoryDTO => {
    const { _id, name, description, createdAt, updatedAt } = category;

    return new CategoryDTO(
      new Types.ObjectId(_id as string),
      name,
      description ?? "",
      createdAt ?? new Date(),
      updatedAt ?? new Date()
    );
  };

  public getAllCategories = async (): Promise<CategoryDTO[]> => {
    try {
      log("Getting all categories");
      // Call repository to get all categories
      const categories = await this.categoryRepository.findAllByCondition({});
      // Map the categories to DTO
      const categoryDTOs = categories.map(this.toCategoryDTO);
      return categoryDTOs;
    } catch (error) {
      log("Error getting all categories:", error);
      throw new Error("Failed to get all categories");
    }
  };

  public getCategoryDetail = async (
    categoryId: string
  ): Promise<CategoryDTO | null> => {
    try {
      log("Getting category detail for ID:", categoryId);
      // Validate the input
      if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
        throw new Error("Invalid category ID");
      }
      // Call repository to get category by ID
      const category = await this.categoryRepository.findCategoryByCategoryId(
        categoryId
      );
      // Map the category to DTO
      const categoryDTO = category ? this.toCategoryDTO(category) : null;
      return categoryDTO;
    } catch (error) {
      log("Error getting category detail:", error);
      throw new Error("Failed to get category detail");
    }
  };

  public createCategory = async (data: any): Promise<ICategory | null> => {
    try {
      log("Creating category with data:", data);
      // Validate the data
      if (!data || typeof data.name !== "string" || data.name.trim() === "") {
        throw new Error(
          "Invalid category data: 'name' is required and must be a non-empty string"
        );
      }
      // Log the input data
      // Call repository to save the category
      const newCategory = await this.categoryRepository.createCategory(data);

      return newCategory;
    } catch (error) {
      log("Error creating category:", error);
      throw new Error("Failed to create category");
    }
  };

  public updateCategory = async (
    categoryId: string,
    data: any
  ): Promise<ICategory | null> => {
    try {
      log("Updating category with ID:", categoryId);
      // Validate the input
      if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
        throw new Error("Invalid category ID");
      }
      // // Validate the data
      // if (!data || typeof data.name !== "string" || data.name.trim() === "") {
      //   throw new Error(
      //     "Invalid category data: 'name' is required and must be a non-empty string"
      //   );
      // }
      // Log the input data
      // Call repository to update the category
      const updatedCategory = await this.categoryRepository.updateCategory(
        categoryId,
        data
      );
      return updatedCategory;
    } catch (error) {
      log("Error updating category:", error);
      throw new Error("Failed to update category");
    }
  };

  public deleteCategory = async (categoryId: string): Promise<boolean> => {
    try {
      log("Deleting category with ID:", categoryId);
      // Validate the input
      if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
        throw new Error("Invalid category ID");
      }
      // Call repository to delete the category
      const isDeleted = await this.categoryRepository.deleteCategory(
        categoryId
      );
      return isDeleted;
    } catch (error) {
      log("Error deleting category:", error);
      throw new Error("Failed to delete category");
    }
  };
}
