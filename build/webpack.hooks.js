const webpack = require('webpack');
const signale = require('signale');
const resolver = require('enhanced-resolve');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MultiEntryPlugin = require('webpack/lib/MultiEntryPlugin')
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const RawModule=require('webpack/lib/RawModule')
const path = require('path');
const fs=require('fs');
//https://github.com/webpack/webpack-sources
const {RawSource,ConcatSource,ReplaceSource,OriginalSource,SourceMapSource,LineToLineMappedSource,PrefixSource}=require('webpack-sources')
const ManifestPlugin=require('webpack-manifest-plugin');// 创建资产清单
const HtmlWebpackPlugin = require('html-webpack-plugin');
//Progressive Web App PWA渐进式web网络程序
const WorkboxPlugin = require('workbox-webpack-plugin');
const ParserHelpers=require('webpack/lib/ParserHelpers');

// 表达式
const BasicEvaluatedExpression=require('webpack/lib/BasicEvaluatedExpression')
// 依赖
const ConstDependency=require('webpack/lib/dependencies/ConstDependency');
const SingleEntryDependency=require('webpack/lib/dependencies/SingleEntryDependency');
const ImportDependency=require('webpack/lib/dependencies/ImportDependency');
const HarmonyImportSideEffectDependency=require('webpack/lib/dependencies/HarmonyImportSideEffectDependency');
// const myResolver = resolver.create({
//     alias:{
//         'aa':'react'
//     },
// 	// Typical usage will consume the `fs` + `CachedInputFileSystem`, which wraps Node.js `fs` to add caching.
// 	//fileSystem: new resolver.CachedInputFileSystem(new resolver.NodeJsInputFileSystem(), 4000),
// 	extensions: [".js", ".json"]
// 	/* any other resolver options here. Options/defaults can be seen below */
// });
// myResolver(path.resolve(__dirname,"src"), "aa", (
// 	err /*Error*/,
// 	filepath /*string*/
// ) => {
//     if(err){
//         console.log('err:')
//         return;
//     }
//     // Do something with the path
//     console.log(filepath)
// });


class EntryPlugin {
    constructor(){
        this.startTime = Date.now();
        this.prevTimestamps = {};
    }
    apply(compiler) {
        let hooksSort = [];
        let console = {
            log: function (name) {
                hooksSort.push(name);
            }
        }
        // 
        compiler.hooks.environment.tap('entry', () => {
            console.log('environment')
        })
        compiler.hooks.afterEnvironment.tap('entry', () => {
            console.log('afterEnvironment')
        })
        compiler.hooks.entryOption.tap('addEntry', (context, entry) => {
            console.log('entryOption', entry)
            // new SingleEntryPlugin(context,"./src/tests/pageA.js",'pageA').apply(compiler);
            //     return false;
        });
        compiler.hooks.afterPlugins.tap('afterPlugins', (compiler) => {

        })
        compiler.hooks.beforeRun.tap('addEntry', (compiler) => {
            console.log('beforeRun')
        })
        compiler.hooks.run.tap('addEntry', (compiler) => {
            console.log('run')
        })
        // 模块工厂
        compiler.hooks.normalModuleFactory.tap('addEntry', (normalModuleFactory) => {
            console.log('normalModuleFactory')
        })
        compiler.hooks.contextModuleFactory.tap('addEntry', (contextModuleFactory) => {
            console.log('contextModuleFactory')
        })
        compiler.hooks.beforeCompile.tap('addEntry', ({ normalModuleFactory, contextModuleFactory, compilationDependencies }) => {
            console.log('beforeCompile')
        })
        compiler.hooks.compile.tap('addEntry', ({ normalModuleFactory, contextModuleFactory, compilationDependencies }) => {
            console.log('compile');

        })
        compiler.hooks.thisCompilation.tap('addEntry', (compilation, { normalModuleFactory, contextModuleFactory, compilationDependencies }) => {
            console.log('thisCompilation')

        })
        compiler.hooks.compilation.tap('addEntry', (compilation, { normalModuleFactory, contextModuleFactory, compilationDependencies }) => {
            console.log('compilation')

        })

        compiler.hooks.make.tapAsync('addEntry', (compilation, callback) => {
            console.log('make')
            // compilation.addChunk('./page/a')
            // let entry=SingleEntryPlugin.createDependency('./src/tests/pageC.js','pageC')
            //  compilation.addEntry(compiler.context,entry,'pageC',callback)
            callback();
        });
        compiler.hooks.emit.tap('addEntry', (compilation) => {
            console.log('emit')
        })
        compiler.hooks.afterEmit.tap('addEntry', (compilation) => {
            console.log('afterEmit')
        })
        compiler.hooks.done.tap('done', () => {
            console.log('done');
            signale.log(hooksSort.join(','))
        })
        //normal,context,loader
        compiler.resolverFactory.hooks.resolver.for('a').tap('resolver', (resolver) => {
            console.log('resolver')
        })

        // compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
        //     // 检索每个（构建输出的）chunk：
        //     compilation.chunks.forEach(chunk => {
        //       // 检索 chunk 中（内置输入的）的每个模块：
        //       chunk.modules.forEach(module => {
        //         // 检索模块中包含的每个源文件路径：
        //         module.fileDependencies.forEach(filepath => {
        //           // 我们现在已经对源结构有不少了解……
        //         });
        //       });
      
        //       // 检索由 chunk 生成的每个资源(asset)文件名：
        //       chunk.files.forEach(filename => {
        //         // Get the asset source for each file generated by the chunk:
        //         var source = compilation.assets[filename].source();
        //       });
        //     });
      
        //     callback();
        //   });

        // compiler.hooks.emit.tapAsync('MyPlugin', (compilation, callback) => {
        //     var changedFiles = Object.keys(compilation.fileTimestamps).filter(
        //       watchfile => {
        //         return (
        //           (this.prevTimestamps[watchfile] || this.startTime) <
        //           (compilation.fileTimestamps[watchfile] || Infinity)
        //         );
        //       }
        //     );
      
        //     this.prevTimestamps = compilation.fileTimestamps;
        //     callback();
        //   });
    }
}
class CompilationPlugin {
    apply(compiler) {
        compiler.hooks.thisCompilation.tap('a', (compilation, ops) => {
            console.log(compilation.chunks.length)
          //  compilation.addModule(new RawModule('',''))
            compilation.hooks.buildModule.tap('buildModule',(module)=>{
                signale.info('buildModule',module.identifier(),"isEntryModule",module.isEntryModule())
            })
            compilation.hooks.rebuildModule.tap('rebuildModule',(module)=>{
                signale.info('rebuildModule',module.resource)
            })
            // compilation.hooks.succeedModule.tap('succeedModule',(module)=>{
            //     signale.info('succeedModule',module.resource)
            // })
            compilation.hooks.optimizeDependencies.tap('optimizeDependencies',(modules)=>{
                signale.info('optimizeDependencies')
            })
            compilation.hooks.afterOptimizeDependencies.tap('optimizeDependencies',(modules)=>{
                signale.info('afterOptimizeDependencies')
            })
            compilation.hooks.afterChunks.tap('afterChunks',(chunks)=>{
                signale.info('afterChunks')
            })
            compilation.hooks.chunkAsset.tap('chunkAsset', (chunk, filename) => {
                signale.info('chunkAsset','chunkName',chunk.files,'filename',filename);

            })
            compilation.hooks.moduleAsset.tap('moduleAsset', (module, filename) => {
                signale.info('moduleAsset', filename)
            });
            // compilation.hooks.additionalAssets.tapAsync('MyPlugin', callback => {
            //     fs.readFile(path.resolve(compiler.context,'./src/tests/page/f.js'),'utf8',(err,data)=>{
            //         if(err){
            //             console.log('读取文件失败')
            //             callback();
            //             return;
            //         }
            //         //console.log(data)
            //         compilation.assets['pagee.js']=new RawSource(data);
            //         callback();
            //     })
  
            //     callback();
            //     signale.info('additionalAssets')
            //  });
            compilation.hooks.additionalChunkAssets.tap('add', (chunks) => {

                
                signale.info('additionalChunkAssets');

                //compilation.addChunk('./src/tests/pageE.js');
            });
            compilation.hooks.optimizeChunks.tap('optimizeChunks',(chunks,chunkGroups)=>{
                signale.info('optimizeChunks');
            })
            compilation.hooks.optimizeAssets.tapAsync('optimizeAssets',(assets,callback)=>{
                signale.info('optimizeAssets')
                callback();
            });
            // 修改每个chunk里面的文件
            compilation.hooks
                .optimizeChunkAssets
                .tapAsync('MyPlugin', (chunks, callback) => {
                    chunks.forEach(chunk => {
                      //  console.log(chunk)
                        chunk.files.forEach(file => {
                            signale.info('optimizeChunkAssets',file)
                            compilation.assets[file] = new ConcatSource(
                                '\/**Sweet Banner**\/',
                                '\n',
                                compilation.assets[file]
                            );
                        });
                    });

                    callback();
                });

                compilation.hooks.normalModuleLoader.tap('normalModuleLoader',(loaderContext,module)=>{
                    signale.info('normalModuleLoader',module.id)
                })

               // ops.normalModuleFactory
        })
        compiler.hooks.normalModuleFactory.tap('NormalModuleFactory',(normalModuleFactory)=>{

        
        })
        /**
         * Normal：通过绝对路径或相对路径，解析一个模块。
            Context：通过给定的 context 解析一个模块。
            Loader：解析一个 webpack loader。 */
        // compiler.resolverFactory.hooks.resolver.for('Normal').tap('resolver', (resolver,resolveOptions) => {
            
        //     signale.info('resolveOptions',resolveOptions)
        //     resolver.resolve({}, compiler.context, './src/tests/page/e', {}, (
        //         err /*Error*/,
        //         filepath /*string*/
        //     ) => {
        //         signale.info('resolverFactory',filepath)
        //         // Do something with the path
        //     });
        // })
        // compiler.hooks.normalModuleFactory.tap('b', (normalModuleFactory) => {
        //     normalModuleFactory.hooks.module.tap('a', (module, data) => {
        //         signale.info('module:',module._source)
        //         return module;
        //     })
        // })

       
    }
}
// 修改文件源码AST


class addConstDependency{
    apply(compiler){
        compiler.hooks.thisCompilation.tap('a',(compilation)=>{
            compilation.hooks.buildModule.tap('aa',(module)=>{
                if(module.rawRequest.indexOf('pageG')!=-1){
                //    const dep = new ConstDependency("import am from './page/a';",0);
                //    dep.loc = expr.loc;
                //    module.addDependency(dep);
               
                   // var d=new ImportDependency('./page/a',module);
                    //module.addDependency(d);

                   

                   
                    rename('a','a3')(module.parser)
                    ast(module.parser);

                    obvser('pp',module.parser);
                }
            })
        })
        function obvser(name,parser){
            var hooks=['evaluateTypeof',
            'evaluateIdentifier',
            'evaluateDefinedIdentifier',
            'evaluateCallExpressionMember',
            'call','callAnyMember','new','expression','expressionAnyMember','varDeclaration','typeof'];
            hooks.forEach((key)=>{
                parser.hooks[key].for(name).tap('a',()=>{
                    console.log(key);
                })
            })
        }
        // 添加模块依赖
        function addDependency(module,path){
            var d=new HarmonyImportSideEffectDependency(path,module,0,{});
             module.addDependency(d);
        }
        // ast
        function ast(parser){
              parser.hooks.program.tap('a',(ast)=>{
                  // 重命名          
                //const dep = new ConstDependency("a2",  ast.body[0].declarations[0].id.range);
			    //dep.loc = ast.body[0].declarations[0].id.loc;
				//parser.state.current.addDependency(dep);
            })
        }
        // 变量重命名
        function rename(name,newName){
            return function (parser){
                parser.hooks.varDeclaration.for(name).tap('rename',(expression)=>{
                    const dep = new ConstDependency(newName, expression.range);
                    dep.loc = expression.loc;
                    parser.state.current.addDependency(dep);
                    return true;
                });
                parser.hooks.varDeclarationLet.for(name).tap('rename',(expression)=>{
                   
                })
            }
        }
        compiler.hooks.normalModuleFactory.tap('MyPlugin', factory => {
            factory.hooks.parser.for('javascript/auto').tap('MyPlugin', (parser, options) => {
               // parser.hooks.canRename.for('').tap(/* ... */);
            });
        });
        
    }
}

let config = {
    mode: "development",
    context: __dirname,
    devtool: "cheap-module-source",
    entry: {
        'pageG':'./src/tests/pageG.js'
       // 'pageB': ['./src/tests/pageB'],
       // 'pageE': ['./src/tests/pageE']
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].[chunkhash].js',
        chunkFilename:'[name].[chunkhash].js'
    },
    plugins: [
       // new EntryPlugin(),
       // new CompilationPlugin(),
       //new CompilationPlugin2(),
       new addConstDependency(),
        new CleanWebpackPlugin(),
      //  new HtmlWebpackPlugin(),
       // new webpack.AutomaticPrefetchPlugin(),
        // new webpack.ProvidePlugin({
        //     $: 'jquery',
        //     jQuery: 'jquery'
        //   }),
          //Progressive Web App
        // new WorkboxPlugin.GenerateSW({
        //           // 这些选项帮助快速启用 ServiceWorkers
        //            // 不允许遗留任何“旧的” ServiceWorkers
        //            clientsClaim: true,
        //            skipWaiting: true
        //  }),
      //  new webpack.ProgressPlugin(),
        // new ManifestPlugin({
        //  //   filename:path.resolve(__dirname,'/manifest.json')
        // })
    ],
    module:{
        // rules:[
        //     {
        //         test:/\.js$/,
        //         include:path.resolve(__dirname,'src'),
        //         loader:path.resolve(__dirname,'loaders/SyncLoad.js')
        //     }
        // ]
    },
    resolve:{
        // modules: [
        //     "node_modules",
        //      path.resolve(__dirname, "app")
        //   ]
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendors: {
                    chunks: "initial",
                    minSize: 0,
                    minChunks: 2
                }
            }
        }
    }
}

let compiler = webpack(config);




compiler.run((err, stats) => {
    if (err) {
        signale.error('编译失败');
        return;
    }
    signale.success('编译成功')

})
