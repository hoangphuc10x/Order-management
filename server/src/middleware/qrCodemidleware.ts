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
  try {
    const qrCodeBase64 = await QRCode.toDataURL(data);
    const uploadResponse = await cloudinary.v2.uploader.upload(qrCodeBase64, {
      folder: "qr_codes",
      public_id: `table-${data}`,
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error("Lỗi khi tạo QR Code:", error);
    return "";
  }
};

export default generateQRCodeURL;