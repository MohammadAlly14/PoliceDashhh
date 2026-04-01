/**
 * Script to disable RLS (Row Level Security) for development
 * Run with: node scripts/disable-rls.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function disableRLS() {
  try {
    console.log('🔓 Disabling RLS for development...\n');

    const tables = ['users', 'incidents', 'complaints'];
    
    for (const table of tables) {
      const { error } = await supabase.rpc('exec', {
        sql: `ALTER TABLE public.${table} DISABLE ROW LEVEL SECURITY;`
      }).catch(() => {
        // If rpc method doesn't work, we'll need to use raw SQL
        return { error: true };
      });

      if (error) {
        console.log(`⚠️  Unable to disable RLS via rpc for ${table}`);
      } else {
        console.log(`✅ RLS disabled for ${table}`);
      }
    }

    console.log('\n📝 Note: If the above failed, please run these SQL commands directly in Supabase SQL Editor:');
    console.log('---');
    tables.forEach(table => {
      console.log(`ALTER TABLE public.${table} DISABLE ROW LEVEL SECURITY;`);
    });
    console.log('---');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📝 Please run these SQL commands directly in Supabase SQL Editor:');
    console.log('---');
    ['users', 'incidents', 'complaints'].forEach(table => {
      console.log(`ALTER TABLE public.${table} DISABLE ROW LEVEL SECURITY;`);
    });
    console.log('---');
    process.exit(1);
  }
}

disableRLS();
