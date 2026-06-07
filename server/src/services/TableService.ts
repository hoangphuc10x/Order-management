import { NextFunction, Request, Response } from "express";
import { log } from "console";
import TableRepository from "../repositories/TableRepository";
import { ITable } from "../interfaces/ITable";
import { TableDTO } from "../dto/TableDTO";
import { Types } from "mongoose";
import TableModel from "../models/TableModel";

export default class TableService {
  private tableRepository: TableRepository;
  constructor(tableRepository: TableRepository) {
    this.tableRepository = tableRepository;
  }

  private toTableDTO = (table: ITable): TableDTO => {
    const { _id, tableNumber, qrCode, status, slug } = table;

    return new TableDTO(
      new Types.ObjectId(_id as string),
      tableNumber,
      qrCode,
      status ?? "",
      slug
    );
  };

  public getAllTables = async (): Promise<TableDTO[]> => {
    try {
      log("Getting all tables");
      const tables = await this.tableRepository.findAllByCondition({});
      const tableDTOs = tables.map(this.toTableDTO);
      return tableDTOs;
    } catch (error) {
      log("Error getting all tables:", error);
      throw new Error("Failed to get all tables");
    }
  };

  public getTableDetail = async (tableId: string): Promise<TableDTO | null> => {
    try {
      log("Getting table detail for ID:", tableId);
      if (!tableId || !Types.ObjectId.isValid(tableId)) {
        throw new Error("Invalid table ID");
      }
      const table = await this.tableRepository.findById(tableId);
      const tableDTO = table ? this.toTableDTO(table) : null;
      return tableDTO;
    } catch (error) {
      log("Error getting table detail:", error);
      throw new Error("Failed to get table detail");
    }
  };

  public createTable = async (data: ITable): Promise<ITable | null> => {
    try {
      log("Creating table:", data);
      // Kiểm tra xem tableNumber đã tồn tại chưa
      const existingTable = await TableModel.findOne({
        tableNumber: data.tableNumber,
      });
      if (existingTable) {
        throw new Error("Table number already exists");
      }
      const newTable = await this.tableRepository.createTable(data);
      return newTable;
    } catch (error) {
      log("Error creating table:", error);
      throw new Error("Failed to create table");
    }
  };

  public deteteTable = async (tableId: string): Promise<boolean> => {
    try {
      log("Deleting table with ID:", tableId);
      if (!tableId || !Types.ObjectId.isValid(tableId)) {
        throw new Error("Invalid table ID");
      }
      const isDeleted = await this.tableRepository.deleteTable(tableId);
      return isDeleted;
    } catch (error) {
      log("Error deleting table:", error);
      throw new Error("Failed to delete table");
    }
  };
}
