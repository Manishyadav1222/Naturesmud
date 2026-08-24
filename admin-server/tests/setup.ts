// Test setup file
import { config } from 'dotenv';

config({ path: '.env.test' });

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    if (args[0]?.includes?.('Invalid environment variables')) return;
    originalConsoleError.apply(console, args);
  };
  console.warn = (...args) => {
    if (args[0]?.includes?.('CORS rejected origin')) return;
    originalConsoleWarn.apply(console, args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test timeout
jest.setTimeout(10000);