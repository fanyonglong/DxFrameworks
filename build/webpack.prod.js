const path=require('path');
const webpack=require('webpack');
const merge=require('webpack-merge');
const baseConfig=require('./webpack.common');
const CleanWebpackPlugin=require('clean-webpack-plugin');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const config=require('../config');
const {resolve}=require('../config/util');

/**
 * 
module.exports = {
+  mode: 'production',
-  plugins: [
-    new UglifyJsPlugin(/* ... *\/),
-    new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("production") }),
-    new webpack.optimize.ModuleConcatenationPlugin(),
-    new webpack.NoEmitOnErrorsPlugin()
-  ]
}
*/
module.exports=(env, argv)=>{
    let webpackConfig=merge(baseConfig,{
        mode:'production',//
        devtool: 'inline-source-map',
        plugins:[
            new CleanWebpackPlugin(['dist'],{
                root:resolve()
            })
        ]
    });
    return webpackConfig;
}