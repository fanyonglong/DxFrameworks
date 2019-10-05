// rollup.config.js
const resolve =require('rollup-plugin-node-resolve');
const babel =require('rollup-plugin-babel');
const replace=require('rollup-plugin-replace');
const path=require('path');
const fs=require('fs');
var files= [ {
  input: 'packages/scheduler/index.js',
  output: {
    file: 'dist/scheduler.js',
    format: 'umd',
    name:"ReactScheduler"
  }
}, {
  input: 'packages/scheduler/tracing.js',
  output: {
    file: 'dist/tracing.js',
    format: 'umd',
    name:"ReactTracing"
  }
}]

const rollup = require('rollup');

// see below for details on the options
// const inputOptions = {...};
// const outputOptions = {...};

async function build(inputOptions,outputOptions) {
  // create a bundle
  const bundle = await rollup.rollup(inputOptions);

  //console.log(bundle.imports); // an array of external dependencies
 // console.log(bundle.exports); // an array of names exported by the entry point
  //console.log(bundle.modules); // an array of module objects

  // generate code and a sourcemap
 // const { code, map } = await bundle.generate(outputOptions);

  // or write the bundle to disk
  await bundle.write(outputOptions);
  console.log('生成成功')
}
function ParseReactPackage(){
  return {
    name: 'my-ParseReactPackage', // this name will show up in warnings and errors
    resolveId ( source ) {
      if (source === 'shared/ReactFeatureFlags') {
        return path.resolve(__dirname,'packages/shared/ReactFeatureFlags.js');
      //  return source; // this signals that rollup should not ask other plugins or check the file system to find this id
      }
      return null; // other ids should be handled as usually
    },
    // load ( id ) {
    //   if (id === 'shared/ReactFeatureFlags') {
    //     // return {
    //     //   code: fs.readFileSync(path.resolve(__dirname,'packages/shared/ReactFeatureFlags.js'),{
    //     //     encoding:"utf8"
    //     //   })
    //     // }; // the source code for "virtual-module"

    //     const referenceId = this.emitFile({
    //       type: 'asset',
    //       name: id,
    //       source: fs.readFileSync(path.resolve(__dirname,'packages/shared/ReactFeatureFlags.js'))
    //     });
    //     return `export default import.meta.ROLLUP_FILE_URL_${referenceId};`;
    //   }
    //   return null; // other ids should be handled as usually
    // }
  };
}
var isProduction=false,isUMDBundle=true,isProfiling=false;
function buildall(){
    for(var i=0;i<files.length;i++){
      let {output,...input}=files[i];
      build({
      //  external:['shared/ReactFeatureFlags',path.resolve(__dirname,'packages/shared/ReactFeatureFlags.js')],
        plugins: [
          ParseReactPackage(),
          replace({
            __DEV__: isProduction ? 'false' : 'true',
            __PROFILE__: isProfiling || !isProduction ? 'true' : 'false',
            __UMD__: isUMDBundle ? 'true' : 'false',
            'process.env.NODE_ENV': isProduction ? "'production'" : "'development'",
          }),
          resolve({
           // only: ['../scheduler']
          }),
          babel({
            exclude: 'node_modules/**' // 只编译我们的源代码
          })
        ],
        ...input},{
          globals:{
          //  'shared/ReactFeatureFlags':'ReactFeatureFlags'
          },
          ...output
        })
    }
}
buildall();
