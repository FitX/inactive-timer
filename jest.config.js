module.exports = {
  moduleFileExtensions: [
    'js',
    'mjs',
  ], /*
  transform: {
    '^.+\\.mjs$': 'babel-jest'
  }, */
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
