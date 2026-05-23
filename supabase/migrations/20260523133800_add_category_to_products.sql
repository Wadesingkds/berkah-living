-- Add category column to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'lainnya';

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for products bucket
CREATE POLICY "Allow public upload products" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'products');

CREATE POLICY "Allow public read products" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Allow public delete products" ON storage.objects
  FOR DELETE USING (bucket_id = 'products');
