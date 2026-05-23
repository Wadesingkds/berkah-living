-- Add stock management columns to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS min_stock INTEGER DEFAULT 5;

-- Add index for stock queries
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);

-- Add comment
COMMENT ON COLUMN products.stock IS 'Current stock quantity';
COMMENT ON COLUMN products.min_stock IS 'Minimum stock threshold for reorder alerts';
