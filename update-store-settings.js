const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateStoreSettings() {
  console.log('Updating store settings...');
  
  const { data, error } = await supabase
    .from('store_settings')
    .update({
      store_name: 'LocalHub',
      store_description: 'Ayam Organik & Daging Segar',
      store_address: 'Kudus, Jawa Tengah',
      opening_hours: '06:00',
      closing_hours: '18:00',
      is_open: true
    })
    .eq('id', '8de781c0-8042-4dc6-ae99-2ffeec14fac9')
    .select();

  if (error) {
    console.error('Error updating store settings:', error);
    return;
  }

  console.log('Store settings updated successfully:', data);
}

updateStoreSettings();
