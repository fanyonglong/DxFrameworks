const path=require('path');
const root=path.resolve(__dirname,'../');

function resolve(dir)
{
    return path.join(root,dir);
}
module.exports={
    resolve
};