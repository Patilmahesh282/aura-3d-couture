import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS } from './src/data/initialProducts';
import { Product, User, Order, StockPerSize, Size } from './src/types';

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'aura-3d-secret-jwt-key-2026';
const DB_FILE = path.join(process.cwd(), 'data_store.json');

// Memory & JSON File Database initialization
interface DatabaseSchema {
  products: Product[];
  users: User[];
  userPasswords: Record<string, string>; // userId -> hashedPassword
  orders: Order[];
}

function loadDatabase(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      // Ensure initial products exist if db file had empty products
      if (!parsed.products || parsed.products.length === 0) {
        parsed.products = INITIAL_PRODUCTS;
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error reading DB_FILE, fallback to initial state:', err);
  }

  // Initial seed state
  const adminPasswordHash = bcrypt.hashSync('admin123', 8);
  const userPasswordHash = bcrypt.hashSync('user123', 8);

  const adminUser: User = {
    id: 'user-admin-01',
    email: 'admin@aura3d.com',
    name: 'Alex Vance (Store Manager)',
    role: 'admin',
    auraPoints: 500
  };

  const demoUser: User = {
    id: 'user-demo-02',
    email: 'demo@aura.com',
    name: 'Sarah Connor',
    role: 'customer',
    auraPoints: 125,
    savedAddresses: [
      {
        street: '742 Cyberpunk Ave, Suite 300',
        city: 'Neo Tokyo',
        state: 'CA',
        zip: '90210',
        country: 'United States'
      }
    ]
  };

  const db: DatabaseSchema = {
    products: INITIAL_PRODUCTS,
    users: [adminUser, demoUser],
    userPasswords: {
      'user-admin-01': adminPasswordHash,
      'user-demo-02': userPasswordHash
    },
    orders: [
      {
        id: 'ORD-94812',
        userId: 'user-demo-02',
        customerName: 'Sarah Connor',
        customerEmail: 'demo@aura.com',
        items: [
          {
            productId: 'aura-hoodie-01',
            name: 'AURA Cyber Oversized Hoodie',
            price: 145,
            quantity: 1,
            size: 'M',
            color: '#111318'
          }
        ],
        subtotal: 145,
        discount: 21.75,
        tax: 9.86,
        shippingFee: 0,
        total: 133.11,
        shippingAddress: {
          fullName: 'Sarah Connor',
          street: '742 Cyberpunk Ave, Suite 300',
          city: 'Neo Tokyo',
          state: 'CA',
          zip: '90210',
          country: 'United States'
        },
        paymentMethod: 'card',
        paymentStatus: 'paid',
        transactionId: 'TXN-STRIPE-849201',
        orderStatus: 'Shipped',
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        estimatedDelivery: new Date(Date.now() + 86400000 * 2).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }
    ]
  };

  saveDatabase(db);
  return db;
}

function saveDatabase(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

let db = loadDatabase();

// SSE Connected Clients for Real-Time Inventory Tracking
const sseClients: Response[] = [];

function broadcastInventoryChange(productId: string, newStock: StockPerSize, message?: string) {
  const payload = JSON.stringify({
    type: 'INVENTORY_UPDATE',
    productId,
    stock: newStock,
    message: message || 'Stock updated in real-time',
    timestamp: new Date().toISOString()
  });

  sseClients.forEach(client => {
    client.write(`data: ${payload}\n\n`);
  });
}

async function startServer() {
  const app = express();

  app.use(express.json());

  // API Middleware for auth check
  const authenticateToken = (req: Request & { user?: any }, res: Response, next: Function) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Authentication token required' });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: 'Invalid or expired token' });
      req.user = user;
      next();
    });
  };

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // GET Products
  app.get('/api/products', (req, res) => {
    res.json({ products: db.products });
  });

  // GET Product by ID
  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = db.products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product });
  });

  // REAL-TIME INVENTORY SSE STREAM
  app.get('/api/inventory/stream', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Send initial ping
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', message: 'Real-time inventory stream established' })}\n\n`);

    sseClients.push(res);

    req.on('close', () => {
      const idx = sseClients.indexOf(res);
      if (idx !== -1) sseClients.splice(idx, 1);
    });
  });

  // ADMIN / STORE RESTOCK PRODUCT INVENTORY
  app.post('/api/products/:id/stock', (req, res) => {
    const { id } = req.params;
    const { size, quantity, action } = req.body; // action: 'set' | 'add'

    const product = db.products.find(p => p.id === id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const sizeKey = size as Size;
    if (!product.stock[sizeKey] && product.stock[sizeKey] !== 0) {
      return res.status(400).json({ error: 'Invalid size' });
    }

    if (action === 'set') {
      product.stock[sizeKey] = Math.max(0, Number(quantity));
    } else {
      product.stock[sizeKey] = Math.max(0, product.stock[sizeKey] + Number(quantity));
    }

    saveDatabase(db);
    broadcastInventoryChange(id, product.stock, `Stock updated for ${product.name} (Size ${size})`);

    res.json({ success: true, product });
  });

  // AUTH: REGISTER
  app.post('/api/auth/register', (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const userId = `user-${Date.now()}`;
    const hashedPassword = bcrypt.hashSync(password, 8);

    const newUser: User = {
      id: userId,
      email: email.toLowerCase(),
      name,
      role: 'customer',
      auraPoints: 50 // Signup bonus
    };

    db.users.push(newUser);
    db.userPasswords[userId] = hashedPassword;
    saveDatabase(db);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ user: newUser, token });
  });

  // AUTH: LOGIN
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;

    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const hashedPassword = db.userPasswords[user.id];
    if (!hashedPassword || !bcrypt.compareSync(password, hashedPassword)) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ user, token });
  });

  // AUTH: GET CURRENT USER ME
  app.get('/api/auth/me', authenticateToken, (req: any, res: Response) => {
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  });

  // PAYMENT GATEWAY & CHECKOUT ORDER PROCESSING
  app.post('/api/checkout/pay', (req: Request, res: Response) => {
    const { items, shippingAddress, paymentMethod, paymentDetails, userId, promoCode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // Validate inventory for each item
    for (const item of items) {
      const product = db.products.find(p => p.id === item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product "${item.name}" is no longer available.` });
      }
      const sizeStock = product.stock[item.size as Size] || 0;
      if (sizeStock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for ${item.name} (${item.size}). Only ${sizeStock} left!`
        });
      }
    }

    // Decrement stock in database & trigger SSE live update
    items.forEach((item: any) => {
      const product = db.products.find(p => p.id === item.productId)!;
      const sizeKey = item.size as Size;
      product.stock[sizeKey] = Math.max(0, product.stock[sizeKey] - item.quantity);
      broadcastInventoryChange(product.id, product.stock, `Item purchased: ${product.name} (Size ${item.size})`);
    });

    // Calculate financials
    const subtotal = items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0);
    let discount = 0;
    if (promoCode === 'AURA3D') discount = subtotal * 0.15;
    if (promoCode === 'VIP20') discount = subtotal * 0.20;
    if (promoCode === 'FREESHIP') discount = subtotal * 0.10;

    const afterDiscount = subtotal - discount;
    const tax = Number((afterDiscount * 0.08).toFixed(2));
    const shippingFee = subtotal > 150 ? 0 : 15;
    const total = Number((afterDiscount + tax + shippingFee).toFixed(2));

    const transactionId = `TXN-${paymentMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const deliveryDate = new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    const newOrder: Order = {
      id: orderId,
      userId: userId || 'guest-user',
      customerName: shippingAddress?.fullName || 'Guest Shopper',
      customerEmail: shippingAddress?.email || 'shopper@aura.com',
      items: items.map((i: any) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        size: i.size,
        color: i.selectedColor || i.color
      })),
      subtotal,
      discount,
      tax,
      shippingFee,
      total,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'paid',
      transactionId,
      orderStatus: 'Processing',
      createdAt: new Date().toISOString(),
      estimatedDelivery: deliveryDate
    };

    db.orders.unshift(newOrder);

    // If registered user, update AuraPoints (+1 point per $1 spent)
    if (userId) {
      const user = db.users.find(u => u.id === userId);
      if (user) {
        user.auraPoints += Math.floor(total);
      }
    }

    saveDatabase(db);

    // Simulate 1.2 second secure gateway processing handshake
    setTimeout(() => {
      res.json({
        success: true,
        order: newOrder,
        transactionId,
        message: 'Payment authorized successfully!'
      });
    }, 1200);
  });

  // GET ORDERS FOR USER
  app.get('/api/orders/user/:userId', (req, res) => {
    const userOrders = db.orders.filter(o => o.userId === req.params.userId);
    res.json({ orders: userOrders });
  });

  // ADMIN GET ALL ORDERS
  app.get('/api/admin/orders', (req, res) => {
    res.json({ orders: db.orders });
  });

  // ADMIN UPDATE ORDER STATUS
  app.post('/api/admin/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const order = db.orders.find(o => o.id === id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.orderStatus = status;
    saveDatabase(db);
    res.json({ success: true, order });
  });

  // --- VITE & STATIC SERVING ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AURA 3D Couture Server] Listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
