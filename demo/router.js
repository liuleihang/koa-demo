const koa = require("koa");
const app = new koa();
const Router = require('koa-router');
const router = new Router();

/*
hello-word
app.use(async ctx=>{
    ctx.body = "Hello Word !"
})
*/
router.get('/',async ctx=>{
    let html = `
      <ul>
        <li><a href="/hello">helloworld</a></li>
        <li><a href="/about">about</a></li>
      </ul>
    `
    ctx.body = html;
}).get('/hello',async ctx=>{
    ctx.body="Hello Word !";
}).get('/about',async ctx=>{
  ctx.body="my site";
})
app.use(router.routes(),router.allowedMethods())

app.listen(3000);
console.log("koa is listening port 3000!")