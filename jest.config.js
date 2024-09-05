// jest.config.js

module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  moduleNameMapper: {
    '^@packages/(.*)$': '<rootDir>/packages/$1',
  },
};
