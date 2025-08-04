// Jest setup file
import '@testing-library/jest-dom';

// Mock fetch for tests
global.fetch = jest.fn();

// Clean up after each test
afterEach(() => {
    jest.clearAllMocks();
});
