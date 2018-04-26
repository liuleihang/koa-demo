const koa = require("koa");
const app = new koa();
const static = require("koa-static");
const fs = require("fs");
const path = require("path");
const koaBody = require('koa-body');


app.use(static(path.join(__dirname,'/public')));

const upload = async ctx=>{
    console.log('temp--',ctx.request.body.files.file.path)
    console.log('fields--',ctx.request.body.fields)
    //input fields
    const fields = ctx.request.body.fields;
    //file object
    const file = ctx.request.body.files.file;
    const read = fs.createReadStream(file.path);
    const filePath = path.join(__dirname,'/public',Date.now()+path.extname(file.name))
    const write = fs.createWriteStream(filePath);
    read.pipe(write);
    console.log('uploading %s -> %s', file.name, write.path);
    read.on('end',()=>{
        console.log('read ',file.name,' end',new Date())
    })
    write.on('finish',()=>{
        console.log('write ',file.name,' finish',new Date());
        fs.unlinkSync(file.path);
    })
    ctx.body = {
        uplodUser:fields.name,
        uploadPath:filePath
    };
}

app.use(koaBody({ multipart: true }));
app.use(upload);
app.listen(3000)
console.log("koa is listening port 3000!")