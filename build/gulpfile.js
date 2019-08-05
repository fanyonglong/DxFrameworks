const gulp = require('gulp');
const  { series,parallel  } = gulp;
const path=require('path');
const Vinyl = require('vinyl');

exports.build = build;
exports.default = series(clean, build);
const through2 = require('through2');
// The `clean` function is not exported so it can be considered a private task.
// It can still be used within the `series()` composition.
function clean(cb) {
  // body omitted
  cb();
}

// The `build` function is exported so it is public and can be run with the `gulp` command.
// It can also be used within the `series()` composition.
function build() {
  // body omitted
    return gulp.src([
        './packages/**/src/**/*.@(js|vert|frag)']).pipe(through2.obj(function(file, _, cb) {
        //console.log(file.basename);
        //console.log(file.path)
      //  console.log(file.base);
       // console.log(file.dirname)
        //console.log(file.relative)
        file.path=file.path.replace('\\src\\','\\');
       // console.log(file.path)
        //file.path=path.resolve(file.path,'../../',path.basename(file.path));
        cb(null, file);
      })).pipe(gulp.dest('./dist'))
}
exports.test=series(function(){
    console.log(path.resolve('/a/b/c/d.js','../../e/d2.js'))
   // process.stdout.write(path.resolve('./a/b/c.js','../'))
    return Promise.resolve();
});
exports.test2=function(){
    const file = new Vinyl({
        cwd: __dirname,
        base: '/packages/',
        path: '/packages/app/src/index.js',
        contents:  Buffer.from('var x = 123')
      });
      file.path=path.resolve(file.path,'../../',path.basename(file.path));
      console.log(file.dirname,file.relative)
      //C:\packages\app\index.js
      console.log(path.resolve(file.path,'../../',path.basename(file.path)))
      return Promise.resolve();
}
exports.build = series(build);
exports.default = series(clean,build);

