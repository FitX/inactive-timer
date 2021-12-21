module.exports = {
  moduleFileExtensions: [
    'js',
    'mjs',
  ], /*
  transform: {
    '^.+\\.mjs$': 'babel-jest'
  }, */
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    '^.+\\.mjs$': 'babel-jest'
  },
  testPathIgnorePatterns: [
    '/node_modules/',
  ],
  collectCoverage: true,
  setupFilesAfterEnv: ['./setupTests.js'],
}
