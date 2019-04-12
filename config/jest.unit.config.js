/**
 * Configuration for Unit tests Jest
 */
module.exports = {
  rootDir: '../',
  setupFiles: [
    'raf/polyfill',
    '<rootDir>/config/tests/setupFiles.js',
    '<rootDir>/config/tests/sessionStorageMock.js',
    'jest-canvas-mock'
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}'
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: [
    'cobertura',
    'html',
    'lcov'
  ],
  testRegex: '\/__tests__\/.+[^e2e]\.test\.js$',
  modulePaths: [
    '<rootDir>/src/'
  ],
  moduleNameMapper: {
    '^.+\\.(css|scss)$': '<rootDir>/config/tests/styleMock.js',
    '\\.worker.js': '<rootDir>/config/tests/workerMock.js'
  },
  snapshotSerializers: [
    'enzyme-to-json/serializer'
  ],
  globals: {
    'APP_API_URL': '/api',
    'APP_IS_SAML_ENABLED': '0',
    'APP_DOC_MANAGE_API': '/docsApi',
    'APP_LOG_REQUESTS': '0'
  }
}
