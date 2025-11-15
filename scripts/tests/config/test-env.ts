/**
 * Environment Variables Validation Test
 * 
 * Validates that all required environment variables are present
 * and correctly formatted for the OnuCall project.
 * 
 * Usage: bun scripts/tests/config/test-env.ts
 */

interface EnvVar {
  name: string;
  required: boolean;
  provider: string;
  validator?: (value: string) => boolean;
  example: string;
  description: string;
}

const ENV_VARIABLES: EnvVar[] = [
  // Supabase (Required - Currently Active)
  {
    name: 'SUPABASE_URL',
    required: true,
    provider: 'Supabase',
    validator: (value) => value.startsWith('https://') && value.includes('.supabase.co'),
    example: 'https://abcdefghijk.supabase.co',
    description: 'Supabase project URL'
  },
  {
    name: 'SUPABASE_ANON_KEY',
    required: true,
    provider: 'Supabase',
    validator: (value) => value.length > 100,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Supabase anonymous key (public)'
  },
  
  // OAuth Google (Required - Currently Active)
  {
    name: 'GOOGLE_CLIENT_ID',
    required: false,
    provider: 'Google OAuth',
    validator: (value) => value.endsWith('.apps.googleusercontent.com'),
    example: '123456789-abcdefg.apps.googleusercontent.com',
    description: 'Google OAuth Client ID'
  },
  {
    name: 'GOOGLE_CLIENT_SECRET',
    required: false,
    provider: 'Google OAuth',
    validator: (value) => value.length > 20,
    example: 'GOCSPX-xxxxxxxxxxxxxxxxx',
    description: 'Google OAuth Client Secret'
  },
  
  // OAuth GitHub (Planned - Future)
  {
    name: 'GITHUB_CLIENT_ID',
    required: false,
    provider: 'GitHub OAuth',
    validator: (value) => value.length > 10,
    example: 'Iv1.abcdef123456',
    description: 'GitHub OAuth App Client ID'
  },
  {
    name: 'GITHUB_CLIENT_SECRET',
    required: false,
    provider: 'GitHub OAuth',
    validator: (value) => value.length === 40,
    example: 'abcdef1234567890abcdef1234567890abcdef12',
    description: 'GitHub OAuth App Client Secret'
  },
  
  // Firebase (Planned - Future Alternative)
  {
    name: 'FIREBASE_API_KEY',
    required: false,
    provider: 'Firebase',
    validator: (value) => value.startsWith('AIza'),
    example: 'AIzaSyAbCdEf1234567890',
    description: 'Firebase Web API Key'
  },
  {
    name: 'FIREBASE_PROJECT_ID',
    required: false,
    provider: 'Firebase',
    example: 'my-project-id',
    description: 'Firebase Project ID'
  },
  
  // Retell AI (Planned - Future Integration)
  {
    name: 'RETELL_AI_API_KEY',
    required: false,
    provider: 'Retell AI',
    example: 'retell_xxxxxxxxxxxxxxxx',
    description: 'Retell AI API Key for voice agents'
  },
  
  // Zadarma VoIP (Planned - Future Integration)
  {
    name: 'ZADARMA_USER_KEY',
    required: false,
    provider: 'Zadarma',
    example: 'xxxxxxxxxxxxxxxx',
    description: 'Zadarma API User Key'
  },
  {
    name: 'ZADARMA_SECRET_KEY',
    required: false,
    provider: 'Zadarma',
    example: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    description: 'Zadarma API Secret Key'
  },
  
  // Development / Build
  {
    name: 'NODE_ENV',
    required: false,
    provider: 'System',
    example: 'development',
    description: 'Node environment (development, production, test)'
  }
];

interface ValidationResult {
  name: string;
  status: 'pass' | 'fail' | 'missing' | 'skip';
  message: string;
  provider: string;
}

async function testEnvironmentVariables(): Promise<void> {
  console.log("🔍 Validating Environment Variables\n");
  console.log("━".repeat(70));
  
  const results: ValidationResult[] = [];
  let criticalErrors = 0;
  
  // Group by provider
  const providers = [...new Set(ENV_VARIABLES.map(v => v.provider))];
  
  for (const provider of providers) {
    console.log(`\n📦 ${provider}`);
    
    const providerVars = ENV_VARIABLES.filter(v => v.provider === provider);
    
    for (const envVar of providerVars) {
      // Support both PUBLIC_ prefix (Qwik convention) and without prefix
      const value = process.env[envVar.name] || process.env[`PUBLIC_${envVar.name}`];
      const requiredLabel = envVar.required ? '(required)' : '(optional)';
      
      if (!value) {
        if (envVar.required) {
          results.push({
            name: envVar.name,
            status: 'missing',
            message: `Missing ${requiredLabel}`,
            provider
          });
          criticalErrors++;
          console.log(`   ❌ ${envVar.name} ${requiredLabel}`);
          console.log(`      💡 ${envVar.description}`);
          console.log(`      Example: ${envVar.example}`);
        } else {
          results.push({
            name: envVar.name,
            status: 'skip',
            message: `Not configured ${requiredLabel}`,
            provider
          });
          console.log(`   ⏭️  ${envVar.name} ${requiredLabel} - Not configured`);
        }
        continue;
      }
      
      // Validate format if validator exists
      if (envVar.validator) {
        if (envVar.validator(value)) {
          results.push({
            name: envVar.name,
            status: 'pass',
            message: 'Valid format',
            provider
          });
          console.log(`   ✅ ${envVar.name} ${requiredLabel}`);
        } else {
          results.push({
            name: envVar.name,
            status: 'fail',
            message: 'Invalid format',
            provider
          });
          if (envVar.required) criticalErrors++;
          console.log(`   ⚠️  ${envVar.name} ${requiredLabel} - Invalid format`);
          console.log(`      Expected format: ${envVar.example}`);
        }
      } else {
        results.push({
          name: envVar.name,
          status: 'pass',
          message: 'Present (format not validated)',
          provider
        });
        console.log(`   ✅ ${envVar.name} ${requiredLabel}`);
      }
    }
  }
  
  // ========================================
  // FINAL REPORT
  // ========================================
  console.log("\n" + "━".repeat(70));
  printSummary(results, criticalErrors);
  
  if (criticalErrors > 0) {
    console.log("\n❌ Critical environment variables missing or invalid\n");
    printHelp();
    process.exit(1);
  } else {
    console.log("\n✅ All required environment variables are present!\n");
    
    const optional = results.filter(r => r.status === 'skip').length;
    if (optional > 0) {
      console.log(`ℹ️  ${optional} optional variable(s) not configured (expected for current phase)\n`);
    }
  }
}

function printSummary(results: ValidationResult[], criticalErrors: number): void {
  console.log("\n📊 Summary:\n");
  
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const missing = results.filter(r => r.status === 'missing').length;
  const skipped = results.filter(r => r.status === 'skip').length;
  const total = results.length;
  
  console.log(`   ✅ Valid:     ${passed}/${total}`);
  console.log(`   ❌ Invalid:   ${failed}/${total}`);
  console.log(`   ❌ Missing:   ${missing}/${total}`);
  console.log(`   ⏭️  Optional:  ${skipped}/${total}`);
  console.log(`   🔴 Critical Errors: ${criticalErrors}`);
}

function printHelp(): void {
  console.log("\n📚 Help & Resources:\n");
  console.log("1. Create/update your .env file in the project root");
  console.log("");
  console.log("2. Copy required variables from .env.example (if exists)");
  console.log("");
  console.log("3. Get credentials from:");
  console.log("   • Supabase: https://supabase.com/dashboard → Project Settings → API");
  console.log("   • Google OAuth: https://console.cloud.google.com → APIs & Services → Credentials");
  console.log("   • GitHub OAuth: https://github.com/settings/developers");
  console.log("");
  console.log("4. Documentation:");
  console.log("   • context/THINK_QWIK/AUTH/OAUTH_SETUP.md");
  console.log("   • context/THINK_QWIK/AUTH/PROVIDERS/SUPABASE.md");
  console.log("");
  console.log("⚠️  NEVER commit .env to Git! Always use .env.local or .env");
  console.log("");
}

// Run the test
testEnvironmentVariables().catch((error) => {
  console.error("\n❌ Unexpected error:", error);
  process.exit(1);
});
