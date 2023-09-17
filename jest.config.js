module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./jest.setup.js"],
  workerThreads: true, // to handle bigint
  "modulePathIgnorePatterns": ["dist"],
  collectCoverageFrom: [
    './src/*.ts',
    '!**/node_modules/**',
    '!./src/__utils/**',
    '!./src/index.ts',
    '!./src/types.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};
