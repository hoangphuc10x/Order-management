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
    fulname: "Đầu Bếp trưởng",
    username: "chef head",
    email: "chefhead@forder.local",
    phone: "0900000020",
    role: RoleStatus.chef_head,
    status: "STANDBY",
  },
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
    {
    fulname: "Đầu Bếp 3",
    username: "chef3",
    email: "chef3@forder.local",
    phone: "0900000023",
    role: RoleStatus.chef,
    status: "STANDBY",
  },
  {
    fulname: "Đầu Bếp 4",
    username: "chef4",
    email: "chef4@forder.local",
    phone: "0900000024",
    role: RoleStatus.chef,
    status: "STANDBY",
  },
];

type SeedCategory = {
  name: string;
  description: string;
};

const CATEGORIES: SeedCategory[] = [
  { name: "Appetizers", description: "Appetizer dishes" },
  { name: "Main Dishes", description: "Main course dishes" },
  { name: "Beverages", description: "Drinks of all kinds" },
  { name: "Desserts", description: "Dessert dishes" },
];

type SeedMenuItem = {
  name: string;
  description: string;
  price: number; // VND
  category: string; // category name
  difficultyLevel: number; // 1-5
  imageUrl: string;
};

const img = (keyword: string, lock: number) =>
  `https://loremflickr.com/600/400/${keyword}?lock=${lock}`;

const MENU_ITEMS: SeedMenuItem[] = [
  // Appetizers
  { name: "Fresh Spring Rolls", description: "Fresh rice paper rolls with shrimp and pork, served with dipping sauce", price: 35000, category: "Appetizers", difficultyLevel: 2, imageUrl: img("spring,rolls", 11) },
  { name: "Fried Spring Rolls", description: "Crispy deep-fried spring rolls", price: 45000, category: "Appetizers", difficultyLevel: 2, imageUrl: img("fried,spring,rolls", 12) },
  { name: "Crab Soup", description: "Crab meat soup with century egg", price: 50000, category: "Appetizers", difficultyLevel: 2, imageUrl: img("crab,soup", 13) },

  // Main Dishes
  { name: "Beef Pho", description: "Vietnamese beef noodle soup with rare beef and brisket", price: 65000, category: "Main Dishes", difficultyLevel: 3, imageUrl: img("pho,noodle", 14) },
  { name: "Broken Rice with Grilled Pork", description: "Broken rice with grilled pork chop, shredded pork skin and egg meatloaf", price: 60000, category: "Main Dishes", difficultyLevel: 3, imageUrl: img("rice,pork", 15) },
  { name: "Hanoi Bun Cha", description: "Grilled pork with vermicelli noodles", price: 55000, category: "Main Dishes", difficultyLevel: 3, imageUrl: img("grilled,pork,noodle", 16) },
  { name: "Stir-fried Seafood Noodles", description: "Stir-fried noodles with shrimp and squid", price: 70000, category: "Main Dishes", difficultyLevel: 3, imageUrl: img("seafood,noodles", 17) },
  { name: "Honey Grilled Chicken", description: "Quarter chicken grilled with honey", price: 85000, category: "Main Dishes", difficultyLevel: 4, imageUrl: img("grilled,chicken", 18) },

  // Beverages
  { name: "Peach Lemongrass Tea", description: "Refreshing iced peach tea with lemongrass", price: 30000, category: "Beverages", difficultyLevel: 1, imageUrl: img("peach,tea", 19) },
  { name: "Vietnamese Iced Milk Coffee", description: "Traditional Vietnamese phin filter coffee with milk", price: 25000, category: "Beverages", difficultyLevel: 1, imageUrl: img("iced,coffee", 20) },
  { name: "Fresh Orange Juice", description: "Freshly squeezed orange juice", price: 35000, category: "Beverages", difficultyLevel: 1, imageUrl: img("orange,juice", 21) },

  // Desserts
  { name: "Almond Jelly Dessert", description: "Sweet almond panna cotta dessert", price: 30000, category: "Desserts", difficultyLevel: 2, imageUrl: img("almond,dessert", 22) },
  { name: "Caramel Flan", description: "Classic caramel custard flan", price: 25000, category: "Desserts", difficultyLevel: 1, imageUrl: img("caramel,flan", 23) },
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
    const tableNumber = `Table ${i}`;

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
          imageUrl: m.imageUrl,
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
