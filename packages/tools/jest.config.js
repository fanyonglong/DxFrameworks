// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html
const path=require('path');

module.exports={
   rootDir:__dirname,
   collectCoverage :true,// 收集测试信息
   collectCoverageFrom:['**/__test__/*.js'],
  // testPathIgnorePatterns:["/node_modules/"],
   //transformIgnorePatterns::'',//['<rootDir>/node_modules/'],
   modulePaths:['<rootDir>/src/'],
   testMatch: [
     "**/__test__/unit/*.@(js|jsx)"
   ],
   transform: {
   // "^.+\\.jsx?$":'babel-jest'
    "^.+\\.jsx?$":path.resolve(__dirname,'./config/jest/transformer.js')
      //  "^.+\\.jsx?$":'babel-jest'//path.resolve(process.cwd(),'node_modules/babel-jest/build')  // "babel-jest"
   },
   /** 
    * 在转换之前与所有源文件路径匹配的正则表达式模式字符串数组。如果测试路径与任何模式匹配，则不会进行转换。
      这些模式字符串与完整路径匹配。使用<rootDir>字符串标记包含项目根目录的路径，以防止它意外忽略可能具有不同根目录的不同环境中的所有文件。
    示例：["<rootDir>/bower_components/", "<rootDir>/node_modules/"]。
     有时它会发生（特别是在React Native或TypeScript项目中）第三方模块作为未传输发布。由于node_modules默认情况下不会转换内部的所有文件，因此Jest将无法理解这些模块中的代码，从而导致语法错误。为了克服这个问题，您可以使用transformIgnorePatterns白名单这些模块。您可以在React Native Guide中找到这个用例的一个很好的例子。

unmockedModule
   */
 //  transformIgnorePatterns:["/<rootDir>/node_modules/"]
 //  moduleNameMapper:''

}

// module.exports = {
//   coverageDirectory: "coverage",
//   verbose:true,
//   globals: {
//     "ts-jest": {
//       "tsConfigFile": path.resolve('tsconfig.json')
//     }
//   },
//   modulePaths:['<rootDir>'],
// //   moduleNameMapper: {
// //     "^image![a-zA-Z0-9$_-]+$": "GlobalImageStub",
// //     "^[./a-zA-Z0-9$_-]+\\.png$": "<rootDir>/RelativeImageStub.js",
// //     "module_name_(.*)": "<rootDir>/substituted_module_$1.js"
// //   },
//   moduleFileExtensions: [
//     "ts",
//     "tsx",
//     "js"
//   ],
//   //rootDir:process.cwd(),
//   rootDir:__dirname,
//   roots: [
//     "<rootDir>"
//   ],
//   //（默认值：[ "**/__tests__/**/*.js?(x)", "**/?(*.)+(spec|test).js?(x)" ]）
//   testMatch: [
//     "**/__test__/unit/*.@(js|jsx)"
//   ],
//   //testRegex: '/jest/.*\\.tsx?$',
// //   transform: {
// //     "^.+\\.(ts|tsx)$": "ts-jest"
// //   },
//   collectCoverage :false,
//   collectCoverageFrom: ['tests/**/*.ts']
//   // timers: 'fake',
// };
// 'use strict';

// module.exports = {
//   collectCoverageFrom: [
//     '**/packages/*/**/*.js',
//     '!**/bin/**',
//     '!**/cli/**',
//     '!**/perf/**',
//     '!**/__mocks__/**',
//     '!**/__tests__/**',
//     '!**/build/**',
//     '!**/vendor/**',
//     '!e2e/**',
//   ],
//   modulePathIgnorePatterns: [
//     'examples/.*',
//     'packages/.*/build',
//     'packages/.*/build-es5',
//     'packages/jest-runtime/src/__tests__/test_root.*',
//     'website/.*',
//     'e2e/runtime-internal-module-registry/__mocks__',
//   ],
//   projects: ['<rootDir>', '<rootDir>/examples/*/'],
//   setupFilesAfterEnv: ['<rootDir>/testSetupFile.js'],
//   snapshotSerializers: [
//     '<rootDir>/packages/pretty-format/build/plugins/ConvertAnsi.js',
//   ],
//   testEnvironment: './packages/jest-environment-node',
//   testPathIgnorePatterns: [
//     '/node_modules/',
//     '/examples/',
//     '/e2e/.*/__tests__',
//     '\\.snap$',
//     '/packages/.*/build',
//     '/packages/.*/build-es5',
//     '/packages/.*/src/__tests__/getPrettyPrint.js',
//     '/packages/jest-cli/src/__tests__/test_root',
//     '/packages/jest-cli/src/__tests__/__fixtures__/',
//     '/packages/jest-cli/src/lib/__tests__/fixtures/',
//     '/packages/jest-haste-map/src/__tests__/haste_impl.js',
//     '/packages/jest-haste-map/src/__tests__/dependencyExtractor.js',
//     '/packages/jest-resolve-dependencies/src/__tests__/__fixtures__/',
//     '/packages/jest-runtime/src/__tests__/defaultResolver.js',
//     '/packages/jest-runtime/src/__tests__/module_dir/',
//     '/packages/jest-runtime/src/__tests__/NODE_PATH_dir',
//     '/packages/jest-snapshot/src/__tests__/plugins',
//     '/packages/jest-snapshot/src/__tests__/fixtures/',
//     '/packages/jest-validate/src/__tests__/fixtures/',
//     '/packages/jest-worker/src/__performance_tests__',
//     '/packages/pretty-format/perf/test.js',
//     '/e2e/__tests__/iterator-to-null-test.js',
//   ],
//   transform: {
//     '^.+\\.js$': '<rootDir>/packages/babel-jest',
//   },
// };