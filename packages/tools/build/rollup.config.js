
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
var argv=require('yargs').argv;

const path=require('path');
const root=path.resolve(__dirname,'../');

let plugins=[];
export default {

    input: path.resolve(root,'src/index.js'),
    output: {
        file:path.resolve(root, 'dist/dx.tools.js'),
        format: 'umd',
        name:"dx", 
        //字符串以 前置/追加 到文件束(bundle)。(注意:“banner”和“footer”选项不会破坏sourcemaps)
        banner: '/* @desc 工具库 \n @author fanyonglong */', //在打包好的文件的块的外部(wrapper外部)的最顶部插入一段内容
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
        },
        exports:"auto",// 
        interop:true //包含公共的模块（这个选项是默认添加的）
    },
  
    plugins:[...plugins,
      
        resolve(),
        /**
         * 所有选项均按照Babel文档进行，但以下情况除外：
            options.externalHelpers：一个布尔值，指示是否捆绑Babel助手
            options.include和options.exclude：每个minimatch模式，或minimatch模式数组，确定哪些文件由Babel转换（默认情况下，所有文件都被转换）
            options.externalHelpersWhitelist：一个数组，它可以显式控制bundle中允许的babelHelper函数（默认情况下，允许每个帮助器）
            options.extensions：Babel应该转换的文件扩展名数组（默认使用Babel默认值.js，.jsx，.es6，.es，.mjs。）
         * */
        babel(
            {
                babelrc:true,
                configFile:path.resolve(root,'babel.config.js'),
                /**类型：boolean | MatchPattern | Array<MatchPattern>
默认：opts.root
放置：允许在Babel的编程选项中，或在加载的内部configFile。程序化选项将覆盖配置文件。

默认情况下，巴贝尔将只搜索.babelrc文件内"root"包装，否则巴贝尔无法知道，如果给定的.babelrc，就是要加载，或者如果它是"plugins"和"presets"甚至已经安装，因为文件被编译可能是内部的node_modules，或者已被符号链接到项目。

此选项允许用户在考虑是否加载.babelrc文件时提供应被视为“根”包的其他包的列表。 */
             //   babelrcRoots:path.resolve(root,'babel.config.js'),
                /**rootMode
类型："root" | "upward" | "upward-optional"
默认："root"
放置：仅允许在Babel的编程选项中使用
版本：^7.1.0

此选项与"root"值结合，定义了Babel如何选择其项目根。不同的模式定义了Babel可以处理"root"值以获得最终项目根目录的不同方式。

"root"- 传递"root"值不变。
"upward"- 从"root"目录向上移动，查找包含babel.config.js 文件的目录，如果babel.config.js 找不到，则抛出错误。
"upward-optional"- 从"root"目录向上走，查找包含babel.config.js 文件的目录，"root"如果babel.config.js 找不到，则回退到目录。*
                 * 
                 */
                rootMode:'root',
               // externalHelpers: true,
                // presets:[['env',{
                //         targets:{
                //             browsers:['last 3 versions','ie >= 9'],
                //         },
                //        modules: false                   
                // }]],
               // runtimeHelpers:true,
                // /***
                //  * runtime 编译器插件做了以下三件事：
                // 当你使用 generators/async 函数时，自动引入 babel-runtime/regenerator 。
                // 自动引入 babel-runtime/core-js 并映射 ES6 静态方法和内置插件。
                // 移除内联的 Babel helper 并使用模块 babel-runtime/helpers 代替。
                // 这意味着什么？基本上，你可以使用诸如 Promise，Set，Symbol 等内置函数，以及所有需要 polyfill 来完成且不带来全局污染的 Babel 功能，因此非常适合作为库使用。

                // 确保你引入 babel-runtime 作为依赖。
                //  */
                // plugins:[['transform-runtime',{
                //     "helpers": true,
                //     'polyfill':true
                // }]],
                // exclude: 'node_modules/**' // 只编译我们的源代码
            }
        ),
        commonjs()
    ],
    external:[]
    
};