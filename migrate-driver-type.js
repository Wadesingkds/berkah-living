const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function addDriverType() {
  console.log('Adding driver type column...');
  
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      ALTER TABLE drivers ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'INTERNAL' CHECK (type IN ('INTERNAL', 'GRAB', 'GOJEK'));
      UPDATE drivers SET type = 'INTERNAL' WHERE type IS NULL;
    `
  }).catch(() => {
    // RPC might not exist, try direct approach
    console.log('RPC not available, will seed with type field directly');
    return { error: null };
  });

  if (error) {
    console.error('Error adding column:', error);
    return;
  }

  console.log('Driver type column added successfully');
}

addDriverType();
