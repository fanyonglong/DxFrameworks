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
        plugins:[
            new CleanWebpackPlugin(['dist'],{
                root:resolve(),
                verbose:false
            }),
            new HtmlWebpackPlugin({
              title: 'Development',
              template:resolve('example/index.html'),
              filename:'index.html'
            })
        ],
        /**
         * 注意不同devtool设置的性能差异。

"eval" 具有最佳性能，但不协助您编译代码。
该cheap-source-map变种是更好的性能，如果你能略差映射品质生活。
eval-source-map为增量构建使用变体。
=>在大多数情况下cheap-module-eval-source-map是最好的选择。
        */
        devtool:'cheap-module-eval-source-map',
        devServer: {
             contentBase: resolve('dist'),
             compress: true, // 一切服务都启用gzip 压缩：
             historyApiFallback: true, // 当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html。通过传入以下启用：
             hot: true, // 启用 webpack 的模块热替换特性：
             https: false, // 默认情况下，dev-server 通过 HTTP 提供服务。也可以选择带有 HTTPS 的 HTTP/2 提供服务：
             noInfo: true, //启用 noInfo 后，诸如「启动时和每次保存之后，那些显示的 webpack 包(bundle)信息」的消息将被隐藏。错误和警告仍然会显示。
             open:'chrome', //当open启用时，开发服务器将打开浏览器。
             index:'index.html',
             progress:true, //将运行进度输出到控制台。
            // openPage:null //指定打开浏览器时导航到的页面。
             quiet: false,//启用quiet后，除了初始启动信息之外的任何内容都不会被打印到控制台。这也意味着来自的WebPack的错误或警告在控制台不可见。
        }
    });
    return webpackConfig;
}



/**
 * 
 简写含义
-d
--debug --devtool cheap-module-eval-source-map --output-pathinfo
-p
--optimize-minimize --define process.env.NODE_ENV="production", see building for production

 * 
 * 
yargs.options({
  bonjour: {
    type: 'boolean',
    describe: 'Broadcasts the server via ZeroConf networking on start'
  },
  lazy: {
    type: 'boolean',
    describe: 'Lazy'
  },
  inline: {
    type: 'boolean',
    default: true,
    describe: 'Inline mode (set to false to disable including client scripts like livereload)'
  },
  progress: {
    type: 'boolean',
    describe: 'Print compilation progress in percentage',
    group: BASIC_GROUP
  },
  'hot-only': {
    type: 'boolean',
    describe: 'Do not refresh page if HMR fails',
    group: ADVANCED_GROUP
  },
  stdin: {
    type: 'boolean',
    describe: 'close when stdin ends'
  },
  open: {
    type: 'string',
    describe: 'Open the default browser, or optionally specify a browser name'
  },
  useLocalIp: {
    type: 'boolean',
    describe: 'Open default browser with local IP'
  },
  'open-page': {
    type: 'string',
    describe: 'Open default browser with the specified page',
    requiresArg: true
  },
  color: {
    type: 'boolean',
    alias: 'colors',
    default: function supportsColor() {
      return require('supports-color');
    },
    group: DISPLAY_GROUP,
    describe: 'Enables/Disables colors on the console'
  },
  info: {
    type: 'boolean',
    group: DISPLAY_GROUP,
    default: true,
    describe: 'Info'
  },
  quiet: {
    type: 'boolean',
    group: DISPLAY_GROUP,
    describe: 'Quiet'
  },
  'client-log-level': {
    type: 'string',
    group: DISPLAY_GROUP,
    default: 'info',
    describe: 'Log level in the browser (info, warning, error or none)'
  },
  https: {
    type: 'boolean',
    group: SSL_GROUP,
    describe: 'HTTPS'
  },
  key: {
    type: 'string',
    describe: 'Path to a SSL key.',
    group: SSL_GROUP
  },
  cert: {
    type: 'string',
    describe: 'Path to a SSL certificate.',
    group: SSL_GROUP
  },
  cacert: {
    type: 'string',
    describe: 'Path to a SSL CA certificate.',
    group: SSL_GROUP
  },
  pfx: {
    type: 'string',
    describe: 'Path to a SSL pfx file.',
    group: SSL_GROUP
  },
  'pfx-passphrase': {
    type: 'string',
    describe: 'Passphrase for pfx file.',
    group: SSL_GROUP
  },
  'content-base': {
    type: 'string',
    describe: 'A directory or URL to serve HTML content from.',
    group: RESPONSE_GROUP
  },
  'watch-content-base': {
    type: 'boolean',
    describe: 'Enable live-reloading of the content-base.',
    group: RESPONSE_GROUP
  },
  'history-api-fallback': {
    type: 'boolean',
    describe: 'Fallback to /index.html for Single Page Applications.',
    group: RESPONSE_GROUP
  },
  compress: {
    type: 'boolean',
    describe: 'Enable gzip compression',
    group: RESPONSE_GROUP
  },
  port: {
    describe: 'The port',
    group: CONNECTION_GROUP
  },
  'disable-host-check': {
    type: 'boolean',
    describe: 'Will not check the host',
    group: CONNECTION_GROUP
  },
  socket: {
    type: 'String',
    describe: 'Socket to listen',
    group: CONNECTION_GROUP
  },
  public: {
    type: 'string',
    describe: 'The public hostname/ip address of the server',
    group: CONNECTION_GROUP
  },
  host: {
    type: 'string',
    default: 'localhost',
    describe: 'The hostname/ip address the server will bind to',
    group: CONNECTION_GROUP
  },
  'allowed-hosts': {
    type: 'string',
    describe: 'A comma-delimited string of hosts that are allowed to access the dev server',
    group: CONNECTION_GROUP
  }
});

*/