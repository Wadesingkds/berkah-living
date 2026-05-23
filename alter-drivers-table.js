const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function alterDriversTable() {
  console.log('Altering drivers table...');
  
  // Use raw SQL via REST API
  const { data, error } = await supabase.rpc('exec', {
    sql: "ALTER TABLE drivers ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'INTERNAL' CHECK (type IN ('INTERNAL', 'GRAB', 'GOJEK'));"
  }).catch(async () => {
    // If RPC doesn't work, try direct fetch to Supabase REST API
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/exec`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        sql: "ALTER TABLE drivers ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'INTERNAL' CHECK (type IN ('INTERNAL', 'GRAB', 'GOJEK'));"
      })
    });
    
    if (!response.ok) {
      console.log('Direct SQL execution not available. Will use manual approach.');
      return { error: 'not_available' };
    }
    
    return { data: await response.json(), error: null };
  });

  if (error && error !== 'not_available') {
    console.error('Error:', error);
    console.log('\nManual steps needed:');
    console.log('1. Go to Supabase dashboard > SQL Editor');
    console.log('2. Run this SQL:');
    console.log("   ALTER TABLE drivers ADD COLUMN type TEXT DEFAULT 'INTERNAL' CHECK (type IN ('INTERNAL', 'GRAB', 'GOJEK'));");
    console.log("   UPDATE drivers SET type = 'INTERNAL' WHERE type IS NULL;");
    return;
  }

  console.log('Table altered successfully');
}

alterDriversTable();
