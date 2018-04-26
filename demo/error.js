const Koa = require('koa');
const app = new Koa();

const handler = async (ctx,next)=>{
    try {
       await next();
    } catch (err) {
        console.log('catch-err-ctx,',ctx)
        ctx.response.type = 'html';
        ctx.response.body = '<p>Something wrong, please contact administrator.</p>';
        ctx.app.emit('error', err, ctx);
    }
}
const main = async ctx=>{
    ctx.throw(500);
    console.log('main--err-ctx,',ctx)
}

app.on('error', (err, ctx) =>{
    console.error('server error', err);
});

app.use(handler);
app.use(main);


app.listen(3000);
console.log("koa is listening port 3000!");