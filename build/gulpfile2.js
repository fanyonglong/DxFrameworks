const {series,src,symlink,dest,parallel,task,tree}=require('gulp');

function build(){

   return src('./node_modules/d3-*/src/**/*.js',{

    }).pipe(dest('./dist'));
}

exports.default=build;
