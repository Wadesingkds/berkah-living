-- Berkah Living Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE
);

-- Customers
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  is_vip BOOLEAN NOT NULL DEFAULT FALSE,
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_spend NUMERIC(12,2) NOT NULL DEFAULT 0,
  last_order_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Drivers
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  total NUMERIC(12,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','PAID','DELIVERED','DONE','CANCELLED')),
  payment_type TEXT NOT NULL CHECK (payment_type IN ('QRIS','TRANSFER','COD')),
  source TEXT NOT NULL CHECK (source IN ('CHAT','CATALOG','MANUAL')),
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  qty INTEGER NOT NULL CHECK (qty > 0),
  price NUMERIC(12,2) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);

-- RLS Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Categories: authenticated users can read, write
CREATE POLICY "categories_all_authenticated" ON categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Customers: authenticated users can read, write
CREATE POLICY "customers_all_authenticated" ON customers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Products: authenticated users can read, write
CREATE POLICY "products_all_authenticated" ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Drivers: authenticated users can read, write
CREATE POLICY "drivers_all_authenticated" ON drivers
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Orders: authenticated users can read, write
CREATE POLICY "orders_all_authenticated" ON orders
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Order Items: authenticated users can read, write
CREATE POLICY "order_items_all_authenticated" ON order_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
