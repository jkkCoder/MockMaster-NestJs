#!/usr/bin/env node

/**
 * Environment Configuration Validator
 * 
 * This script validates all environment variables against their zod schemas.
 * Run this in CI/CD pipelines and before application startup.
 * 
 * Usage: npm run env:validate
 */

import { loadEnvironmentConfig } from './index';

try {
  const config = loadEnvironmentConfig();
  console.log('✅ Environment configuration is valid!');
  console.log('\nLoaded configuration:');
  console.log(JSON.stringify(config, null, 2));
  process.exit(0);
} catch (error) {
  console.error('❌ Environment configuration validation failed:');
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exit(1);
}

