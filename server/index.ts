import express from 'express';
import cors from 'cors';
import db from './db';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
const THAILLM_API_KEY = 'm81NpgBObPbA7P45XMP9tx5npF57eb33';
const THAILLM_URL = 'http://thaillm.or.th/api/typhoon/v1/chat/completions';

// ============ AUTH ============
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT id, name, username, role FROM users WHERE username = ? AND password = ?').get(username, password);
  if (!user) {
    return res.status(401).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
  }
  res.json(user);
});

// ============ SHOPS ============
app.get('/api/shops', (req, res) => {
  const shops = db.prepare(`
    SELECT s.id, s.name, s.emoji, s.gradient, s.rating, s.reviews, s.prep_time, s.description,
           GROUP_CONCAT(sc.category) as categories
    FROM shops s
    LEFT JOIN shop_categories sc ON s.id = sc.shop_id
    GROUP BY s.id
  `).all();

  const result = shops.map((s: any) => ({
    ...s,
    prepTime: s.prep_time,
    categories: s.categories ? s.categories.split(',') : [],
  }));
  res.json(result);
});

// ============ MENU ITEMS ============
app.get('/api/menu-items', (req, res) => {
  const { shop_id, include_unavailable } = req.query;
  let query = `
    SELECT m.id, m.shop_id as shopId, m.name, m.emoji, m.price, m.prep_time as prepTime, m.description,
           m.is_available as isAvailable, m.time_slots as timeSlots, m.image_url as imageUrl,
           GROUP_CONCAT(mt.tag) as tags
    FROM menu_items m
    LEFT JOIN menu_item_tags mt ON m.id = mt.item_id
  `;
  const params: any[] = [];
  if (shop_id) {
    query += ' WHERE m.shop_id = ?';
    params.push(shop_id);
  }
  query += ' GROUP BY m.id';

  const items = db.prepare(query).all(...params);
  const result = items.map((i: any) => ({
    ...i,
    isAvailable: i.isAvailable !== 0,  // NULL means available (backward compat)
    timeSlots: i.timeSlots ? i.timeSlots.split(',').filter(Boolean) : [],
    imageUrl: i.imageUrl || '',
    tags: i.tags ? i.tags.split(',') : [],
  }));

  // Filter out unavailable items unless explicitly requested
  if (!include_unavailable) {
    res.json(result.filter((item: any) => item.isAvailable !== false));
  } else {
    res.json(result);
  }
});

app.post('/api/menu-items', (req, res) => {
  const { shopId, name, emoji, price, prepTime, description, tags, timeSlots } = req.body;
  const id = `item-${Date.now()}`;
  const insertItem = db.prepare(
    'INSERT INTO menu_items (id, shop_id, name, emoji, price, prep_time, description, is_available, time_slots) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)'
  );
  insertItem.run(id, shopId, name, emoji, price, prepTime, description || '', timeSlots?.join(',') || 'morning,lunch,afternoon');
  if (tags?.length) {
    const insertTag = db.prepare('INSERT INTO menu_item_tags (item_id, tag) VALUES (?, ?)');
    for (const tag of tags) insertTag.run(id, tag);
  }
  res.json({ id, shopId, name, emoji, price, prepTime, description, tags: tags || [], isAvailable: true, timeSlots: timeSlots || ['morning', 'lunch', 'afternoon'] });
});

app.put('/api/menu-items/:id', (req, res) => {
  const { id } = req.params;
  const { name, emoji, price, prepTime, description, tags, isAvailable, timeSlots } = req.body;
  db.prepare(
    'UPDATE menu_items SET name = ?, emoji = ?, price = ?, prep_time = ?, description = ?, is_available = ?, time_slots = ? WHERE id = ?'
  ).run(name, emoji, price, prepTime, description, isAvailable ? 1 : 0, timeSlots?.join(',') || '', id);
  // Replace tags
  db.prepare('DELETE FROM menu_item_tags WHERE item_id = ?').run(id);
  if (tags?.length) {
    const insertTag = db.prepare('INSERT INTO menu_item_tags (item_id, tag) VALUES (?, ?)');
    for (const tag of tags) insertTag.run(id, tag);
  }
  res.json({ success: true });
});

app.delete('/api/menu-items/:id', (req, res) => {
  db.prepare('UPDATE menu_items SET is_available = 0 WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

app.patch('/api/menu-items/:id/availability', (req, res) => {
  const { isAvailable } = req.body;
  db.prepare('UPDATE menu_items SET is_available = ? WHERE id = ?').run(isAvailable ? 1 : 0, req.params.id);
  res.json({ success: true, isAvailable });
});

// ============ ORDERS ============
app.get('/api/orders', (req, res) => {
  const orders = db.prepare(`
    SELECT o.id, o.queue_no as queueNo, o.student_id as studentId, o.student_name as studentName,
           o.pickup_time as pickupTime, o.status, o.total, o.payment_method as paymentMethod,
           o.payment_status as paymentStatus, o.created_at as createdAt
    FROM orders o
    ORDER BY o.created_at DESC
  `).all();

  const orderItems = db.prepare(`
    SELECT oi.order_id as orderId, oi.menu_item_id as menuItemId, oi.name, oi.emoji, oi.quantity, oi.price
    FROM order_items oi
  `).all();

  const itemsByOrder: Record<string, any[]> = {};
  for (const item of orderItems) {
    if (!itemsByOrder[item.orderId]) itemsByOrder[item.orderId] = [];
    itemsByOrder[item.orderId].push({
      name: item.name,
      emoji: item.emoji,
      quantity: item.quantity,
      price: item.price,
    });
  }

  const result = orders.map((o: any) => ({
    ...o,
    items: itemsByOrder[o.id] || [],
  }));
  res.json(result);
});

app.post('/api/orders', (req, res) => {
  const { studentId, studentName, items, pickupTime, total } = req.body;

  // Get next queue number
  const lastOrder = db.prepare('SELECT queue_no FROM orders ORDER BY queue_no DESC LIMIT 1').get() as { queue_no: string } | undefined;
  let queueNum = 27;
  if (lastOrder) {
    const num = parseInt(lastOrder.queue_no.replace('A', ''), 10);
    queueNum = num + 1;
  }

  const orderId = `ORD-${Date.now()}`;
  const queueNo = `A${queueNum}`;

  const insertOrder = db.prepare('INSERT INTO orders (id, queue_no, student_id, student_name, pickup_time, status, total, payment_method) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  insertOrder.run(orderId, queueNo, studentId, studentName, pickupTime, 'pending', total, 'qr');

  const insertOrderItem = db.prepare('INSERT INTO order_items (id, order_id, menu_item_id, name, emoji, quantity, price) VALUES (?, ?, ?, ?, ?, ?, ?)');
  for (const item of items) {
    const orderItemId = `OI-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    insertOrderItem.run(orderItemId, orderId, item.menuItemId || null, item.name, item.emoji, item.quantity, item.price);
  }

  res.json({ id: orderId, queueNo });
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ['pending', 'accepted', 'preparing', 'ready', 'picked_up'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'สถานะไม่ถูกต้อง' });
  }
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
  res.json({ success: true });
});

// ============ ANALYTICS ============
app.get('/api/analytics', (req, res) => {
  const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number };
  const todayRevenue = db.prepare('SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE date(created_at) = date("now")').get() as { total: number };
  const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status IN ('pending', 'accepted')").get() as { count: number };

  // Orders by hour
  const ordersByHour = db.prepare(`
    SELECT strftime('%H:00', created_at) as hour, COUNT(*) as orders
    FROM orders
    GROUP BY hour
    ORDER BY hour
  `).all();

  // Top menus
  const topMenus = db.prepare(`
    SELECT oi.name, SUM(oi.quantity) as orders
    FROM order_items oi
    GROUP BY oi.name
    ORDER BY orders DESC
    LIMIT 5
  `).all();

  // Daily revenue
  const dailyRevenue = db.prepare(`
    SELECT strftime('%w', created_at) as day_num,
           CASE strftime('%w', created_at)
             WHEN '0' THEN 'อาทิตย์' WHEN '1' THEN 'จันทร์' WHEN '2' THEN 'อังคาร'
             WHEN '3' THEN 'พุธ' WHEN '4' THEN 'พฤหัส' WHEN '5' THEN 'ศุกร์' WHEN '6' THEN 'เสาร์'
           END as day,
           SUM(total) as revenue
    FROM orders
    GROUP BY day_num
    ORDER BY day_num
  `).all();

  res.json({
    totalOrders: totalOrders.count,
    todayRevenue: todayRevenue.total,
    pendingOrders: pendingOrders.count,
    ordersByHour,
    topMenus,
    dailyRevenue,
  });
});

// ============ CHAT (ThaiLLM) ============
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'กรุณาส่งข้อความ' });
  }

  // Gather menu context
  const shops = db.prepare('SELECT name, emoji, description FROM shops').all();
  const menuItems = db.prepare('SELECT name, emoji, price, prep_time, description FROM menu_items').all();

  const menuContext = [
    'คุณเป็นผู้ช่วยแนะนำอาหารในโรงอาหาร (Smart Canteen)',
    'ตอบกลับเป็นภาษาไทยเสมอ ตอบแบบเป็นกันเอง สั้นๆ กระชับ',
    '',
    '=== ข้อมูลร้านค้า ===',
    ...shops.map((s: any) => `${s.emoji} ${s.name}: ${s.description}`),
    '',
    '=== ข้อมูลเมนูอาหาร ===',
    ...menuItems.map((m: any) => `  ${m.emoji} ${m.name} — ${m.price} บาท (เตรียม ${m.prep_time} นาที): ${m.description}`),
  ].join('\n');

  const systemPrompt = `${menuContext}

แนะนำเมนูจากข้อมูลด้านบน ถ้าลูกค้าบอกว่าไม่รู้จะกินอะไร ให้ถามความชอบหรือแนะนำเมนูยอดนิยม
ถ้าถามเรื่องรสชาติ ราคา หรือส่วนประกอบ ให้ตอบจากข้อมูลที่มี
อย่าแนะนำเมนูที่ไม่มีในรายการด้านบน`;

  try {
    const response = await fetch(THAILLM_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${THAILLM_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('ThaiLLM API error:', response.status, errText);
      return res.status(502).json({ error: 'AI ไม่พร้อมใช้งาน ลองอีกครั้ง' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'ขออภัย ไม่สามารถตอบได้ขณะนี้';
    res.json({ reply });
  } catch (err: any) {
    console.error('Chat API error:', err.message);
    res.status(502).json({ error: 'AI ไม่พร้อมใช้งาน ลองอีกครั้ง' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`);
});
