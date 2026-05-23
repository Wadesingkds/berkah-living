const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const serviceDrivers = [
  { name: 'Grab', phone: 'grab-order', type: 'GRAB' },
  { name: 'Gojek', phone: 'gojek-order', type: 'GOJEK' },
];

async function seedServiceDrivers() {
  console.log('Seeding Grab and Gojek as driver options...');
  
  try {
    const { data, error } = await supabase
      .from('drivers')
      .insert(serviceDrivers)
      .select();

    if (error) {
      console.error('Error seeding service drivers:', error);
      return;
    }

    console.log('Service drivers seeded successfully:', data);
  } catch (err) {
    console.error('Exception:', err);
  }
}

seedServiceDrivers();
