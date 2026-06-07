import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "./config/Database";
import UserModel from "./models/UserModel";
import CategoryModel from "./models/CategoryModel";
import MenuItemModel from "./models/MenuItemModel";
import TableModel from "./models/TableModel";
import { RoleStatus } from "./enums/RoleStatus";
import { TableStatus } from "./enums/TableStatus";

// Mật khẩu mặc định cho tất cả tài khoản seed
const DEFAULT_PASSWORD = "123456";

type SeedUser = {
  fulname: string;
  username: string;
  email: string;
  phone: string;
  role: RoleStatus;
  status: string;
};

const USERS: SeedUser[] = [
  // 1 admin (manager)
  {
    fulname: "Quản Trị Viên",
    username: "admin",
    email: "admin@forder.local",
    phone: "0900000001",
    role: RoleStatus.manager,
    status: "STANDBY",
  },
  // 4 staff
  {
    fulname: "Nhân Viên 1",
    username: "staff1",
    email: "staff1@forder.local",
    phone: "0900000011",
    role: RoleStatus.staff,
    status: "STANDBY",
  },
  {
    fulname: "Nhân Viên 2",
    username: "staff2",
    email: "staff2@forder.local",
    phone: "0900000012",
    role: RoleStatus.staff,
    status: "STANDBY",
  },
  {
    fulname: "Nhân Viên 3",
    username: "staff3",
    email: "staff3@forder.local",
    phone: "0900000013",
    role: RoleStatus.staff,
    status: "STANDBY",
  },
  {
    fulname: "Nhân Viên 4",
    username: "staff4",
    email: "staff4@forder.local",
    phone: "0900000014",
    role: RoleStatus.staff,
    status: "STANDBY",
  },
  // 2 chef
  {
    fulname: "Đầu Bếp 1",
    username: "chef1",
    email: "chef1@forder.local",
    phone: "0900000021",
    role: RoleStatus.chef,
    status: "STANDBY",
  },
  {
    fulname: "Đầu Bếp 2",
    username: "chef2",
    email: "chef2@forder.local",
    phone: "0900000022",
    role: RoleStatus.chef,
    status: "STANDBY",
  },
];

type SeedCategory = {
  name: string;
  description: string;
};

const CATEGORIES: SeedCategory[] = [
  { name: "Khai vị", description: "Các món khai vị" },
  { name: "Món chính", description: "Các món ăn chính" },
  { name: "Đồ uống", description: "Nước uống các loại" },
  { name: "Tráng miệng", description: "Món tráng miệng" },
];

type SeedMenuItem = {
  name: string;
  description: string;
  price: number; // VND
  category: string; // category name
  difficultyLevel: number; // 1-5
};

const MENU_ITEMS: SeedMenuItem[] = [
  // Khai vị
  { name: "Gỏi cuốn tôm thịt", description: "Gỏi cuốn tươi kèm nước chấm", price: 35000, category: "Khai vị", difficultyLevel: 2 },
  { name: "Chả giò", description: "Chả giò chiên giòn", price: 45000, category: "Khai vị", difficultyLevel: 2 },
  { name: "Súp cua", description: "Súp cua trứng bắc thảo", price: 50000, category: "Khai vị", difficultyLevel: 2 },

  // Món chính
  { name: "Phở bò", description: "Phở bò tái nạm gầu", price: 65000, category: "Món chính", difficultyLevel: 3 },
  { name: "Cơm tấm sườn bì chả", description: "Cơm tấm sườn nướng đầy đủ", price: 60000, category: "Món chính", difficultyLevel: 3 },
  { name: "Bún chả Hà Nội", description: "Bún chả thịt nướng", price: 55000, category: "Món chính", difficultyLevel: 3 },
  { name: "Mì xào hải sản", description: "Mì xào tôm mực", price: 70000, category: "Món chính", difficultyLevel: 3 },
  { name: "Gà nướng mật ong", description: "1/4 con gà nướng mật ong", price: 85000, category: "Món chính", difficultyLevel: 4 },

  // Đồ uống
  { name: "Trà đào cam sả", description: "Trà đào mát lạnh", price: 30000, category: "Đồ uống", difficultyLevel: 1 },
  { name: "Cà phê sữa đá", description: "Cà phê phin truyền thống", price: 25000, category: "Đồ uống", difficultyLevel: 1 },
  { name: "Nước cam ép", description: "Cam tươi ép nguyên chất", price: 35000, category: "Đồ uống", difficultyLevel: 1 },

  // Tráng miệng
  { name: "Chè khúc bạch", description: "Chè khúc bạch hạnh nhân", price: 30000, category: "Tráng miệng", difficultyLevel: 2 },
  { name: "Bánh flan", description: "Bánh flan caramel", price: 25000, category: "Tráng miệng", difficultyLevel: 1 },
];

const seedUsers = async () => {
  const hashed = await bcrypt.hash(DEFAULT_PASSWORD, await bcrypt.genSalt(10));

  for (const u of USERS) {
    await UserModel.updateOne(
      { username: u.username },
      {
        $set: {
          fulname: u.fulname,
          email: u.email,
          phone: u.phone,
          role: u.role,
          status: u.status,
          isActive: true,
        },
        $setOnInsert: { password: hashed },
      },
      { upsert: true }
    );
    console.log(`👤 user: ${u.username} (${u.role})`);
  }
};

// Số lượng bàn cần seed
const TABLE_COUNT = 16;

const seedTables = async () => {
  for (let i = 1; i <= TABLE_COUNT; i++) {
    const tableNumber = `Bàn ${i}`;

    const existing = await TableModel.findOne({ tableNumber });
    if (existing) {
      console.log(`🪑 table: ${tableNumber} (đã tồn tại, bỏ qua)`);
      continue;
    }

    // Dùng .save() để kích hoạt pre-save hook (tạo slug + qrCode)
    const table = new TableModel({
      tableNumber,
      status: TableStatus.AVAILABLE,
    });
    await table.save();
    console.log(`🪑 table: ${tableNumber}`);
  }
};

const seedMenu = async () => {
  // Categories
  const categoryMap = new Map<string, mongoose.Types.ObjectId>();
  for (const c of CATEGORIES) {
    const doc = await CategoryModel.findOneAndUpdate(
      { name: c.name },
      { $set: { description: c.description } },
      { upsert: true, new: true }
    );
    categoryMap.set(c.name, doc!._id as mongoose.Types.ObjectId);
    console.log(`📂 category: ${c.name}`);
  }

  // Menu items
  for (const m of MENU_ITEMS) {
    const categoryId = categoryMap.get(m.category)!;
    await MenuItemModel.updateOne(
      { name: m.name },
      {
        $set: {
          description: m.description,
          price: mongoose.Types.Decimal128.fromString(String(m.price)),
          category: { categoryId, categoryName: m.category },
          difficultyLevel: m.difficultyLevel,
          isAvailable: true,
          readyToServeItems: false,
        },
      },
      { upsert: true }
    );
    console.log(`🍽️  menu: ${m.name} - ${m.price.toLocaleString("vi-VN")}đ`);
  }
};

const run = async () => {
  await connectDB();
  console.log("--- Seeding users ---");
  await seedUsers();
  console.log("--- Seeding menu ---");
  await seedMenu();
  console.log("--- Seeding tables ---");
  await seedTables();
  console.log(`\n✅ Done. Mật khẩu mặc định cho mọi tài khoản: "${DEFAULT_PASSWORD}"`);
  await disconnectDB();
  process.exit(0);
};

run().catch(async (err) => {
  console.error("❌ Seed failed:", err);
  await disconnectDB();
  process.exit(1);
});
