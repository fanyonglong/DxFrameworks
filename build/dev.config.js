var yargs=require('yargs')
var argv=yargs.options({
    mode:{
        alias:"m",
        default:"development",
        choices:['development','production','none'],
        desc:'编译模式'
    },
    host:{
        type:"string",
        default:"localhost"
    },
    port:{
        type:'number',
        default:9000,
        desc:"开发环境服务器端号"
    },
    build:{
        type:"boolean",
        default:false
    },
    minimizer:{
        type:"string",
        default:"terserjs",
        choices:['uglifyjs','terserjs'],
        desc:"压缩类型"
    },
    styleLoader:{
        type:"boolean",
        default:false
    },
    optimizeCss:{
        type:"boolean",
        default:false
    },
    dll:{
        type:"boolean",
        default:false
    }
}).argv;
const isWsl = require('is-wsl');
const webpack=require('webpack');
const WebpackDevServer=require('webpack-dev-server');
const chainConfig=require('webpack-chain');
const {resolve,join}=require('path');
const signale=require('signale');
const chalk=require('chalk');
const open=require('open');
const url=require('url');
const loaderUtils=require('loader-utils');
const fs=require('fs');
// 默认配置
const PORT=argv.port;
const HOST=argv.host;
const env=argv.mode;

const MODE={
    none:"none",
    development:"development",
    production:"production"
}
process.env.NODE_ENV=env;
const isBuild=argv.build;
const isEnvDevelopment = env === MODE.development;
const isEnvProduction = env === MODE.production;
let devtool=isEnvDevelopment?'cheap-module-source-map':false;
const root=resolve(__dirname);
const appSrc=join(root,'./src');
const appOutPath=join(root,'./dist');
var config=new chainConfig();

/** templateNamePath
模板	    描述
[hash]      模块标识符(module identifier)的 hash
[chunkhash] chunk 内容的 hash
[name]      模块名称
[id]        模块标识符(module identifier)
[query]     模块的 query，例如，文件名 ? 后面的字符串
[function]  The function, which can return filename [string]
[hash] 和 [chunkhash] 的长度可以使用 [hash:16]（默认为20）来指定。或者，通过指定output.hashDigestLength 在全局配置长度。
如果将这个选项设为一个函数，函数将返回一个包含上面表格中替换信息的对象。
在使用 ExtractTextWebpackPlugin 时，可以用 [contenthash] 来获取提取文件的 hash（既不是 [hash] 也不是 [chunkhash]）。
*/


config
.mode(env)
.context(root)
.devtool(devtool);

// entry
//config.entry('react').add('react').add('react-dom');
 config.entry('global').add('./src/global.js'); 
 config.entry('d3').add('d3');
 config.entry('index').add('./src/app.js');
// config.entry('pageA').add('./src/tests/pageA.js');
// config.entry('pageB').add('./src/tests/pageB.js');
// config.entry('pageC').add('./src/tests/pageC.js')

if(!isBuild){
    config.entry('webpackHotDevClient').prepend(require.resolve('react-dev-utils/webpackHotDevClient'));
}
//output
config.output.path(appOutPath);
config.output.filename('[name].[hash].js');
config.output.chunkFilename('[name].chunk.js');
config.output.publicPath('/');
config.output.when(isBuild,(output)=>{
    output.pathinfo(false);
},(output)=>{
    output.pathinfo(true);
});

//module
//config.module.set('strictExportPresence',true);
//babe-loader
/** 
 * npm install -D babel-loader @babel/core @babel/preset-env
*/
config.module.rule('babel').test(/\.js$/).include.add(appSrc).end().exclude.add(/(node_modules|bower_components)/).end().use('babel').loader("babel-loader").options({
    configFile:false,
    babelrc:false,
    plugins:['dynamic-import-node'],
   // plugins:['syntax-dynamic-import'],//dynamic-import-node
    presets:[['@babel/preset-env',{
        targets:{
            ie:'10'
        },
        loose:false
    }],["@babel/preset-react",
    {
      "pragma": "React.createElement", // default pragma is React.createElement
      "pragmaFrag": "React.Fragment", // default is React.Fragment
      "throwIfNamespace": false // defaults to true
    }]]
})

// css-loader
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const cssModules={
    localIdentName: '[path][name]__[local]--[hash:base64:5]',
    context: appSrc,
    hashPrefix: 'my-custom-hash',
};
/** 
    "style-loader", // 将 JS 字符串生成为 style 节点
    "css-loader", // 将 CSS 转化成 CommonJS 模块
    "sass-loader" // 将 Sass 编译成 CSS，默认使用 Node Sass 
*/
function createCssRule(name,test,{modules=false,exclude}){
    let rule=config.module.rule(name).test(test).include.add(appSrc).end();
    let sourceMap=false;
    //npm install style-loader css-loader --save-dev
    function cssLoader(){
        if(!argv.styleLoader){
             //npm install --save-dev mini-css-extract-plugin
            rule.use('mini-css-extract-plugin').loader(MiniCssExtractPlugin.loader).options({
                //publicPath:"/",
                hmr: !isBuild,
            });
        }else{
            rule.use('style').loader('style-loader').options({
                convertToAbsoluteUrls:true
            });
        }
        rule.use('css').loader('css-loader').options({
            modules:modules?cssModules:false,
            sourceMap:sourceMap
        });
        if(modules&&exclude!==void 0){
            rule.exclude.add(exclude);
        }
    }
    //npm i -D postcss-loader
    //npm install -D postcss-preset-env
    function postcssLoader(){
        rule.use('postcss').loader('postcss-loader').options({
            plugins: (loader) => [
                require('postcss-preset-env')()
             ]
        })
    }
    //npm install less-loader --save-dev
    function lessLoader(){
         rule.use('less').loader('less-loader').options({
            sourceMap:sourceMap,
         //   javascriptEnabled:true
        })
    }
   //npm install sass-loader node-sass --save-dev
    function sassLoader(){
        rule.use('sass').loader('sass-loader').options({
            sourceMap:sourceMap,
            outputStyle:'expanded'
        })
    }
   
    cssLoader();
    postcssLoader();
    switch(name){
        case "less":
            lessLoader();
            break;
        case "sass":
            sassLoader();
            break;
    }
    return rule;
}
if(!argv.styleLoader){
    config.plugin('mini-css-extract-plugin').use(MiniCssExtractPlugin,[{
        filename: "static/css/[name].[contenthash:8].css",//contenthash id
        chunkFilename: "static/css/[name].[contenthash:8].chuck.css",
        // moduleFilename(ops){
        //     console.log(ops)
        //     return ops.name;
        // }
    }]);
}
// /\b((?!module)\w)+\.css$/
createCssRule('css',/\.css$/,{exclude:/\.module\.css$/});
createCssRule('less',/\.less$/,{exclude:/\.module\.less$/});
createCssRule('sass',/\.s(a|c)ss$/,{exclude:/\.module\.s(a|c)ss$/});
// module
createCssRule('css-module',/\.module\.css$/,{modules:true});
createCssRule('less-module',/\.module\.less$/,{modules:true});
createCssRule('sass-module',/\.module\.s(a|c)ss$/,{modules:true});

// image file 
config.module.rule('image').test(/\.(png|jpg|gif|svg|jpeg)$/).use('url-loader').loader('url-loader').options({
    limit:Math.pow(1024,1)*10,
    fallback:'file-loader',
    name:'[path][name].[ext]'
})
// font file
config.module.rule('font').test( /\.(woff|woff2|eot|ttf|otf)$/).use('font-loader').loader('file-loader').options({
  //  outputPath:"assets",
    name:'[path][name].[ext]'
})

//externals 从外部引用
config.externals({
  //  'react':"React",
   // 'react-dom':"ReactDOM"
})
//resolve
//此Webpack插件可确保来自应用程序源目录的相对导入不会到达其外部。
var ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

config.resolve.alias.set('@',appSrc).set('assets',join(root,'assets'));
config.resolve.modules.add(resolve(root, 'assets')).add('node_modules');
config.resolve.extensions.add('.js').add('.json').add('.mjs').add('.wasm');
// mainFields: ['browser', 'module', 'main']
config.resolve.mainFields.add('main').add('browser').add('module');
config.resolve.plugin('ModuleScopePlugin').use(new ModuleScopePlugin([appSrc,join(root,'assets')],join(root,'package.json')))

// plugins
const CopyPlugin = require('copy-webpack-plugin');// 复制
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin=require('webpack-manifest-plugin');// 创建资产清单

// 设置html 环境变量 
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const InlineChunkHtmlPlugin=require('react-dev-utils/InlineChunkHtmlPlugin');
// 自动安装所需 
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
// 强制模块路径大小写匹配
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');


config.plugin('clean').use(CleanWebpackPlugin,[{
    cleanOnceBeforeBuildPatterns:['**/*'] // 相对 output.path
}])
config.plugin('html').use(HtmlWebpackPlugin,[Object.assign({
    title:"dx react",
    template:join(appSrc,'index.html')
},isEnvProduction?{
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true,
    },
  }:undefined)]);
  // html env
  config.plugin('InlineChunkHtmlPlugin').use(new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/runtime~.+[.]js/]),)
  config.plugin('InterpolateHtmlPlugin').use(new InterpolateHtmlPlugin(HtmlWebpackPlugin,{
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  }))

// 热替换
if(!isBuild){
    config.plugin('CaseSensitivePathsPlugin').use(new CaseSensitivePathsPlugin());
    config.plugin('WatchMissingNodeModulesPlugin').use(new WatchMissingNodeModulesPlugin(join('node_modules')))
    config.plugin('hot-replace').use(new webpack.HotModuleReplacementPlugin());
    config.plugin('NamedModulesPlugin').use(new webpack.NamedModulesPlugin())
}
 config.plugin('define').use(new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.DEBUG': JSON.stringify(process.env.DEBUG)
  }));
  config.plugin('process').use(new webpack.ProgressPlugin((percentage, message, ...args)=>{

  }))
  config.plugin('manifest').use(new ManifestPlugin({
        fileName: 'asset-manifest.json',
        publicPath: config.output.get('publicPath'),
        generate: (seed, files) => {
          const manifestFiles = files.reduce(function(manifest, file) {
            manifest[file.name] = file.path;
            return manifest;
          }, seed);
          return {
            files: manifestFiles,
          };
        }
  }));
  
  if(argv.dll){
      
      createDLL();
      useDll();
  }
 function useDll(){
    if(!fs.existsSync(resolve(root,'dll/manifest.json'))){
        return;
    }
    signale.log('use dll')
    config.plugin('DllReferencePlugin').use(new webpack.DllReferencePlugin({
        context: resolve(root,'dll'),
        manifest: require('./dll/manifest.json'),
       //  name: './my-dll.js',
        // scope: 'xyz',
        // sourceType: 'commonjs2'
    }))
 }
  
  function createDLL(){
       if(fs.existsSync(resolve(root,'dll/manifest.json'))){
           return;
       }
      let files=['react','react-dom','d3','lodash'];
      let dllWebpack=webpack({
        context:root,
         entry:{
             dx:files
         },
           output: {
            path:resolve(root,'dll'),
            filename: '[name].dll.js',
            library: '[name]',
           // libraryTarget:"ejs"
          },
          plugins:[    
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: [resolve(root,'dll/**/*')],
            }),      
            new  webpack.DllPlugin({
                name:"[name]",
                path:resolve(root,'dll/manifest.json')
            })
          ]
      });
      dllWebpack.run((err)=>{
        if(err){
            console.log('dll编译失败 ')
            return;
        }
        console.log('dll编译成功')
      });
  }




//optimization
// 为每个入口增加一个单独文件
config.optimization.runtimeChunk("single");
config.optimization.splitChunks({
   /* chunks: "async", // 必须三选一： "initial" | "all"(推荐) | "async" (默认就是async)
    minSize: 30000, // 最小尺寸，默认:30000
    minChunks: 1, // entry入口文件引用次数 chunk ，默认1
    maxAsyncRequests: 5, // 最大异步请求数， 默认5
    maxInitialRequests : 3, // 最大初始化请求书，默认3
    automaticNameDelimiter: '~',// 打包分隔符
    name: function(){}, // 打包后的名称，此选项可接收 function
    cacheGroups:{ // 这里开始设置缓存的 chunks
        priority: 0, // 缓存组优先级
        vendor: { // key 为entry中定义的 入口名称
            chunks: "initial", // 必须三选一： "initial" | "all" | "async"(默认就是async) 
            test: /react|lodash/, // 正则规则验证，如果符合就提取 chunk
            name: "vendor", // 要缓存的 分隔出来的 chunk 名称 
            minSize: 30000,
            minChunks: 1, 
            enforce: true,
            priority:0,
            maxAsyncRequests: 5, // 最大异步请求数， 默认1
            maxInitialRequests : 3, // 最大初始化请求书，默认1
            reuseExistingChunk: true // 可设置是否重用该chunk
        }
    }*/
    //chunks:"all",//有效值为all，async和initial
    // automaticNameDelimiter:"~",
    // maxInitialRequests:1,//入口点处的最大并行请求数。
    // maxAsyncRequests:1,// 按需加载时的最大并行请求数。
    // minSize:0,//要生成的块的最小大小（以字节为单位）。
    // maxSize:0,// 块被分割最大文件大小
     // name:'runtime' ,//boolean: true | function (module, chunks, cacheGroupKey) | string
    // minChunks:1,//分割前必须共享模块的最小块数。
    /** 
     * 缓存组可以继承和/或覆盖任何选项splitChunks.*; 
     * 但是test，priority并且reuseExistingChunk只能在高速缓存组级别配置。
     * 要禁用任何默认缓存组，请将其设置为false
    */
   cacheGroups:{
     commonsSync: {
        name: 'commonsSync',
        chunks: 'initial',
        minChunks: 2,
        minSize: 0,
     },
     commons: {
        name: 'commons',
        //chunks: 'async',
        minChunks: 2,
        minSize: 0,
     },
    vendors:{
        chunks:'all',
        test:/\/node_modules\//, 
        priority:2,
       // maxInitialRequests:2,
        minSize:0,
      //  maxSize:80000,
        name:'vendors',
        minChunks:2,
        //filename:'sync.[id].js'
       // filename:sync.[name].js'
     },
     react: {
        priority:3,
        test: /\/node_modules\/(react|react-dom)\//,
        name: 'react', // 固定名
       // filename:"[name].js",// 动态名
        chunks: 'all',
        /**讲述的WebPack忽略
         * splitChunks.minSize，splitChunks.minChunks，
         * splitChunks.maxAsyncRequests和splitChunks.maxInitialRequests选项，只为这个高速缓存组创建块。 */
        enforce:true
     }
   }
});
const TerserPlugin =require('terser-webpack-plugin');
const UglifyPlugin =require('uglifyjs-webpack-plugin');
// 优化css 减少重复 
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');

// npm i -D terser-webpack-plugin uglifyjs-webpack-plugin
if(isBuild){
    config.optimization.minimize(isEnvProduction).when(argv.minimizer=='uglifyjs',(optimization)=>{
       optimization.minimizer(argv.minimizer).use(UglifyPlugin,[{
                 uglifyOptions: {                 
                    warnings: false,
                    parse: {},
                    compress: {},
                    mangle: true, // Note `mangle.properties` is `false` by default.
                    output: null,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_fnames: false,
                 },
                  sourceMap: false,
                  cache: true,
                  parallel: true,
            }])
    },(optimization)=>{
        optimization.minimizer(argv.minimizer).use(TerserPlugin,[{
            terserOptions: {
                parse: {
                  // we want terser to parse ecma 8 code. However, we don't want it
                  // to apply any minfication steps that turns valid ecma 5 code
                  // into invalid ecma 5 code. This is why the 'compress' and 'output'
                  // sections only apply transformations that are ecma 5 safe
                  // https://github.com/facebook/create-react-app/pull/4234
                  ecma: 8,
                },
                compress: {
                  ecma: 5,
                  warnings: false,
                  // Disabled because of an issue with Uglify breaking seemingly valid code:
                  // https://github.com/facebook/create-react-app/issues/2376
                  // Pending further investigation:
                  // https://github.com/mishoo/UglifyJS2/issues/2011
                  comparisons: false,
                  // Disabled because of an issue with Terser breaking valid code:
                  // https://github.com/facebook/create-react-app/issues/5250
                  // Pending futher investigation:
                  // https://github.com/terser-js/terser/issues/120
                  inline: 2,
                },
                mangle: {
                  safari10: true,
                },
                output: {
                  ecma: 5,
                  comments: false,
                  // Turned on because emoji and regex is not minified properly using default
                  // https://github.com/facebook/create-react-app/issues/2488
                  ascii_only: true,
                },
              },
              // Use multi-process parallel running to improve the build speed
              // Default number of concurrent runs: os.cpus().length - 1
              // Disabled on WSL (Windows Subsystem for Linux) due to an issue with Terser
              // https://github.com/webpack-contrib/terser-webpack-plugin/issues/21
              parallel: !isWsl,
              // Enable file caching
              cache: true,
              sourceMap: isEnvProduction,
              
        },new OptimizeCssAssetsPlugin({
            cssProcessorOptions: {
                parser: safePostCssParser,
                map: isEnvDevelopment
              }
          })])
    });
    
    
}

//stats
 /* // 未定义选项时，stats 选项的备用值(fallback value)（优先级高于 webpack 本地默认值）
    all: undefined,

    // 添加资源信息
    assets: true,

    // 对资源按指定的字段进行排序
    // 你可以使用 `!field` 来反转排序。
    // Some possible values: 'id' (default), 'name', 'size', 'chunks', 'failed', 'issuer'
    // For a complete list of fields see the bottom of the page
    assetsSort: "field",

    // 添加构建日期和构建时间信息
    builtAt: true,

    // 添加缓存（但未构建）模块的信息
    cached: true,

    // 显示缓存的资源（将其设置为 `false` 则仅显示输出的文件）
    cachedAssets: true,

    // 添加 children 信息
    children: true,

    // 添加 chunk 信息（设置为 `false` 能允许较少的冗长输出）
    chunks: true,

    // 添加 namedChunkGroups 信息
    chunkGroups: true,

    // 将构建模块信息添加到 chunk 信息
    chunkModules: true,

    // 添加 chunk 和 chunk merge 来源的信息
    chunkOrigins: true,

    // 按指定的字段，对 chunk 进行排序
    // 你可以使用 `!field` 来反转排序。默认是按照 `id` 排序。
    // Some other possible values: 'name', 'size', 'chunks', 'failed', 'issuer'
    // For a complete list of fields see the bottom of the page
    chunksSort: "field",

    // 用于缩短 request 的上下文目录
    context: "../src/",

    // `webpack --colors` 等同于
    colors: false,

    // 显示每个模块到入口起点的距离(distance)
    depth: false,

    // 通过对应的 bundle 显示入口起点
    entrypoints: false,

    // 添加 --env information
    env: false,

    // 添加错误信息
    errors: true,

    // 添加错误的详细信息（就像解析日志一样）
    errorDetails: true,

    // 将资源显示在 stats 中的情况排除
    // 这可以通过 String, RegExp, 获取 assetName 的函数来实现
    // 并返回一个布尔值或如下所述的数组。
    excludeAssets: "filter" | /filter/ | (assetName) => true | false |
      ["filter"] | [/filter/] | [(assetName) => true|false],

    // 将模块显示在 stats 中的情况排除
    // 这可以通过 String, RegExp, 获取 moduleSource 的函数来实现
    // 并返回一个布尔值或如下所述的数组。
    excludeModules: "filter" | /filter/ | (moduleSource) => true | false |
      ["filter"] | [/filter/] | [(moduleSource) => true|false],

    // 查看 excludeModules
    exclude: "filter" | /filter/ | (moduleSource) => true | false |
          ["filter"] | [/filter/] | [(moduleSource) => true|false],

    // 添加 compilation 的哈希值
    hash: true,

    // 设置要显示的模块的最大数量
    maxModules: 15,

    // 添加构建模块信息
    modules: true,

    // 按指定的字段，对模块进行排序
    // 你可以使用 `!field` 来反转排序。默认是按照 `id` 排序。
    // Some other possible values: 'name', 'size', 'chunks', 'failed', 'issuer'
    // For a complete list of fields see the bottom of the page
    modulesSort: "field",

    // 显示警告/错误的依赖和来源（从 webpack 2.5.0 开始）
    moduleTrace: true,

    // 当文件大小超过 `performance.maxAssetSize` 时显示性能提示
    performance: true,

    // 显示模块的导出
    providedExports: false,

    // 添加 public path 的信息
    publicPath: true,

    // 添加模块被引入的原因
    reasons: true,

    // 添加模块的源码
    source: false,

    // 添加时间信息
    timings: true,

    // 显示哪个模块导出被用到
    usedExports: false,

    // 添加 webpack 版本信息
    version: true,

    // 添加警告
    warnings: true,

    // 过滤警告显示（从 webpack 2.4.0 开始），
    // 可以是 String, Regexp, 一个获取 warning 的函数
    // 并返回一个布尔值或上述组合的数组。第一个匹配到的为胜(First match wins.)。
    warningsFilter:false,// "filter" | /filter/ | ["filter", /filter/] | (warning) => true|false
    */

config.node.merge({
    module: 'empty',
    dgram: 'empty',
    dns: 'mock',
    fs: 'empty',
    http2: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
})
if(!isBuild){
   // config.performance.hints('error');
}else{
    config.performance.hints(false);
}
let webpackConfig={
    context:"",
    mode:"",
    devtool:"",
    entry:{

    },
    output:{},
    resolve:{},
    module:{},
    plugins:[],
    optimization:{},
    devServer:{},
    externals:{},
    node: {
        console: false,
        global: true,
        process: true,
        __filename: 'mock',
        __dirname: 'mock',
        Buffer: true,
        setImmediate: true
        // 更多选项，请查看“其他 Node.js 核心库”。
      }
    
}

let compiler=webpack(config.toConfig());


function customerHooks(){
    // compilation  执行前
    compiler.hooks.thisCompilation.tap('dx-thisCompilation',(compilation)=>{

    })
    compiler.hooks.compilation.tap('dx-compilation',(compilation)=>{
        
    });
    //生成资源到 output 目录之前。AsyncSeriesHook
    compiler.hooks.emit.tap('dx-emit',(compilation)=>{
        
    });
    //生成资源到 output 目录之后。
    compiler.hooks.afterEmit.tap('dx-afterEmit',(compilation)=>{
        
    });
}

function startBuild(){
    compiler.run((err,stats)=>{
        if(err){
            signale.error('编译运行失败')
            return;
        }
        console.log(stats.toString({
            children:false,
            modules:false,
            chunks: false,  // 使构建过程更静默无输出
            colors: true    // 在控制台展示颜色
          }));
    });
}

function startDevServer(){
    compiler.hooks.done.tap('compiler-complete',()=>{
        console.log(`
            localhost:${chalk.green(url.format({
                protocol:"http",
                hostname:HOST,
                port:PORT
            }))}
        `)
    })
    
    const serverConfig={
         publicPath:compiler.options.output.publicPath,
         contentBase:compiler.options.output.path,
         hot:true,
         compress:true,
         clientLogLevel: 'none',// 
         quiet:false,
         headers:{
            'access-control-allow-origin': '*'
         },
         port:PORT,
         host:HOST,
         open:false,
        //  proxy:{
        //     target:"http://localhost:9000",
        //     pathRewrite: {
        //         '^/api': '/api/new-path', // rewrite path
        //     }
        //  },
         before(app,server){

         },
         after(app,server){

         }
    }
    let server=new WebpackDevServer(compiler,serverConfig);

    server.listen(PORT,HOST,(err)=>{
        if(err){
            console.log('服务启动失败',err)
            return;
        }
        signale.success('服务启动成功');
    })
    
}
if(!isBuild){
    startDevServer();
}else{
    startBuild();
}
