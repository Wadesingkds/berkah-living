-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Daster', 'daster', 'Koleksi daster premium', 1),
  ('Parfum', 'parfum', 'Parfum original dan dupe', 2),
  ('Aksesoris', 'aksesoris', 'Aksesoris fashion', 3),
  ('Lainnya', 'lainnya', 'Produk lainnya', 4)
ON CONFLICT (slug) DO NOTHING;

-- Add foreign key to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- Update existing products to have category
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'daster')
WHERE category = 'daster';

UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'parfum')
WHERE category = 'parfum';

UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'aksesoris')
WHERE category = 'aksesoris';

UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'lainnya')
WHERE category = 'lainnya';

-- Drop old category column after migration
ALTER TABLE products DROP COLUMN IF EXISTS category;