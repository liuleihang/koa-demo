const Koa = require('koa')
const static = require('koa-static')
const path = require('path')
const app = new Koa();


//静态资源目录
const staticPath = './static';
app.use(static(path.join(__dirname, staticPath)))

app.use(async (ctx) => {
    ctx.body = 'hello world'
  })

app.listen('3000');
console.log("koa is listening port 3000!")