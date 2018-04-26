const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')

// 使用koa-bodyparser中间件
app.use(bodyParser())

const form = async ctx=>{
  const body = ctx.request.body;
  console.log(ctx.method,body);
  if(ctx.method=='POST'){
      ctx.body = body;
  }
}

app.use(form);

app.listen(3000)
console.log("koa is listening port 3000!")