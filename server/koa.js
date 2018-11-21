const Koa = require('koa');
const app = new Koa();
const opn=require('opn')
 
// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
});
 
app.listen(3000,()=>{
    opn('http://localhost:3000', {app: 'chrome'});
});