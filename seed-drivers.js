const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const drivers = [
  { name: 'Agus Supriadi', phone: '081234567890' },
  { name: 'Budi Santoso', phone: '082345678901' },
  { name: 'Candra Wijaya', phone: '083456789012' },
];

async function seedDrivers() {
  console.log('Seeding drivers...');
  
  const { data, error } = await supabase
    .from('drivers')
    .insert(drivers)
    .select();

  if (error) {
    console.error('Error seeding drivers:', error);
    return;
  }

  console.log('Drivers seeded successfully:', data);
}

seedDrivers();
