import type { Config } from 'jest';

const config: Config = {
  displayName: 'integration',
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/src/**/__tests__/**/*.integration.spec.ts'],
  collectCoverageFrom: [
    'src/infrastructure/**/*.(t|j)s',
    'src/interface/**/*.(t|j)s',
    '!src/**/*.spec.ts',
    '!src/**/__tests__/**',
  ],
  setupFilesAfterEnv: ['<rootDir>/test/setup-integration.ts'],
  moduleNameMapper: {
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@application/(.*)$': '<rootDir>/src/application/$1',
    '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
    '^@interface/(.*)$': '<rootDir>/src/interface/$1',
  },
  testTimeout: 60000,
};

export default config;

