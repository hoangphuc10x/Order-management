import mongoose, { Schema } from "mongoose";
import { ITable } from "../interfaces/ITable";
import { TableStatus } from "../enums/TableStatus";
import generateSlug from "../util/generateSlug";
import generateQRCodeURL from "../middleware/qrCodemidleware";


// Table Schema
const TableSchema: Schema = new Schema<ITable>({
  tableNumber: { type: String, unique: true, required: true },
  qrCode: { type: String, unique: true },
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
    this.qrCode = await generateQRCodeURL(qrData);
  }

  console.log("QR Code before save:", this.qrCode);
  next();
});

const TableModel = mongoose.model<ITable>("Table", TableSchema);

export default TableModel;
