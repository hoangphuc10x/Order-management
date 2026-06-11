import cloudinary from "cloudinary";
import QRCode from "qrcode";

// Cấu hình API Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Hàm tạo QR Code và upload lên Cloudinary
const generateQRCodeURL = async (data: string): Promise<string> => {
  const qrCodeBase64 = await QRCode.toDataURL(data);

  // Cloudinary có thể bị timeout chập chờn (ETIMEDOUT) -> thử lại vài lần.
  const maxAttempts = 3;
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const uploadResponse = await cloudinary.v2.uploader.upload(qrCodeBase64, {
        folder: "qr_codes",
        public_id: `table-${data}`,
        timeout: 60000,
      });
      return uploadResponse.secure_url;
    } catch (error) {
      lastError = error;
      console.error(
        `Lỗi khi tạo QR Code (lần ${attempt}/${maxAttempts}):`,
        error
      );
    }
  }

  // Không trả về "" vì qrCode là unique index -> sẽ gây lỗi trùng key.
  throw lastError;
};

export default generateQRCodeURL;