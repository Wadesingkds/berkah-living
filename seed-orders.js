const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nyswjttnzstjnbcrmffw.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const sampleOrders = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    order_number: 'ORD-20260523-0001',
    customer_id: null,
    total: 450000,
    status: 'PENDING',
    payment_type: 'QRIS',
    source: 'MANUAL',
    driver_id: null,
    notes: 'Antar pagi ya',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    order_number: 'ORD-20260523-0002',
    customer_id: null,
    total: 280000,
    status: 'PAID',
    payment_type: 'TRANSFER',
    source: 'MANUAL',
    driver_id: null,
    notes: null,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    order_number: 'ORD-20260523-0003',
    customer_id: null,
    total: 620000,
    status: 'DELIVERED',
    payment_type: 'COD',
    source: 'MANUAL',
    driver_id: null,
    notes: 'Rumah warna hijau',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    order_number: 'ORD-20260523-0004',
    customer_id: null,
    total: 150000,
    status: 'DONE',
    payment_type: 'QRIS',
    source: 'MANUAL',
    driver_id: null,
    notes: null,
  },
];

async function seedOrders() {
  try {
    console.log('Inserting sample orders...');
    const { data, error } = await supabase
      .from('orders')
      .insert(sampleOrders);

    if (error) {
      console.error('Error inserting orders:', error);
      process.exit(1);
    }

    console.log('✓ Successfully inserted', sampleOrders.length, 'orders');
    process.exit(0);
  } catch (err) {
    console.error('Fatal error:', err);
    process.exit(1);
  }
}

seedOrders();
