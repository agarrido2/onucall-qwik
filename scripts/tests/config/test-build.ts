/**
 * Build Validation Test
 * 
 * Validates that the project builds successfully without TypeScript errors.
 * This test runs type checking only (no actual build).
 * 
 * Usage: bun scripts/tests/config/test-build.ts
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testBuild(): Promise<void> {
  console.log("🔍 Validating TypeScript Build\n");
  console.log("━".repeat(60));
  
  console.log("\n⏳ Running type check (this may take a few seconds)...\n");
  
  try {
    // Run TypeScript compiler in check mode (no emit)
    const { stdout, stderr } = await execAsync('bun run build.types', {
      cwd: process.cwd()
    });
    
    if (stderr && !stderr.includes('incremental')) {
      console.log("⚠️  Warnings detected:\n");
      console.log(stderr);
    }
    
    console.log("✅ TypeScript compilation successful!");
    console.log("\n📊 Summary:");
    console.log("   • No type errors found");
    console.log("   • Project is ready to build");
    console.log("\n🎉 Build validation passed!\n");
    
  } catch (error: any) {
    console.log("❌ TypeScript compilation failed!\n");
    console.log("━".repeat(60));
    console.log(error.stdout || error.message);
    console.log("━".repeat(60));
    
    console.log("\n💡 Common fixes:");
    console.log("   1. Check the errors above");
    console.log("   2. Run: bun run lint");
    console.log("   3. Run: bun run fmt");
    console.log("   4. Review recent changes for type errors");
    console.log("");
    
    process.exit(1);
  }
}

// Run the test
testBuild().catch((error) => {
  console.error("\n❌ Unexpected error:", error);
  process.exit(1);
});
