const koa = require("koa");
const app = new koa();

/*
cookies设置
*/

app.use(async ctx=>{
  const cookie = ctx.cookies.get('key');
  let bodyStr = '';
  console.log('cookie--',cookie)
  if(cookie){
   bodyStr = 'cookie is '+cookie;
  }else{
    await setCookies(ctx);
    bodyStr = 'cookie is set';
  }
  ctx.body = bodyStr;
})

const setCookies = async ctx=>{
  const option = {
    maxAge:10 * 60 * 1000,
    expires:new Date('2018-04-25 16:00:00'),
    path:'/',
    domain:'127.0.0.1',
    httpOnly:true,
    overwrite:false
  }
  ctx.cookies.set('key','hello koa',option);
}

app.listen(3000);
console.log("koa is listening port 3000!")