// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node', // Change from 'jsdom' to 'node'
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};