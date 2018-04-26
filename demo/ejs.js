const Koa = require('koa')
const views = require('koa-views')
const path = require('path')
const app = new Koa();


//加载模拟引擎
app.use(views(path.join(__dirname, './view'),{
    extension:'ejs'
}))

app.use(async ctx=>{
    let title = 'koa2';
    await ctx.render('index',{title})
})

app.listen('3000');
console.log("koa is listening port 3000!")