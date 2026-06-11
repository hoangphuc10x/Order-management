import mongoose, { Schema } from "mongoose";
import { ITable } from "../interfaces/ITable";
import { TableStatus } from "../enums/TableStatus";
import generateSlug from "../util/generateSlug";
import generateQRCodeURL from "../middleware/qrCodemidleware";


// Table Schema
const TableSchema: Schema = new Schema<ITable>({
  tableNumber: { type: String, unique: true, required: true },
  qrCode: { type: String, unique: true, sparse: true },
  slug: { type: String, unique: true },
  status: {
    type: String,
    default: TableStatus.AVAILABLE,
  },
  inform:{type: Boolean,default: false, },
  waitingTimeAt:{ type: Date, default: Date.now },
});

// Tạo QR Code trước khi lưu vào DB
TableSchema.pre<ITable>("save", async function (next) {
  if (!this.slug && this.tableNumber) {
    this.slug = generateSlug(this.tableNumber);
  }

  if (!this.qrCode && this.slug) {
    const qrData = `${process.env.URL_CLIENT}/${this.slug}/check`;
    try {
      this.qrCode = await generateQRCodeURL(qrData);
    } catch (error) {
      // Không gán qrCode = "" (sẽ phá unique index). Để field không được set
      // và tạo lại QR sau. Nhờ index sparse nên nhiều bản ghi thiếu qrCode vẫn lưu được.
      console.warn(
        `⚠️  Không tạo được QR Code cho ${this.tableNumber}, sẽ tạo lại sau.`
      );
    }
  }

  console.log("QR Code before save:", this.qrCode);
  next();
});

const TableModel = mongoose.model<ITable>("Table", TableSchema);

export default TableModel;
