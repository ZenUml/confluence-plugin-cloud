module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  "testMatch": [
    "**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  "transformIgnorePatterns": [
    // see https://github.com/facebook/jest/issues/12036#issuecomment-981769870
    "/node_modules/(?!d3|d3-array|internmap|delaunator|robust-predicates)"
  ],
  moduleNameMapper: {
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js"
  }
}
