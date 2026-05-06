export interface Shop {
  id: string;
  name: string;
  emoji: string;
  gradient: string;
  rating: number;
  reviews: number;
  prepTime: string;
  categories: string[];
  description: string;
}

export interface MenuItem {
  id: string;
  shopId: string;
  name: string;
  emoji: string;
  price: number;
  prepTime: number;
  description: string;
  tags: string[];
  isAvailable?: boolean;
  timeSlots?: string[];
  imageUrl?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  queueNo: string;
  studentName: string;
  items: { name: string; quantity: number; price: number }[];
  pickupTime: string;
  status: 'pending' | 'accepted' | 'preparing' | 'ready' | 'picked_up';
  total: number;
  paymentMethod: 'cash' | 'qr';
}

export interface AnalyticsData {
  ordersToday: number;
  revenueToday: number;
  pendingOrders: number;
  popularItem: string;
  avgWaitTime: number;
  repeatUsers: number;
  totalOrders: number;
  wasteReduction: number;
  ordersByHour: { hour: string; orders: number }[];
  topMenus: { name: string; orders: number }[];
  dailyRevenue: { day: string; revenue: number }[];
  peakQueue: { time: string; queue: number }[];
}

export const shops: Shop[] = [
  {
    id: 'shop-1',
    name: 'ครัวป้าแดง',
    emoji: '🍛',
    gradient: 'from-orange-400 to-rose-500',
    rating: 4.8,
    reviews: 234,
    prepTime: '8 นาที',
    categories: ['ข้าว', 'ฮาลาล'],
    description: 'อาหารไทยรสบ้านๆ สดใหม่ทุกวัน',
  },
  {
    id: 'shop-2',
    name: 'Fresh Tea Bar',
    emoji: '🧋',
    gradient: 'from-emerald-400 to-teal-500',
    rating: 4.9,
    reviews: 189,
    prepTime: '3 นาที',
    categories: ['เครื่องดื่ม', 'คลีน'],
    description: 'ชาสดชื่นและสมูทตี้เพื่อสุขภาพ',
  },
  {
    id: 'shop-3',
    name: 'Smile Noodles',
    emoji: '🍜',
    gradient: 'from-amber-400 to-orange-500',
    rating: 4.6,
    reviews: 312,
    prepTime: '10 นาที',
    categories: ['ข้าว', 'ของทานเล่น'],
    description: 'ก๋วยเตี๋ยวเส้นสดกับน้ำซุปเข้มข้น ตั้งแต่ปี 2019',
  },
  {
    id: 'shop-4',
    name: 'Green Bowl',
    emoji: '🥗',
    gradient: 'from-green-400 to-lime-500',
    rating: 4.7,
    reviews: 156,
    prepTime: '5 นาที',
    categories: ['คลีน'],
    description: 'สลัดโบว์เพื่อสุขภาพสำหรับนักเรียนสายคลีน',
  },
  {
    id: 'shop-5',
    name: 'Halal Corner',
    emoji: '🍗',
    gradient: 'from-violet-400 to-purple-500',
    rating: 4.5,
    reviews: 98,
    prepTime: '7 นาที',
    categories: ['ฮาลาล', 'ข้าว'],
    description: 'อาหารฮาลาลรับรอง ปริมาณเต็มอิ่ม',
  },
  {
    id: 'shop-6',
    name: 'Sweet Treats',
    emoji: '🧁',
    gradient: 'from-pink-400 to-rose-500',
    rating: 4.8,
    reviews: 201,
    prepTime: '2 นาที',
    categories: ['ของทานเล่น'],
    description: 'ขนมหวานและเบเกอรี่สดใสทุกวัน',
  },
];

export const menuItems: MenuItem[] = [
  // ครัวป้าแดง
  { id: 'item-1', shopId: 'shop-1', name: 'ข้าวผัดกะเพราไก่', emoji: '🍗', price: 40, prepTime: 5, description: 'กะเพราไก่ผัดเผ็ดเสิร์ฟพร้อมข้าวสวย', tags: ['ยอดนิยม', 'เผ็ด'] },
  { id: 'item-2', shopId: 'shop-1', name: 'ข้าวผัด', emoji: '🍚', price: 45, prepTime: 6, description: 'ข้าวผัดกระทะร้อนใส่ไข่ ผัก และเนื้อสัตว์ตามเลือก', tags: ['คลาสสิก'] },
  { id: 'item-3', shopId: 'shop-1', name: 'ข้าวไข่เจียว', emoji: '🍳', price: 35, prepTime: 4, description: 'ไข่เจียวฟูนุ่มแบบไทยราดข้าวสวยกับซอสพริกหวาน', tags: ['ประหยัด'] },
  { id: 'item-4', shopId: 'shop-1', name: 'ข้าวหมูกระเทียม', emoji: '🥩', price: 50, prepTime: 7, description: 'หมูทอดกระเทียมกรอบพร้อมข้าวสวยและไข่ดาว', tags: ['ยอดนิยม'] },
  { id: 'item-5', shopId: 'shop-1', name: 'ข้าวแกงเขียวหวาน', emoji: '🍛', price: 55, prepTime: 8, description: 'แกงเขียวหวานกะทิไก่กับใบโหระพา', tags: ['เผ็ด'] },
  { id: 'item-6', shopId: 'shop-1', name: 'ต้มยำกุ้ง', emoji: '🍲', price: 40, prepTime: 6, description: 'ต้มยำกุ้งน้ำใส ใส่ตะไคร้และข่า', tags: ['เผ็ด'] },

  // Fresh Tea Bar
  { id: 'item-7', shopId: 'shop-2', name: 'ชาไทยเย็น', emoji: '🧋', price: 30, prepTime: 2, description: 'ชาไทยหวานมันกับนมข้นหวานและน้ำแข็ง', tags: ['ยอดนิยม'] },
  { id: 'item-8', shopId: 'shop-2', name: 'สมูทตี้ผักโขม', emoji: '🥤', price: 45, prepTime: 3, description: 'ผักโขม กล้วย น้ำผึ้ง และนมอัลมอนด์', tags: ['เพื่อสุขภาพ'] },
  { id: 'item-9', shopId: 'shop-2', name: 'สมูทตี้อ้อยข้าวเหนียวมะม่วง', emoji: '🥭', price: 40, prepTime: 3, description: 'มะม่วงสดปั่นกับกะทิและข้าวเหนียว', tags: ['ตามฤดูกาล'] },
  { id: 'item-10', shopId: 'shop-2', name: 'เลม่อนน้ำผึ้งโซดา', emoji: '🍋', price: 25, prepTime: 2, description: 'เลม่อนสดกับน้ำผึ้งและน้ำอัดลม', tags: ['สดชื่น'] },
  { id: 'item-11', shopId: 'shop-2', name: 'มะพร้าวใบเตย', emoji: '🥥', price: 35, prepTime: 2, description: 'น้ำมะพร้าวสดกับใบเตยหอม', tags: ['ธรรมชาติ'] },

  // Smile Noodles
  { id: 'item-12', shopId: 'shop-3', name: 'ก๋วยเตี๋ยวเรือน้ำ', emoji: '🍜', price: 35, prepTime: 5, description: 'น้ำซุปหมูเข้มข้นเส้นเล็กกับหมูกรอบ', tags: ['ยอดนิยม'] },
  { id: 'item-13', shopId: 'shop-3', name: 'ผัดไทย', emoji: '🍝', price: 40, prepTime: 7, description: 'ผัดไทยเส้นจันท์กับซอสมะขาม เต้าหู้ และถั่วลิสง', tags: ['คลาสสิก'] },
  { id: 'item-14', shopId: 'shop-3', name: 'ผัดขี้เมา', emoji: '🌶️', price: 45, prepTime: 8, description: 'เส้นใหญ่ผัดเผ็ดกับโหระพากับผัก', tags: ['เผ็ด'] },
  { id: 'item-15', shopId: 'shop-3', name: 'บะหมี่เกี๊ยวน้ำ', emoji: '🥟', price: 40, prepTime: 6, description: 'น้ำซุปใสกับเกี๊ยวหมู handmade และเส้นบะหมี่ไข่', tags: ['โฮมมี่'] },

  // Green Bowl
  { id: 'item-16', shopId: 'shop-4', name: 'ควินัวเพาเวอร์โบว์', emoji: '🥙', price: 65, prepTime: 4, description: 'ควินัว อะโวคาโด เอดามาเมะ มะเขือเทศ ซอสงา', tags: ['เพื่อสุขภาพ'] },
  { id: 'item-17', shopId: 'shop-4', name: 'สลัดไก่ย่าง', emoji: '🥗', price: 55, prepTime: 5, description: 'ไก่ย่างสมุนไพรบนผักสลัดกับน้ำสลัดมะนาว', tags: ['โปรตีน'] },
  { id: 'item-18', shopId: 'shop-4', name: 'อาซาอิโบว์', emoji: '🫐', price: 60, prepTime: 3, description: 'อาซาไอแช่แข็งท็อปด้วยกราโนล่า กล้วย และน้ำผึ้ง', tags: ['ซุปเปอร์ฟู้ด'] },

  // Halal Corner
  { id: 'item-19', shopId: 'shop-5', name: 'ข้าวหมกไก่', emoji: '🍛', price: 55, prepTime: 8, description: 'ข้าวบัสมาติหอมกับไก่ผัดเครื่องเทศและราอิตะ', tags: ['ยอดนิยม', 'ฮาลาล'] },
  { id: 'item-20', shopId: 'shop-5', name: 'เนื้อเร็นดัง', emoji: '🥘', price: 65, prepTime: 10, description: 'เนื้อตุ๋นในแกงกะทิเข้มข้นกับข้าวสวย', tags: ['ฮาลาล'] },
  { id: 'item-21', shopId: 'shop-5', name: 'ไก่สะเต๊ะ', emoji: '🍢', price: 45, prepTime: 6, description: 'ไก่ย่างสะเต๊ะกับซอสถั่วและอาจาด', tags: ['ฮาลาล', 'ยอดนิยม'] },

  // Sweet Treats
  { id: 'item-22', shopId: 'shop-6', name: 'ครัวซองค์มัทฉะ', emoji: '🥐', price: 35, prepTime: 1, description: 'ครัวซองค์เนยไส้ครีมมัทฉะพรีเมียม', tags: ['ใหม่'] },
  { id: 'item-23', shopId: 'shop-6', name: 'โรตีกล้วย', emoji: '🥞', price: 25, prepTime: 2, description: 'โรตีกรอบกับกล้วย ช็อกโกแลต และนมข้น', tags: ['ยอดนิยม'] },
  { id: 'item-24', shopId: 'shop-6', name: 'พุดดิ้งมะพร้าว', emoji: '🍮', price: 20, prepTime: 1, description: 'คัสตาร์ดมะพร้าวกับคาราเมลน้ำตั้นโตนด', tags: ['คลาสสิก'] },
];

export const pickupSlots = [
  '11:30', '11:40', '11:50',
  '12:00', '12:05', '12:10', '12:15', '12:20', '12:30',
  '12:40', '12:50',
];

export const analyticsData: AnalyticsData = {
  ordersToday: 47,
  revenueToday: 2150,
  pendingOrders: 8,
  popularItem: 'ข้าวผัดกะเพราไก่',
  avgWaitTime: 4.2,
  repeatUsers: 68,
  totalOrders: 342,
  wasteReduction: 35,
  ordersByHour: [
    { hour: '10:00', orders: 3 },
    { hour: '10:30', orders: 8 },
    { hour: '11:00', orders: 15 },
    { hour: '11:30', orders: 28 },
    { hour: '12:00', orders: 35 },
    { hour: '12:30', orders: 22 },
    { hour: '13:00', orders: 12 },
    { hour: '13:30', orders: 5 },
  ],
  topMenus: [
    { name: 'ข้าวผัดกะเพราไก่', orders: 42 },
    { name: 'ชาไทยเย็น', orders: 38 },
    { name: 'ผัดไทย', orders: 31 },
    { name: 'ก๋วยเตี๋ยวเรือน้ำ', orders: 27 },
    { name: 'ข้าวหมกไก่', orders: 24 },
  ],
  dailyRevenue: [
    { day: 'จันทร์', revenue: 1850 },
    { day: 'อังคาร', revenue: 2100 },
    { day: 'พุธ', revenue: 1920 },
    { day: 'พฤหัส', revenue: 2350 },
    { day: 'ศุกร์', revenue: 2150 },
  ],
  peakQueue: [
    { time: '10:00', queue: 2 },
    { time: '10:30', queue: 5 },
    { time: '11:00', queue: 12 },
    { time: '11:30', queue: 22 },
    { time: '12:00', queue: 28 },
    { time: '12:30', queue: 18 },
    { time: '13:00', queue: 8 },
    { time: '13:30', queue: 3 },
  ],
};
