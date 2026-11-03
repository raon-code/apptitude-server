module.exports = {
  verbose: true,
  maxWorkers: 1,
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  moduleNameMapper: {
    // '@' : 루트 디렉토리
    '^@/(.*)$': '<rootDir>/$1'
  }
};
