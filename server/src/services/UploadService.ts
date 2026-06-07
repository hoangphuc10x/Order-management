import * as admin from "firebase-admin";
import * as serviceAccount from "../config/Firebase.json";
import crypto from "crypto";

export default class UploadService {
  private bucket;

  constructor() {
    // ✅ Khởi tạo Firebase Admin SDK nếu chưa có
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          serviceAccount as admin.ServiceAccount
        ),
        storageBucket: process.env.STORAGE_BUCKET,
      });
    }

    this.bucket = admin.storage().bucket();

    // ✅ Kiểm tra bucket name
    if (!this.bucket.name) {
      throw new Error("Firebase Storage bucket is not defined.");
    }
  }

  
  // 📌 Upload multiple images to Firebase Storage and get public URLs 
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
  
      // 🔍 Tạo SHA-256 hash từ nội dung file
      const hash = crypto.createHash("sha256").update(fileBuffer).digest("hex");
      const fileName = `${hash}-${file.originalname.replace(/\s+/g, "_")}`;
      const filePath = `${folderName}/${fileName}`;
      const fileRef = this.bucket.file(filePath);
  
      try {
        // ✅ Kiểm tra file đã tồn tại chưa
        const [exists] = await fileRef.exists();
        if (exists) {
          console.log("✅ File already exists, skipping upload:", filePath);
          uploadedFileUrls.push(
            `https://storage.googleapis.com/${this.bucket.name}/${encodeURIComponent(filePath)}`
          );
          continue;
        }
  
        console.log("📤 Uploading:", filePath);
        console.log("📝 MIME Type:", file.mimetype);
        console.log("📦 File Size:", fileBuffer.length, "bytes");
  
        // ✅ Upload file bằng stream
        await new Promise((resolve, reject) => {
          const stream = fileRef.createWriteStream({
            metadata: { contentType: file.mimetype },
          });
  
          stream.on("finish", async () => {
            console.log("✅ Upload successful:", filePath);
            
            // ✅ Make file public
            await fileRef.makePublic();
  
            resolve(true);
          });
  
          stream.on("error", (error) => {
            console.error("❌ Upload failed:", filePath, error);
            reject(error);
          });
  
          stream.end(fileBuffer);
        });
  
        // ✅ Trả về URL công khai của file
        const fileUrl = `https://storage.googleapis.com/${this.bucket.name}/${encodeURIComponent(filePath)}`;
        uploadedFileUrls.push(fileUrl);
      } catch (error) {
        console.error("❌ Error processing file:", file.originalname, error);
      }
    }
  
    return uploadedFileUrls;
  };
  

  // 📌 Delete images from Firebase Storage
  public deleteImages = async (
    fileIds: string[],
    folderPath: string
  ): Promise<boolean> => {
    try {
      const deletePromises = fileIds.map(async (fileId) => {
        const fileName = fileId.split("/").pop();
        const filePath = `${folderPath}/${fileName}`;
        const file = this.bucket.file(filePath);
        const [exists] = await file.exists();

        if (!exists) {
          console.error(`Error: File does not exist: ${filePath}`);
          return;
        }

        try {
          await file.delete();
          console.log(`Image deleted successfully: ${filePath}`);
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
}
