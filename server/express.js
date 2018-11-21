var express = require('express')
var app = express()
const opn=require('opn')


app.use(express.static('./packages/tools/dist'))
app.get('/', function (req, res) {
  res.sendFile('./packages/tools/exmaple/obserable.test.html')
})


app.listen(3000,()=>{
    opn('http://localhost:3000', {app: 'chrome'});
})