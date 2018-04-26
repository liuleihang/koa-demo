const Koa = require('koa')
const static = require('koa-static')
const path = require('path')
const app = new Koa();

app.use(async ctx=>{
  const url = ctx.url;
  const qurey = ctx.query;
  const querystring = ctx.querystring;
  ctx.body = {
    url,
    qurey,
    querystring
  }
})
app.listen('3000');
console.log("koa is listening port 3000!")