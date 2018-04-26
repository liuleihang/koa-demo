# koa-demo
​	koa 是由 Express 原班人马打造的，致力于成为一个更小、更富有表现力、更健壮的 Web 框架。 使用 koa 编写 web 应用，通过组合不同的 generator，可以免除重复繁琐的回调函数嵌套， 并极大地提升错误处理的效率。koa 不在内核方法中绑定任何中间件， 它仅仅提供了一个轻量优雅的函数库，使得编写 Web 应用变得得心应手。

​	之前只是停留在看一下，真正写过一些例子之后才算开始入门，在这里把自己写的demo记录了下来。

## 环境搭建
Koa 依赖 node v7.6.0 或 ES2015及更高版本和 async 方法支持，你可以使用自己喜欢的版本管理器快速安装支持的 node 版本。
```
> node -v
> v8.9.4
```
新建一个项目
```
mkdir koa-demo && cd koa-demo
npm i koa --save
```
## 第一个Hello Word！

```
const koa = require("koa");
const app = new koa();

app.use(async ctx=>{
    ctx.body = "Hello Word !"
})
app.listen(3000);
console.log("koa is listening port 3000!")
```
用浏览器打开http://localhost:3000/，就可以看到Hello Word !，这就是一个HTTP服务。

Context 对象

Koa Context 将 node 的 request 和 response 对象封装到单个对象中，为编写 Web 应用程序和 API 提供了许多有用的方法。上例的 ctx.body=''即是发送给用户内容，它是 ctx.response.body的简写(更多请查阅官网)。 ctx.response代表 HTTP Response。 ctx.request代表 HTTP Request

## 路由模块koa-routeer

安装koa-routeer模块
```
npm install koa-router --save
```

```
const koa = require("koa");
const app = new koa();
const Router = require('koa-router');
const router = new Router();

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
console.log("koa is listening port 3000!");
```
运行app2.js,访问127.0.0.1：3000会看到一下界面，点击对应的链接会进入不同的界面。


## 中间件
Koa中使用app.use()用来加载中间件，基本上Koa 所有的功能都是通过中间件实现的。每个中间件默认接受两个参数，第一个参数是 Context 对象，第二个参数是next函数。只要调用next函数，就可以把执行权转交给下一个中间件。由一个经典的Koa洋葱模型。

```
const Koa = require('koa');
const app = new Koa();

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// logger

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// response

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```
多个中间件会形成一个栈结构（middle stack），以"先进后出"（first-in-last-out）的顺序执行。
```
最外层的中间件首先执行。
调用next函数，把执行权交给下一个中间件。
...
最内层的中间件最后执行。
执行结束后，把执行权交回上一层的中间件。
...
最外层的中间件收回执行权之后，执行next函数后面的代码。
```


上面代码执行的顺序是：请求 ==> x-response-time中间件 ==> logger中间件 ==> 响应中间件 ==> logger中间件 ==> response-time中间件 ==> 响应。

Koa已经有了很多好用的[中间件](https://github.com/koajs/koa/wiki#middleware),需要的常用功能基本上都有人实现了。

- 中间件的合成

    [koa-compose](https://www.npmjs.com/package/koa-compose)模块可以将多个中间件合成为一个
    ```
    const Koa = require('koa');
    const app = new Koa();
    const compose = require('koa-compose');
    
    const logger = (ctx, next) => {
      console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
      next();
    }
    
    const main = ctx => {
      ctx.response.body = 'Hello World';
    };
    
    const middlewares = compose([logger, main]);
    app.use(middlewares);
    
    app.listen(3000);
    console.log("koa is listening port 3000!");
    ```
## 模板引擎

安装koa模板使用中间件koa-views,然后在下载模版引擎就可以使用了，
安装koa-views和ejs
```
npm  installl koa-viws --save
npm  installl ejs --save
```
```
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
```
打开http://localhost:3000/，你将看到刚才写的欢迎页面

关于ejs语法请访问ejs官网学习：https://github.com/mde/ejs


## 静态资源服务器
我们的网站中肯定会有静态资源（图片、字体、样式表、脚本……），[koa-static](https://www.npmjs.com/package/koa-static)模块封装了这部分的请求。
安装koa-static
```
npm i --save koa-static
```
创建static文件夹，放入css文件夹
```
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
```
访问http://localhost:3000/css/app.css 将返回app.css 的内容


## 获取请求数据
Koa获取请求数据，主要为GET和POST方式。

### GET请求参数
在koa中，获取GET请求数据源头是koa中request对象中的query方法或querystring方法，ctx.query返回是格式化好的参数对象``{"a":"b","c":"d"}``，ctx.querystring返回的是请求字符串``a=b&c=d``。
下面写一个获取get请求参数的例子
```
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
```
浏览器访问http://127.0.0.1:3000/?page=1&pageSize=10，将会得到下边内容：
```
{
    "url": "/?page=1&pageSize=10",
    "qurey": {
        "page": "1",
        "pageSize": "10"
    },
    "querystring": "page=1&pageSize=10"
}
```
普通的get请求console出来的ctx对象：
```javascript
{ request:
   { method: 'GET',
     url: '/',
     header:
      { host: '127.0.0.1:3000',
        connection: 'keep-alive',
        'upgrade-insecure-requests': '1',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.146 Safari/537.36',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'accept-encoding': 'gzip, deflate, br',        'accept-language': 'zh-CN,zh;q=0.9' } },
  response: { status: 404, message: 'Not Found', header: {} },
  app: { subdomainOffset: 2, proxy: false, env: 'development' },
  originalUrl: '/',
  req: '<original node req>',
  res: '<original node res>',
  socket: '<original node socket>' }
```
### POST请求参数

koa2没有封装获取POST参数的方法，可以直接使用[koa-bodyparser](https://github.com/koajs/bodyparser) 模块从 POST请求的数据体里面提取键值对

```
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
```
打开浏览器填入信息，提交表单就会看到下面信息
```
{
    "name": "app",
    "age": "app",
    "email": "app@app.com"
}
```

## 错误处理

> ctx.throw([status], [msg], [properties])

为了方便处理错误，最好使用try...catch将其捕获。但是，为每个中间件都写try...catch太麻烦，我们可以让最外层的中间件，负责所有中间件的错误处理。

如果错误被try...catch捕获，就不会触发error事件。这时，必须调用ctx.app.emit()，手动释放error事件，才能让监听函数生效。

```
const Koa = require('koa');
const app = new Koa();

const handler = async (ctx,next)=>{
    try {
       await next();
    } catch (err) {
        console.log('catch-err,',err)
        ctx.response.type = 'html';
        ctx.response.body = '<p>Something wrong, please contact administrator.</p>';
        ctx.app.emit('error', err, ctx);
    }
}
const main = async ctx=>{
    ctx.throw(500);
}

app.on('error', (err, ctx) =>{
    console.error('server error', err);
});

app.use(handler);
app.use(main);


app.listen(3000);
console.log("koa is listening port 3000!");
```
上面代码中，main函数抛出错误，被handler函数捕获。catch代码块里面使用ctx.app.emit()手动释放error事件，才能让监听函数监听到。

## Cookies使用

koa提供了从上下文直接读取、写入cookie的方法

- ``ctx.cookies.get(name, [options])`` 读取上下文请求中的cookie
- ``ctx.cookies.set(name, value, [options])`` 在上下文中写入cookie


通过 options 设置 cookie name 的 value :

- ``maxAge`` 一个数字表示从 Date.now() 得到的毫秒数
- ``signed`` cookie 签名值
- ``expires`` cookie 过期的 Date
- ``path`` cookie 路径, 默认是'/'
- ``domain`` cookie 域名
- ``secure`` 安全 cookie   默认false，设置成true表示只有 https可以访问
- ``httpOnly`` 服务器可访问 cookie, 默认是 true
- ``overwrite`` 一个布尔值，表示是否覆盖以前设置的同名的 cookie (默认是 false). 如果是 true, 在同一个请求中设置相同名称的所有 Cookie（不管路径或域）是否在设置此Cookie 时从 Set-Cookie 标头中过滤掉。

>max-age的优先级高于expires。


中文cookies
```
console.log(new Buffer('hello, world!').toString('base64'));// 转换成base64字符串：aGVsbG8sIHdvcmxkIQ==
console.log(new Buffer('aGVsbG8sIHdvcmxkIQ==', 'base64').toString());// 还原base64字符串：hello, world!
```

设置cookies的例子：
```
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
```


## 表单
表单的操作在Web 应用中太常见了，其实表单就是 POST 方法发送到服务器的键值对，[koa-body](https://www.npmjs.com/package/koa-body)模块可以用来从 POST 请求的数据体里面提取键值对。

一个简单的表单提交例子
```
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
```
点击提交按钮，就会看到填入的信息。


## 文件上传
安装koa-body
```
npm install koa-body --save
```
新建一个public文件夹，模拟成文件上传目录，同时上传时，提交的input的name是file，``ctx.request.body.files``获取的是文件，``ctx.request.body.fields``获取的是input参数。
```
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
```









参考

http://www.ruanyifeng.com/blog/2017/08/koa.html

http://book.apebook.org/minghe/koa-action/start/log.html

https://chenshenhai.github.io/koa2-note/note/project/sign.html

https://www.itying.com/koa/article-index-id-59.html

https://github.com/koajs/examples
