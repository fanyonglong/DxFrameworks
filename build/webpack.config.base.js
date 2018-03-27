const path = require('path');
const {resolve}=require('../config/util');
module.exports = {
  entry:resolve('src/index.js'),
  output: {
    filename: '[name].js',
    path: resolve('dist')
  },
  module: {
    rules: [
      {
        test:/\.tsx?$/,
        use:['ts-laoder'],
        exclude: /node_modules/
      },{
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      },
       {
          test: /\.(png|svg|jpg|gif)$/,
          use: [{
              loader:'url-loader',
              options:{
                  limit: 8192,
                  fallback:'file-loader'
              }
          },{
            loader:'image-webpack-loader',
            options:{
                bypassOnDebug:true
            }

          }]
        },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins:[],
  resolve: {
    extensions: [ '.tsx', '.ts', '.js']
  }
};