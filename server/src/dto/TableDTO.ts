import { Types } from "mongoose";
import { TableStatus } from "../enums/TableStatus";

export class TableDTO {
  constructor(
    public _id: Types.ObjectId,
    public tableNumber: string,
    public qrCode: string,
    public status: TableStatus,
    public slug: string
  ) {}
}
