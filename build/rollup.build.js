
const packages={
    'tools':{

    }

}
const path=require('path');
let root=path.resolve(__dirname,'../../');
import replace from 'rollup-plugin-replace';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import alias from 'rollup-plugin-alias';
import minify from 'rollup-plugin-babel-minify';
import commonjs from 'rollup-plugin-commonjs';
var argv=require('yargs').boolean('ug').argv;
var plugins=[];
if(argv.ug)
{
    console.log('444444');
    plugins.push(minify({
        comments:false,  // comments（默认：）：true表示注释是否应保存在源代码中
       // banner（默认undefined：）：应该被预置到已转换束的注释
       sourceMap:false//sourceMap（默认true：）：表示是否应该生成源图
    }));
}
export default {
    //默认情况下，模块的上下文 - 即顶级的this的值为undefined。在极少数情况下，您可能需要将其更改为其他内容，如 'window'。
   // context:'window',
   //context:path.resolve(root,'src/dx'),
   //  moduleContext:path.resolve(root,'src/dx'),,
    //这个包的入口点 (例如：你的 main.js 或者 app.js 或者 index.js)
    input: path.resolve(root,'src/dx/main.js'),
    output: {
      file:path.resolve(root, 'dist/dx/index-rollup.js'),
      /*
      amd – 异步模块定义，用于像RequireJS这样的模块加载器
    cjs – CommonJS，适用于 Node 和 Browserify/Webpack
    es – 将软件包保存为ES模块文件
    iife – 一个自动执行的功能，适合作为<script>标签。（如果要为应用程序创建一个捆绑包，您可能想要使用它，因为它会使文件大小变小。）
    umd – 通用模块定义，以amd，cjs 和 iife 为一体
      */
      format: 'amd',
      //代表你的 iife/umd 包，同一页上的其他脚本可以访问它。
       name:"mjb", 
        //字符串以 前置/追加 到文件束(bundle)。(注意:“banner”和“footer”选项不会破坏sourcemaps)
        banner: '/* Project base tool library */', //在打包好的文件的块的外部(wrapper外部)的最顶部插入一段内容
      //  footer: "",//'/* Developer  @fanyonglong */',//在打包好的文件的块的外部(wrapper外部)的最底部插入一段内容
         //String类似于 banner和footer，除了代码在内部任何特定格式的包装器(wrapper)
        intro: 'var __non_webpack_require__=require;',// 在打包好的文件的块的内部(wrapper内部)的最顶部插入一段内容
     //   outro:"",//在打包好的文件的块的内部(wrapper内部)的最底部插入一段内容
        sourcemap:false ,//如果 true，将创建一个单独的sourcemap文件。如果 inline，sourcemap将作为数据URI附加到生成的output文件中。
        amd: {
           // id: 'my-bundle'
        },
        freeze:false,// 导出不冻结
        globals:{
          //  jquery:'$'
        },
        strict:true,
        /**
         * Function，它获取一个ID并返回一个路径，或者id：path对的Object。在提供的位置，这些路径将被用于生成的包而不是模块ID，从而允许您（例如）从CDN加载依赖关系：
         * 
        */
        paths:{
                "element-ui":"ELEMENT"
        },
        exports:"auto",// 
        interop:true //包含公共的模块（这个选项是默认添加的）
    },
  
    plugins:[...plugins,alias({
    }),replace({
      //  include: 'main.js',
        exclude: 'node_modules/**',
        delimiters:['',''],
        "process.env.globalvar": JSON.stringify('mjb')
    //     values: {
    //         VERSION: '1.0.0',
    //         process: {
    //             env:{
    //                 'NODE_ENV': JSON.stringify('dev'),
    //                 'globalvar':JSON.stringify('mjb')
    //             }
    //         }
    //    }     
    }),commonjs(),resolve(),babel(
        {
            babelrc:false,
            presets:[['env',{
                    targets:{
                        browsers:['last 3 versions','ie >= 9'],
                    },
                   modules: false
                    
            }]],
           // externalHelpers: true,
            runtimeHelpers:true,
            plugins:[['transform-runtime',{
                "helpers": true,
                'polyfill':true
            }]],
            // plugins:[['transform-runtime',{
            //     "helpers": false,//是否切换将内联（inline）的 Babel helper（classCallCheck，extends 等）替换为对 moduleName 的调用。
            //     "polyfill": false, //是否切换新的内置插件（Promise，Set，Map等）为使用非全局污染的 polyfill
            //     "regenerator": true, //是否切换 generator 函数为不污染全局作用域的 regenerator 运行时。
            //     "moduleName": "babel-runtime"
            // }],"external-helpers"],
            exclude: 'node_modules/**' // 只编译我们的源代码
        }
    )],
    external:['lodash','jquery','vue','element-ui']
    
};