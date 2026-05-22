-- Create tables
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  stock INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 5,
  category_id UUID REFERENCES public.categories(id),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  is_vip BOOLEAN DEFAULT false,
  total_orders INTEGER DEFAULT 0,
  total_spend INTEGER DEFAULT 0,
  last_order_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES public.customers(id),
  total INTEGER NOT NULL,
  status TEXT DEFAULT 'PENDING',
  payment_type TEXT DEFAULT 'TRANSFER',
  source TEXT DEFAULT 'CHAT',
  driver_id UUID,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id),
  qty INTEGER NOT NULL,
  price INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all" ON public.categories FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.customers FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.orders FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.order_items FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.drivers FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.ai_insights FOR ALL USING (true);

-- Insert sample data
INSERT INTO public.categories (name) VALUES 
  ('Ayam Organik'),
  ('Daging Segar'),
  ('Produk Olahan'),
  ('Bumbu & Rempah')
ON CONFLICT DO NOTHING;
