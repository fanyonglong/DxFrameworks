var express = require('express')
var app = express()
const opn=require('opn')
const path=require('path')
const root=path.resolve(__dirname,'../packages/tools')
function filePath(file){
    return path.resolve(root,file)
}
app.use(express.static('./packages/tools/dist'))
app.get('/', function (req, res) {
  res.sendFile(filePath('./exmaple/obserable.test.html'))
})

app.listen(3000,()=>{
    opn('http://localhost:3000', {app: 'chrome'});
})