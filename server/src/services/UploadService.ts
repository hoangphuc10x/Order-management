import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";

// ☁️ Cấu hình Cloudinary (dùng chung biến môi trường với phần tạo QR code).
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default class UploadService {
  // 📌 Upload nhiều ảnh lên Cloudinary và trả về danh sách URL công khai.
  public getPublicUrlImages = async (
    files: Express.Multer.File[],
    folderName: string
  ): Promise<string[]> => {
    const uploadedFileUrls: string[] = [];

    if (!files || files.length === 0) {
      console.warn("⚠️ No files received for upload.");
      return uploadedFileUrls;
    }

    console.log(`📂 Uploading ${files.length} files to folder: ${folderName}`);

    for (const file of files) {
      const fileBuffer = file.buffer;

      if (!fileBuffer) {
        console.warn(`⚠️ Skipping empty file: ${file.originalname}`);
        continue;
      }

      // 🔍 Dùng SHA-256 của nội dung file làm public_id để chống upload trùng.
      const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");
      const dataUri = `data:${file.mimetype};base64,${fileBuffer.toString("base64")}`;

      try {
        console.log("📤 Uploading:", `${folderName}/${hash}`);
        console.log("📝 MIME Type:", file.mimetype);
        console.log("📦 File Size:", fileBuffer.length, "bytes");

        // overwrite: false -> nếu ảnh đã tồn tại, Cloudinary trả về ảnh cũ thay vì upload lại.
        const result = await cloudinary.uploader.upload(dataUri, {
          folder: folderName,
          public_id: hash,
          overwrite: false,
          resource_type: "image",
          timeout: 60000,
        });

        console.log("✅ Upload successful:", result.public_id);
        uploadedFileUrls.push(result.secure_url);
      } catch (error) {
        console.error("❌ Error processing file:", file.originalname, error);
      }
    }

    return uploadedFileUrls;
  };

  // 📌 Xóa ảnh khỏi Cloudinary dựa trên URL đã lưu.
  public deleteImages = async (
    fileIds: string[],
    _folderPath: string
  ): Promise<boolean> => {
    try {
      const deletePromises = fileIds.map(async (fileId) => {
        const publicId = this.extractPublicId(fileId);

        if (!publicId) {
          console.error(`Error: Cannot parse public_id from: ${fileId}`);
          return;
        }

        try {
          await cloudinary.uploader.destroy(publicId, {
            resource_type: "image",
          });
          console.log(`Image deleted successfully: ${publicId}`);
        } catch (err) {
          console.error("Error deleting image:", err);
        }
      });

      await Promise.all(deletePromises);
      console.log("All file deletion attempts completed.");
      return true;
    } catch (error) {
      console.error("Error during image deletion process:", error);
      return false;
    }
  };

  // 🔧 Trích public_id (gồm cả folder, bỏ version và đuôi file) từ URL Cloudinary.
  // Ví dụ: https://res.cloudinary.com/<cloud>/image/upload/v123/Food/<hash>.png -> Food/<hash>
  private extractPublicId(url: string): string | null {
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
    return match ? match[1] : null;
  }
}
