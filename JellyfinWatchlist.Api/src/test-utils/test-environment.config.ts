/**
 * Centralized test environment configuration
 * Sets up required environment variables for all test types
 */
export const setupTestEnvironment = (): void => {
  // Set required environment variables for CI/test environment
  process.env.CONFIG_PATH = process.env.CONFIG_PATH || './test-config';
  process.env.JELLYFIN_INSTANCE = process.env.JELLYFIN_INSTANCE || 'http://localhost:8096';
};

/**
 * Test environment constants
 */
export const TEST_ENVIRONMENT = {
  CONFIG_PATH: './test-config',
  JELLYFIN_INSTANCE: 'http://localhost:8096',
} as const;
