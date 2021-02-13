module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  "testMatch": [
    "**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  "transformIgnorePatterns": [
    "/node_modules/(?!entity-decode).+\\.js$"
  ],
}
