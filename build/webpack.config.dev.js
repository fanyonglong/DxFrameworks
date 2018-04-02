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
+ mode: 'development'
- plugins: [
-   new webpack.NamedModulesPlugin(),
-   new webpack.DefinePlugin({ "process.env.NODE_ENV": JSON.stringify("development") }),
- ]
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
              template:'',
              filename:'index.html'
            })
        ],
        devServer: {
             contentBase: resolve('dist')
        }
    });
    return webpackConfig;
}