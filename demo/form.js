const koa = require("koa");
const app = new koa();
const bodyParser = require('koa-bodyparser')

const form = async ctx=>{
    const body = ctx.request.body;
    console.log(ctx.method,body);
    if(ctx.method=='POST'){
        ctx.body = body;
    }
}

// 使用koa-bodyparser中间件
app.use(bodyParser())

const form = async (ctx) => {

  if (ctx.url === '/' && ctx.method === 'GET') {
    // 当GET请求时候返回表单页面
    let html = `
      <h1>koa-bodyparser</h1>
      <form method="POST" action="/">
        Name:<input name="name" /><br/>
        Age:<input name="age" /><br/>
        Email: <input name="email" /><br/>
        <button type="submit">submit</button>
      </form>
    `
    ctx.body = html
  } else if (ctx.url === '/' && ctx.method === 'POST') {
    // 当POST请求的时候，中间件koa-bodyparser解析POST表单里的数据，并显示出来
    ctx.body = ctx.request.body
  } else {
    // 404
    ctx.body = '<h1>404 Not Found</h1>'
  }
}

app.use(form);


app.listen(3000)
console.log("koa is listening port 3000!")