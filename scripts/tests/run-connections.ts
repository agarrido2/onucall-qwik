#!/usr/bin/env bun
/**
 * Run All Connection Tests
 * 
 * Executes all connection tests for external services.
 * 
 * Usage: bun scripts/tests/run-connections.ts
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface TestConfig {
  name: string;
  path: string;
  required: boolean;
  provider: string;
}

const TESTS: TestConfig[] = [
  {
    name: 'Supabase Connection',
    path: 'scripts/tests/connections/test-supabase.ts',
    required: true,
    provider: 'Supabase'
  },
  // Add more tests as they are implemented
  // {
  //   name: 'Firebase Connection',
  //   path: 'scripts/tests/connections/test-firebase.ts',
  //   required: false,
  //   provider: 'Firebase'
  // },
];

async function runAllConnectionTests(): Promise<void> {
  console.log("🧪 Running All Connection Tests\n");
  console.log("━".repeat(70));
  
  const results: { test: string; passed: boolean; error?: string }[] = [];
  let hasFailures = false;
  
  for (const test of TESTS) {
    console.log(`\n▶️  Running: ${test.name} (${test.provider})`);
    console.log("━".repeat(70));
    
    try {
      await execAsync(`bun ${test.path}`);
      results.push({ test: test.name, passed: true });
      console.log(`\n✅ ${test.name} passed\n`);
    } catch (error: any) {
      results.push({ 
        test: test.name, 
        passed: false,
        error: error.message 
      });
      
      if (test.required) {
        hasFailures = true;
        console.log(`\n❌ ${test.name} failed (REQUIRED)\n`);
      } else {
        console.log(`\n⚠️  ${test.name} failed (optional)\n`);
      }
    }
  }
  
  // Final summary
  console.log("\n" + "━".repeat(70));
  console.log("📊 Final Summary:\n");
  
  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    console.log(`${icon} ${result.test}`);
  });
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  console.log(`\n${passed}/${total} tests passed`);
  
  if (hasFailures) {
    console.log("\n❌ Some required tests failed. Fix errors above before deploying.\n");
    process.exit(1);
  } else {
    console.log("\n🎉 All connection tests passed!\n");
  }
}

runAllConnectionTests().catch(error => {
  console.error("\n❌ Unexpected error:", error);
  process.exit(1);
});
