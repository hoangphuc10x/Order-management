import { Request, Response } from "express";
import UploadService from "../services/UploadService";
import { BaseController } from "./BaseController";

export default class UploadFileController extends BaseController {
  private uploadService: UploadService;

  constructor(uploadService: UploadService) {
    super();
    this.uploadService = uploadService;
  }

  public uploadImages = async (
    req: Request,
    res: Response,
    folderName: "Staff" | "Food"
  ): Promise<void> => {
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      res
        .status(400)
        .json({ success: false, error: "No image files provided" });
      return;
    }

    try {
      const publicUrls: string[] = await this.uploadService.getPublicUrlImages(
        files,
        folderName
      );

      res.status(200).json({
        success: true,
        message: "Images uploaded successfully",
        urlImages: publicUrls,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to upload images" });
    }
  };

  public uploadStaffImages = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.uploadImages(req, res, "Staff");
  };

  public uploadFoodImages = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.uploadImages(req, res, "Food");
  };

  public deleteImages = async (
    req: Request,
    res: Response,
    folderName: "Staff" | "Food"
  ): Promise<void> => {
    try {
      const fileIds = req.body.fileUrls;

      console.log("🗑️ Deleting files:", fileIds);

      if (!fileIds || fileIds.length === 0) {
        res.status(400).json({ success: false, error: "No file IDs provided" });
        return;
      }

      const isDeleted = await this.uploadService.deleteImages(
        fileIds,
        folderName
      );

      if (!isDeleted) {
        res
          .status(500)
          .json({ success: false, error: "Failed to delete images" });
        return;
      }

      res
        .status(200)
        .json({ success: true, message: "Images deleted successfully" });
    } catch (error) {
      console.error("Delete error:", error);
      res
        .status(500)
        .json({ success: false, error: "Failed to delete images" });
    }
  };

  public deleteStaffImages = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.deleteImages(req, res, "Staff");
  };

  public deleteFoodImages = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.deleteImages(req, res, "Food");
  };
}
