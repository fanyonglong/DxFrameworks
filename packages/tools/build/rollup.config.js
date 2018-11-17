
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
var argv=require('yargs').argv;

const path=require('path');
const root=path.resolve(__dirname,'../');

let plugins=[];
export default {

    input: path.resolve(root,'src/dx/main.js'),
    output: {
        file:path.resolve(root, 'dist/dx/index-rollup.js'),
        format: 'amd',
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
        commonjs(),
        resolve(),
        babel(
        {
            babelrc:false,
            presets:[['env',{
                    targets:{
                        browsers:['last 3 versions','ie >= 9'],
                    },
                   modules: false                   
            }]],

            runtimeHelpers:true,
            plugins:[['transform-runtime',{
                "helpers": true,
                'polyfill':true
            }]],
            exclude: 'node_modules/**' // 只编译我们的源代码
        }
    )],
    external:[]
    
};