var babel=require('@babel/core')

var path=require('path')
var root=path.resolve(__dirname,'../');

babel.transformFile(path.join(root,'src/index.js'), {
    babelrc:false,
    configFile:path.resolve(root,'../../babel.config.js'),
   // plugins:['@babel/helper-module-imports']
}, function (err, result) {
    //result; // => { code, map, ast }
    if(err){
        console.error(err)
        return;
    }
    var {code,ast}=result
    console.log(code)
  });