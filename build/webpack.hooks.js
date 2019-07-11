const webpack = require('webpack');
const signale = require('signale');
const resolver = require('enhanced-resolve');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MultiEntryPlugin = require('webpack/lib/MultiEntryPlugin')
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');
const RawModule=require('webpack/lib/RawModule')
const path = require('path');
const fs=require('fs');
const {RawSource}=require('webpack-sources')


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
    apply(compiler) {
        let hooksSort = [];
        let console = {
            log: function (name) {
                hooksSort.push(name);
            }
        }
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
    }
}
class CompilationPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap('a', (compilation, ops) => {
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
                            // compilation.assets[file] = new ConcatSource(
                            //     '\/**Sweet Banner**\/',
                            //     '\n',
                            //     compilation.assets[file]
                            // );
                        });
                    });

                    callback();
                });

                compilation.hooks.normalModuleLoader.tap('normalModuleLoader',(loaderContext,module)=>{
                    signale.info('normalModuleLoader',module.id)
                })

                ops.normalModuleFactory
        })
        /**
         * Normal：通过绝对路径或相对路径，解析一个模块。
            Context：通过给定的 context 解析一个模块。
            Loader：解析一个 webpack loader。 */
        compiler.resolverFactory.hooks.resolver.for('Normal').tap('resolver', (resolver,resolveOptions) => {
            
            signale.info('resolveOptions',resolveOptions)
            resolver.resolve({}, compiler.context, './src/tests/page/e', {}, (
                err /*Error*/,
                filepath /*string*/
            ) => {
                signale.info('resolverFactory',filepath)
                // Do something with the path
            });
        })
        // compiler.hooks.normalModuleFactory.tap('b', (normalModuleFactory) => {
        //     normalModuleFactory.hooks.module.tap('a', (module, data) => {
        //         signale.info('module:',module._source)
        //         return module;
        //     })
        // })

       
    }
}

let config = {
    mode: "development",
    context: __dirname,
    devtool: "cheap-module-source",
    entry: {
        'page': ['./src/tests/pageB'],
        'pageE': ['./src/tests/pageE']
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name][hash].js'
    },
    plugins: [
        //new EntryPlugin(),
        new CompilationPlugin(),
        new CleanWebpackPlugin()
    ],
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendors: {
                    chunks: "all",
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
