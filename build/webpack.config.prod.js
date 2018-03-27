const path=require('path');
const webpack=require('webpack');
const merge=require('webpack-merge');
const baseConfig=require('./webpack.config.base');
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
        mode:'development',//
        devtool: 'inline-source-map',
        plugns:[
            new CleanWebpackPlugin(['dist']),
            new HtmlWebpackPlugin({
              title: 'Development',
              filename:'index.html'
            })
        ],
        devServer: {
             contentBase: resolve('dist')
        }
    });
    return webpackConfig;
}