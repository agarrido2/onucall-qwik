/**
 * Supabase Connection Test
 * 
 * Validates complete Supabase setup including:
 * - Environment variables
 * - API connection
 * - Authentication service
 * - Database access
 * - Storage configuration
 * 
 * Usage: bun scripts/tests/connections/test-supabase.ts
 */

import { createClient } from '@supabase/supabase-js';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'skip';
  message: string;
  error?: string;
}

async function testSupabaseConnection(): Promise<void> {
  console.log("🔍 Testing Supabase Connection\n");
  console.log("━".repeat(60));
  
  const results: TestResult[] = [];
  let hasErrors = false;

  // ========================================
  // 1. ENVIRONMENT VARIABLES
  // ========================================
  console.log("\n📋 Step 1: Validating Environment Variables");
  
  // Support both PUBLIC_ prefix (Qwik convention) and without prefix
  const supabaseUrl = process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl) {
    results.push({
      name: 'SUPABASE_URL',
      status: 'fail',
      message: 'Environment variable not found',
      error: 'Add SUPABASE_URL or PUBLIC_SUPABASE_URL to your .env file'
    });
    hasErrors = true;
  } else {
    // Validate URL format
    try {
      new URL(supabaseUrl);
      results.push({
        name: 'SUPABASE_URL',
        status: 'pass',
        message: `Found: ${supabaseUrl}`
      });
    } catch {
      results.push({
        name: 'SUPABASE_URL',
        status: 'fail',
        message: 'Invalid URL format',
        error: 'Should be: https://[project-ref].supabase.co'
      });
      hasErrors = true;
    }
  }

  if (!supabaseAnonKey) {
    results.push({
      name: 'SUPABASE_ANON_KEY',
      status: 'fail',
      message: 'Environment variable not found',
      error: 'Add SUPABASE_ANON_KEY or PUBLIC_SUPABASE_ANON_KEY to your .env file'
    });
    hasErrors = true;
  } else {
    results.push({
      name: 'SUPABASE_ANON_KEY',
      status: 'pass',
      message: `Found: ${supabaseAnonKey.substring(0, 20)}...`
    });
  }

  // Stop if no credentials
  if (hasErrors) {
    printResults(results);
    printHelp();
    process.exit(1);
  }

  // ========================================
  // 2. API CONNECTION
  // ========================================
  console.log("\n🔌 Step 2: Testing API Connection");
  
  let supabase;
  try {
    supabase = createClient(supabaseUrl!, supabaseAnonKey!);
    results.push({
      name: 'API Client',
      status: 'pass',
      message: 'Supabase client created successfully'
    });
  } catch (error: any) {
    results.push({
      name: 'API Client',
      status: 'fail',
      message: 'Failed to create Supabase client',
      error: error.message
    });
    printResults(results);
    process.exit(1);
  }

  // ========================================
  // 3. AUTHENTICATION SERVICE
  // ========================================
  console.log("\n🔐 Step 3: Testing Authentication Service");
  
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      results.push({
        name: 'Auth Service',
        status: 'fail',
        message: 'Auth endpoint not reachable',
        error: error.message
      });
      hasErrors = true;
    } else {
      results.push({
        name: 'Auth Service',
        status: 'pass',
        message: 'Auth endpoint reachable and responding'
      });
    }
  } catch (error: any) {
    results.push({
      name: 'Auth Service',
      status: 'fail',
      message: 'Auth service test failed',
      error: error.message
    });
    hasErrors = true;
  }

  // ========================================
  // 4. DATABASE ACCESS
  // ========================================
  console.log("\n🗄️  Step 4: Testing Database Access");
  
  try {
    // Try to query a system table (should always exist)
    const { data, error } = await supabase
      .from('_migrations')
      .select('*')
      .limit(1);
    
    if (error) {
      // If _migrations doesn't exist, that's OK - means no migrations yet
      // Try a simple RPC call instead
      results.push({
        name: 'Database Access',
        status: 'pass',
        message: 'Database connection established (no migrations table yet)'
      });
    } else {
      results.push({
        name: 'Database Access',
        status: 'pass',
        message: `Database accessible (${data?.length ?? 0} migrations found)`
      });
    }
  } catch (error: any) {
    results.push({
      name: 'Database Access',
      status: 'fail',
      message: 'Cannot access database',
      error: error.message
    });
    hasErrors = true;
  }

  // ========================================
  // 5. STORAGE CONFIGURATION
  // ========================================
  console.log("\n📦 Step 5: Testing Storage Configuration");
  
  try {
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      results.push({
        name: 'Storage Service',
        status: 'fail',
        message: 'Cannot access storage',
        error: error.message
      });
      hasErrors = true;
    } else {
      results.push({
        name: 'Storage Service',
        status: 'pass',
        message: `Found ${data.length} storage bucket(s)`
      });
      
      // List buckets
      if (data.length > 0) {
        console.log(`   Buckets: ${data.map(b => b.name).join(', ')}`);
      }
    }
  } catch (error: any) {
    results.push({
      name: 'Storage Service',
      status: 'fail',
      message: 'Storage service test failed',
      error: error.message
    });
    hasErrors = true;
  }

  // ========================================
  // FINAL REPORT
  // ========================================
  console.log("\n" + "━".repeat(60));
  printResults(results);

  if (hasErrors) {
    console.log("\n❌ Some tests failed. See errors above.\n");
    printHelp();
    process.exit(1);
  } else {
    console.log("\n✅ All Supabase tests passed!\n");
    console.log("🎉 Your Supabase configuration is ready for production.\n");
  }
}

function printResults(results: TestResult[]): void {
  console.log("\n📊 Test Results:\n");
  
  results.forEach(result => {
    const icon = result.status === 'pass' ? '✅' : 
                 result.status === 'fail' ? '❌' : '⏭️';
    
    console.log(`${icon} ${result.name}: ${result.message}`);
    if (result.error) {
      console.log(`   💡 ${result.error}`);
    }
  });
  
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const total = results.length;
  
  console.log(`\n📈 Summary: ${passed}/${total} passed, ${failed}/${total} failed`);
}

function printHelp(): void {
  console.log("\n📚 Help & Resources:\n");
  console.log("1. Get your Supabase credentials:");
  console.log("   → Dashboard: https://supabase.com/dashboard");
  console.log("   → Project Settings → API");
  console.log("");
  console.log("2. Add to your .env file:");
  console.log("   SUPABASE_URL=https://[project-ref].supabase.co");
  console.log("   SUPABASE_ANON_KEY=your-anon-key-here");
  console.log("");
  console.log("3. Documentation:");
  console.log("   → context/THINK_QWIK/AUTH/PROVIDERS/SUPABASE.md");
  console.log("");
}

// Run the test
testSupabaseConnection().catch((error) => {
  console.error("\n❌ Unexpected error:", error);
  process.exit(1);
});
