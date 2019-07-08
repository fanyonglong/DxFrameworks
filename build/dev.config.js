var yargs=require('yargs')
var argv=yargs.options({
    mode:{
        alias:"m",
        default:"development",
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
    }
}).argv;

const webpack=require('webpack');
const WebpackDevServer=require('webpack-dev-server');
const chainConfig=require('webpack-chain');
const {resolve,join}=require('path');
const signale=require('signale');
const chalk=require('chalk');
const open=require('open');
const url=require('url');
const loaderUtils=require('loader-utils')
// 默认配置
const PORT=argv.port;
const HOST=argv.host;
const env=argv.mode;

const MODE={
    none:"none",
    development:"development",
    production:"production"
}
const isBuild=argv.build?true:env==MODE.production;
let devtool=env===MODE.development?'cheap-module-source-map':'none';

const root=resolve(__dirname);
var config=new chainConfig();


config
.mode(MODE.development)
.context(root)
.devtool(devtool);

// entry
//config.entry('react').add('react').add('react-dom'); 
config.entry('index').add('./src/app.js');

//output
config.output.path(join(root,'./dist'));
config.output.filename('[name].[hash].js');
config.output.chunkFilename('[name].js');
config.output.publicPath('/');
config.output.when(isBuild,(output)=>{
    output.pathinfo(false);
},(output)=>{
    output.pathinfo(true);
});

//module

//babe-loader
/** 
 * npm install -D babel-loader @babel/core @babel/preset-env
*/
config.module.rule('babel').test(/\.js$/).exclude.add(/(node_modules|bower_components)/).end().use('babel').loader("babel-loader").options({
    configFile:false,
    babelrc:false,
    plugins:[],
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
    context: join(root, 'src'),
    hashPrefix: 'my-custom-hash',
};
/** 
    "style-loader", // 将 JS 字符串生成为 style 节点
    "css-loader", // 将 CSS 转化成 CommonJS 模块
    "sass-loader" // 将 Sass 编译成 CSS，默认使用 Node Sass 
*/
function createCssRule(name,test,{modules=false,exclude}){
    let rule=config.module.rule(name).test(test);

    //npm install style-loader css-loader --save-dev
    function cssLoader(){
        if(isBuild){
             //npm install --save-dev mini-css-extract-plugin
            rule.use('mini-css-extract-plugin').loader(MiniCssExtractPlugin.loader);
        }else{
            rule.use('style').loader('style-loader').options({
                convertToAbsoluteUrls:true
            });
        }
        rule.use('css').loader('css-loader').options({
            modules:modules?cssModules:false
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
            
        })
    }
   //npm install sass-loader node-sass --save-dev
    function sassLoader(){
        rule.use('sass').loader('sass-loader').options({
            
        })
    }
   
    cssLoader();
    switch(name){
        case "css":
                postcssLoader();
                break;
        case "less":
            lessLoader();
            break;
        case "sass":
            sassLoader();
            break;
    }
    return rule;
}
if(isBuild){
    config.plugin('mini-css-extract-plugin').use(MiniCssExtractPlugin,[{
        filename: "[name].css",//contenthash
        chunkFilename: "[id].css"
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

//externals 从外部引用
config.externals({
  //  'react':"React",
   // 'react-dom':"ReactDOM"
})
//resolve
config.resolve.alias.set('@',join(root,'./src/pages'))
config.resolve.extensions.add('.js').add('.json').add('.mjs').add('.wasm');
// mainFields: ['browser', 'module', 'main']
config.resolve.mainFields.add('main').add('browser').add('module');

// plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')
config.plugin('clean').use(CleanWebpackPlugin,[{
    cleanOnceBeforeBuildPatterns:['**/*'] // 相对 output.path
}])
config.plugin('html').use(HtmlWebpackPlugin,[{
    title:"dx react",
    template:join(root,'src/index.html')
}])



//optimization
config.optimization.splitChunks({
    // chunks:"all",//有效值为all，async和initial
    // automaticNameDelimiter:"~",
    // maxInitialRequests:1,//入口点处的最大并行请求数。
    // maxAsyncRequests:1,// 按需加载时的最大并行请求数。
    // minSize:0,//要生成的块的最小大小（以字节为单位）。
    // maxSize:0,// 块被分割最大文件大小
    // name:true ,//boolean: true | function (module, chunks, cacheGroupKey) | string
    // minChunks:1,//分割前必须共享模块的最小块数。
    /** 
     * 缓存组可以继承和/或覆盖任何选项splitChunks.*; 
     * 但是test，priority并且reuseExistingChunk只能在高速缓存组级别配置。
     * 要禁用任何默认缓存组，请将其设置为false
    */
   cacheGroups:{
     //default: false,
     react: {
        test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
        name: 'react', // 固定名
       // filename:"[name].js",// 动态名
        chunks: 'all',
        /**讲述的WebPack忽略
         * splitChunks.minSize，splitChunks.minChunks，
         * splitChunks.maxAsyncRequests和splitChunks.maxInitialRequests选项，只为这个高速缓存组创建块。 */
        enforce:true
     }
   }
})





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
         proxy:{
            target:"http://localhost:9000",
            pathRewrite: {
                '^/api': '/api/new-path', // rewrite path
            }
         },
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
