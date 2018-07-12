// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
const path=require('path');
module.exports = {
  coverageDirectory: "coverage",
 verbose:true,
  globals: {
    "ts-jest": {
      "tsConfigFile": path.resolve('tsconfig.json')
    }
  },
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],
  //rootDir:process.cwd(),
  rootDir:__dirname,
  roots: [
    "<rootDir>"
  ],
  testMatch: [
    "**/__test__/*.@(js|jsx)"
  ],
  //testRegex: '/jest/.*\\.tsx?$',
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  collectCoverage :false,
  collectCoverageFrom: ['tests/**/*.ts']
  // timers: 'fake',
};
