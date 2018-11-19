var path=require('path');
var root=path.resolve(__dirname,'../../');
var configPath=path.resolve(root,'babel.config.js');
const config=require('../../babel.config')
config.include=undefined;
config.presets[0][1].modules="commonjs"
config.plugins.unshift('@babel/plugin-syntax-dynamic-import')
 module.exports = require('babel-jest').createTransformer({babelrc:false,...config});

// module.exports = require('babel-jest').createTransformer({
//     //babelrc:true,
//    // configFile:configPath
//     babelrc: false,
//     presets: [
//         [
//             '@babel/preset-env',
//             {
//                 loose: true,
//                 debug: false,
//                 modules: 'commonjs',
//                 targets: {
//                     browsers:'last 3 versions'
//                 }
//             },
//         ]
//     ],
//     plugins: [
//         '@babel/plugin-syntax-dynamic-import',
//         '@babel/plugin-proposal-class-properties'
//     ]
// });