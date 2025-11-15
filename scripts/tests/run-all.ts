#!/usr/bin/env bun
/**
 * Run All Tests
 * 
 * Executes all tests including:
 * - Configuration tests (environment, build)
 * - Connection tests (Supabase, etc.)
 * 
 * Usage: bun scripts/tests/run-all.ts
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface TestSuite {
  name: string;
  tests: Array<{
    name: string;
    path: string;
    required: boolean;
  }>;
}

const TEST_SUITES: TestSuite[] = [
  {
    name: 'Configuration Tests',
    tests: [
      {
        name: 'Environment Variables',
        path: 'scripts/tests/config/test-env.ts',
        required: true
      },
      {
        name: 'TypeScript Build',
        path: 'scripts/tests/config/test-build.ts',
        required: true
      }
    ]
  },
  {
    name: 'Connection Tests',
    tests: [
      {
        name: 'Supabase Connection',
        path: 'scripts/tests/connections/test-supabase.ts',
        required: true
      }
    ]
  }
];

async function runAllTests(): Promise<void> {
  console.log("🧪 OnuCall - Complete Test Suite\n");
  console.log("━".repeat(70));
  
  const allResults: { suite: string; test: string; passed: boolean }[] = [];
  let hasFailures = false;
  
  for (const suite of TEST_SUITES) {
    console.log(`\n\n📦 ${suite.name}`);
    console.log("━".repeat(70));
    
    for (const test of suite.tests) {
      console.log(`\n▶️  Running: ${test.name}`);
      console.log("─".repeat(70));
      
      try {
        await execAsync(`bun ${test.path}`);
        allResults.push({ 
          suite: suite.name, 
          test: test.name, 
          passed: true 
        });
        console.log(`\n✅ ${test.name} passed`);
      } catch (error: any) {
        allResults.push({ 
          suite: suite.name, 
          test: test.name, 
          passed: false 
        });
        
        if (test.required) {
          hasFailures = true;
          console.log(`\n❌ ${test.name} failed (REQUIRED)`);
        } else {
          console.log(`\n⚠️  ${test.name} failed (optional)`);
        }
      }
    }
  }
  
  // Final summary
  console.log("\n\n" + "━".repeat(70));
  console.log("📊 Complete Test Summary\n");
  
  for (const suite of TEST_SUITES) {
    console.log(`\n${suite.name}:`);
    const suiteResults = allResults.filter(r => r.suite === suite.name);
    suiteResults.forEach(result => {
      const icon = result.passed ? '✅' : '❌';
      console.log(`  ${icon} ${result.test}`);
    });
  }
  
  const passed = allResults.filter(r => r.passed).length;
  const failed = allResults.filter(r => !r.passed).length;
  const total = allResults.length;
  
  console.log("\n" + "━".repeat(70));
  console.log(`📈 Overall: ${passed}/${total} tests passed, ${failed}/${total} failed`);
  
  if (hasFailures) {
    console.log("\n❌ Some required tests failed.");
    console.log("   Fix errors above before deploying to production.\n");
    process.exit(1);
  } else {
    console.log("\n🎉 All tests passed! Your project is ready for deployment.\n");
  }
}

runAllTests().catch(error => {
  console.error("\n❌ Unexpected error:", error);
  process.exit(1);
});
