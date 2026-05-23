const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

async function addStockColumns() {
  console.log('Adding stock columns to products table...')
  
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0,
      ADD COLUMN IF NOT EXISTS min_stock INTEGER DEFAULT 5;
      
      CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock);
    `
  })
  
  if (error) {
    console.error('Error:', error)
    process.exit(1)
  }
  
  console.log('✓ Stock columns added successfully')
}

addStockColumns()
