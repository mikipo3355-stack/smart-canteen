import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, '..', 'data', 'canteen.db');

// Ensure data directory exists
import fs from 'fs';
const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Migration: add payment_status column if it doesn't exist
const columns = db.pragma('table_info(orders)') as { name: string }[];
const hasPaymentStatus = columns.some(c => c.name === 'payment_status');
if (!hasPaymentStatus) {
  db.exec('ALTER TABLE orders ADD COLUMN payment_status TEXT NOT NULL DEFAULT \'paid\'');
}

// Migration: add is_available, time_slots, image_url to menu_items
const menuColumns = db.pragma('table_info(menu_items)') as { name: string }[];
if (!menuColumns.some(c => c.name === 'is_available')) {
  db.exec('ALTER TABLE menu_items ADD COLUMN is_available BOOLEAN NOT NULL DEFAULT 1');
}
if (!menuColumns.some(c => c.name === 'time_slots')) {
  db.exec("ALTER TABLE menu_items ADD COLUMN time_slots TEXT DEFAULT 'morning,lunch,afternoon'");
}
if (!menuColumns.some(c => c.name === 'image_url')) {
  db.exec("ALTER TABLE menu_items ADD COLUMN image_url TEXT DEFAULT ''");
}

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('student', 'vendor', 'admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS shops (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    emoji TEXT NOT NULL,
    gradient TEXT NOT NULL,
    rating REAL NOT NULL DEFAULT 0,
    reviews INTEGER NOT NULL DEFAULT 0,
    prep_time TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS shop_categories (
    shop_id TEXT NOT NULL,
    category TEXT NOT NULL,
    PRIMARY KEY (shop_id, category),
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,
    shop_id TEXT NOT NULL,
    name TEXT NOT NULL,
    emoji TEXT NOT NULL,
    price INTEGER NOT NULL,
    prep_time INTEGER NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS menu_item_tags (
    item_id TEXT NOT NULL,
    tag TEXT NOT NULL,
    PRIMARY KEY (item_id, tag),
    FOREIGN KEY (item_id) REFERENCES menu_items(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    queue_no TEXT NOT NULL,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    pickup_time TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'preparing', 'ready', 'picked_up')),
    total INTEGER NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'qr',
    payment_status TEXT NOT NULL DEFAULT 'paid' CHECK(payment_status IN ('pending', 'paid', 'failed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    menu_item_id TEXT,
    name TEXT NOT NULL,
    emoji TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    price INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  );
`);

// Seed data if empty
const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare('INSERT OR IGNORE INTO users (id, name, username, password, role) VALUES (?, ?, ?, ?, ?)');
  insertUser.run('65001', 'ตำนาน', '65001', '1234', 'student');
  insertUser.run('vendor1', 'ป้าแดง', 'vendor1', '1234', 'vendor');
  insertUser.run('admin', 'ผู้ดูแลระบบ', 'admin', '1234', 'admin');

  // Seed shops
  const insertShop = db.prepare('INSERT OR IGNORE INTO shops (id, name, emoji, gradient, rating, reviews, prep_time, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  insertShop.run('shop-1', 'ครัวป้าแดง', '🍛', 'from-orange-400 to-rose-500', 4.8, 234, '8 นาที', 'อาหารไทยรสบ้านๆ สดใหม่ทุกวัน');
  insertShop.run('shop-2', 'Fresh Tea Bar', '🧋', 'from-emerald-400 to-teal-500', 4.9, 189, '3 นาที', 'ชาสดชื่นและสมูทตี้เพื่อสุขภาพ');
  insertShop.run('shop-3', 'Smile Noodles', '🍜', 'from-amber-400 to-orange-500', 4.6, 312, '10 นาที', 'ก๋วยเตี๋ยวเส้นสดกับน้ำซุปเข้มข้น ตั้งแต่ปี 2019');
  insertShop.run('shop-4', 'Green Bowl', '🥗', 'from-green-400 to-lime-500', 4.7, 156, '5 นาที', 'สลัดโบว์เพื่อสุขภาพสำหรับนักเรียนสายคลีน');
  insertShop.run('shop-5', 'Halal Corner', '🍗', 'from-violet-400 to-purple-500', 4.5, 98, '7 นาที', 'อาหารฮาลาลรับรอง ปริมาณเต็มอิ่ม');
  insertShop.run('shop-6', 'Sweet Treats', '🧁', 'from-pink-400 to-rose-500', 4.8, 201, '2 นาที', 'ขนมหวานและเบเกอรี่สดใสทุกวัน');

  // Seed shop categories
  const insertCategory = db.prepare('INSERT OR IGNORE INTO shop_categories (shop_id, category) VALUES (?, ?)');
  const shopCategories = [
    ['shop-1', 'ข้าว'], ['shop-1', 'ฮาลาล'],
    ['shop-2', 'เครื่องดื่ม'], ['shop-2', 'คลีน'],
    ['shop-3', 'ข้าว'], ['shop-3', 'ของทานเล่น'],
    ['shop-4', 'คลีน'],
    ['shop-5', 'ฮาลาล'], ['shop-5', 'ข้าว'],
    ['shop-6', 'ของทานเล่น'],
  ];
  for (const [shopId, cat] of shopCategories) {
    insertCategory.run(shopId, cat);
  }

  // Seed menu items
  const insertItem = db.prepare('INSERT OR IGNORE INTO menu_items (id, shop_id, name, emoji, price, prep_time, description) VALUES (?, ?, ?, ?, ?, ?, ?)');
  const items = [
    ['item-1', 'shop-1', 'ข้าวผัดกะเพราไก่', '🍗', 40, 5, 'กะเพราไก่ผัดเผ็ดเสิร์ฟพร้อมข้าวสวย'],
    ['item-2', 'shop-1', 'ข้าวผัด', '🍚', 45, 6, 'ข้าวผัดกระทะร้อนใส่ไข่ ผัก และเนื้อสัตว์ตามเลือก'],
    ['item-3', 'shop-1', 'ข้าวไข่เจียว', '🍳', 35, 4, 'ไข่เจียวฟูนุ่มแบบไทยราดข้าวสวยกับซอสพริกหวาน'],
    ['item-4', 'shop-1', 'ข้าวหมูกระเทียม', '🥩', 50, 7, 'หมูทอดกระเทียมกรอบพร้อมข้าวสวยและไข่ดาว'],
    ['item-5', 'shop-1', 'ข้าวแกงเขียวหวาน', '🍛', 55, 8, 'แกงเขียวหวานกะทิไก่กับใบโหระพา'],
    ['item-6', 'shop-1', 'ต้มยำกุ้ง', '🍲', 40, 6, 'ต้มยำกุ้งน้ำใส ใส่ตะไคร้และข่า'],
    ['item-7', 'shop-2', 'ชาไทยเย็น', '🧋', 30, 2, 'ชาไทยหวานมันกับนมข้นหวานและน้ำแข็ง'],
    ['item-8', 'shop-2', 'สมูทตี้ผักโขม', '🥤', 45, 3, 'ผักโขม กล้วย น้ำผึ้ง และนมอัลมอนด์'],
    ['item-9', 'shop-2', 'สมูทตี้อ้อยข้าวเหนียวมะม่วง', '🥭', 40, 3, 'มะม่วงสดปั่นกับกะทิและข้าวเหนียว'],
    ['item-10', 'shop-2', 'เลม่อนน้ำผึ้งโซดา', '🍋', 25, 2, 'เลม่อนสดกับน้ำผึ้งและน้ำอัดลม'],
    ['item-11', 'shop-2', 'มะพร้าวใบเตย', '🥥', 35, 2, 'น้ำมะพร้าวสดกับใบเตยหอม'],
    ['item-12', 'shop-3', 'ก๋วยเตี๋ยวเรือน้ำ', '🍜', 35, 5, 'น้ำซุปหมูเข้มข้นเส้นเล็กกับหมูกรอบ'],
    ['item-13', 'shop-3', 'ผัดไทย', '🍝', 40, 7, 'ผัดไทยเส้นจันท์กับซอสมะขาม เต้าหู้ และถั่วลิสง'],
    ['item-14', 'shop-3', 'ผัดขี้เมา', '🌶️', 45, 8, 'เส้นใหญ่ผัดเผ็ดกับโหระพากับผัก'],
    ['item-15', 'shop-3', 'บะหมี่เกี๊ยวน้ำ', '🥟', 40, 6, 'น้ำซุปใสกับเกี๊ยวหมู handmade และเส้นบะหมี่ไข่'],
    ['item-16', 'shop-4', 'ควินัวเพาเวอร์โบว์', '🥙', 65, 4, 'ควินัว อะโวคาโด เอดามาเมะ มะเขือเทศ ซอสงา'],
    ['item-17', 'shop-4', 'สลัดไก่ย่าง', '🥗', 55, 5, 'ไก่ย่างสมุนไพรบนผักสลัดกับน้ำสลัดมะนาว'],
    ['item-18', 'shop-4', 'อาซาอิโบว์', '🫐', 60, 3, 'อาซาไอแช่แข็งท็อปด้วยกราโนล่า กล้วย และน้ำผึ้ง'],
    ['item-19', 'shop-5', 'ข้าวหมกไก่', '🍛', 55, 8, 'ข้าวบัสมาติหอมกับไก่ผัดเครื่องเทศและราอิตะ'],
    ['item-20', 'shop-5', 'เนื้อเร็นดัง', '🥘', 65, 10, 'เนื้อตุ๋นในแกงกะทิเข้มข้นกับข้าวสวย'],
    ['item-21', 'shop-5', 'ไก่สะเต๊ะ', '🍢', 45, 6, 'ไก่ย่างสะเต๊ะกับซอสถั่วและอาจาด'],
    ['item-22', 'shop-6', 'ครัวซองค์มัทฉะ', '🥐', 35, 1, 'ครัวซองค์เนยไส้ครีมมัทฉะพรีเมียม'],
    ['item-23', 'shop-6', 'โรตีกล้วย', '🥞', 25, 2, 'โรตีกรอบกับกล้วย ช็อกโกแลต และนมข้น'],
    ['item-24', 'shop-6', 'พุดดิ้งมะพร้าว', '🍮', 20, 1, 'คัสตาร์ดมะพร้าวกับคาราเมลน้ำตั้นโตนด'],
  ];
  for (const item of items) {
    insertItem.run(...item);
  }

  // Seed menu item tags
  const insertTag = db.prepare('INSERT OR IGNORE INTO menu_item_tags (item_id, tag) VALUES (?, ?)');
  const tags = [
    ['item-1', 'ยอดนิยม'], ['item-1', 'เผ็ด'],
    ['item-2', 'คลาสสิก'],
    ['item-3', 'ประหยัด'],
    ['item-4', 'ยอดนิยม'],
    ['item-5', 'เผ็ด'],
    ['item-6', 'เผ็ด'],
    ['item-7', 'ยอดนิยม'],
    ['item-8', 'เพื่อสุขภาพ'],
    ['item-9', 'ตามฤดูกาล'],
    ['item-10', 'สดชื่น'],
    ['item-11', 'ธรรมชาติ'],
    ['item-12', 'ยอดนิยม'],
    ['item-13', 'คลาสสิก'],
    ['item-14', 'เผ็ด'],
    ['item-15', 'โฮมมี่'],
    ['item-16', 'เพื่อสุขภาพ'],
    ['item-17', 'โปรตีน'],
    ['item-18', 'ซุปเปอร์ฟู้ด'],
    ['item-19', 'ยอดนิยม'], ['item-19', 'ฮาลาล'],
    ['item-20', 'ฮาลาล'],
    ['item-21', 'ฮาลาล'], ['item-21', 'ยอดนิยม'],
    ['item-22', 'ใหม่'],
    ['item-23', 'ยอดนิยม'],
    ['item-24', 'คลาสสิก'],
  ];
  for (const [itemId, tag] of tags) {
    insertTag.run(itemId, tag);
  }

  // Seed sample orders
  let queueCounter = 21;
  const sampleOrders = [
    { studentId: '65001', studentName: 'ตำนาน', items: [{ itemId: 'item-1', name: 'ข้าวผัดกะเพราไก่', emoji: '🍗', qty: 1, price: 40 }], pickupTime: '12:00', status: 'picked_up', total: 40 },
    { studentId: '65001', studentName: 'กรณ์', items: [{ itemId: 'item-7', name: 'ชาไทยเย็น', emoji: '🧋', qty: 2, price: 30 }, { itemId: 'item-23', name: 'โรตีกล้วย', emoji: '🥞', qty: 1, price: 25 }], pickupTime: '12:05', status: 'ready', total: 85 },
    { studentId: '65001', studentName: 'พลอย', items: [{ itemId: 'item-13', name: 'ผัดไทย', emoji: '🍝', qty: 1, price: 40 }, { itemId: 'item-12', name: 'ก๋วยเตี๋ยวเรือน้ำ', emoji: '🍜', qty: 1, price: 35 }], pickupTime: '12:10', status: 'preparing', total: 75 },
    { studentId: '65001', studentName: 'มิ้นท์', items: [{ itemId: 'item-5', name: 'ข้าวแกงเขียวหวาน', emoji: '🍛', qty: 1, price: 55 }, { itemId: 'item-10', name: 'เลม่อนน้ำผึ้งโซดา', emoji: '🍋', qty: 1, price: 25 }], pickupTime: '12:15', status: 'accepted', total: 80 },
    { studentId: '65001', studentName: 'บาส', items: [{ itemId: 'item-19', name: 'ข้าวหมกไก่', emoji: '🍛', qty: 1, price: 55 }], pickupTime: '12:20', status: 'pending', total: 55 },
    { studentId: '65001', studentName: 'เจน', items: [{ itemId: 'item-16', name: 'ควินัวเพาเวอร์โบว์', emoji: '🥙', qty: 1, price: 65 }, { itemId: 'item-8', name: 'สมูทตี้ผักโขม', emoji: '🥤', qty: 1, price: 45 }], pickupTime: '12:05', status: 'accepted', total: 110 },
  ];

  const insertOrder = db.prepare('INSERT INTO orders (id, queue_no, student_id, student_name, pickup_time, status, total, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const insertOrderItem = db.prepare('INSERT INTO order_items (id, order_id, menu_item_id, name, emoji, quantity, price) VALUES (?, ?, ?, ?, ?, ?, ?)');

  for (const order of sampleOrders) {
    queueCounter++;
    const orderId = `ORD-${Date.now()}-${queueCounter}`;
    const queueNo = `A${queueCounter}`;
    insertOrder.run(orderId, queueNo, order.studentId, order.studentName, order.pickupTime, order.status, order.total, 'qr');
    for (const item of order.items) {
      const orderItemId = `OI-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      insertOrderItem.run(orderItemId, orderId, item.itemId, item.name, item.emoji, item.qty, item.price);
    }
  }
}

export default db;
