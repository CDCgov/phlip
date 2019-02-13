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
  collectCoverageFrom: [
    'src/**/*.{js,jsx}'
  ],
  coverageReporters: [
    'cobertura',
    'html',
    'lcov'
  ],
  testMatch: [
    '**/__tests__/*.js'
  ],
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