-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT now()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 5,
  category_id UUID REFERENCES categories(id),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  is_vip BOOLEAN DEFAULT false,
  total_orders INTEGER DEFAULT 0,
  total_spend INTEGER DEFAULT 0,
  last_order_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  total INTEGER NOT NULL,
  status TEXT DEFAULT 'PENDING',
  payment_type TEXT DEFAULT 'TRANSFER',
  source TEXT DEFAULT 'CHAT',
  driver_id UUID,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  qty INTEGER NOT NULL,
  price INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Drivers
CREATE TABLE drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- AI Insights
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all for now - add auth later)
CREATE POLICY "Allow all" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all" ON products FOR ALL USING (true);
CREATE POLICY "Allow all" ON customers FOR ALL USING (true);
CREATE POLICY "Allow all" ON orders FOR ALL USING (true);
CREATE POLICY "Allow all" ON order_items FOR ALL USING (true);
CREATE POLICY "Allow all" ON drivers FOR ALL USING (true);
CREATE POLICY "Allow all" ON ai_insights FOR ALL USING (true);

-- Insert sample categories
INSERT INTO categories (name) VALUES
  ('Ayam Organik'),
  ('Daging Segar'),
  ('Produk Olahan'),
  ('Bumbu & Rempah');

-- Insert sample products
INSERT INTO products (name, price, stock, category_id, is_active) VALUES
  ('Ayam Organik 1kg', 85000, 20, (SELECT id FROM categories WHERE name = 'Ayam Organik'), true),
  ('Daging Sapi Premium 500g', 120000, 15, (SELECT id FROM categories WHERE name = 'Daging Segar'), true),
  ('Sosis Homemade 250g', 45000, 30, (SELECT id FROM categories WHERE name = 'Produk Olahan'), true);
