const express = require("express")//引入express
const multer = require("multer")
const app = express()//express实例化
const path = require("path")
const {tokenAdmin,queryAdmin,insertAdmin} = require("./db/Dbadmin")
const cors = require('cors');
const port = 8080//一个端口

app.use(express.json())//中间件配置，json,用于前后端的交互，尽可能往前写

// app.use(function(req,res,next){//用于跨域请求
//     //设置允许跨域的域名，*是允许任意域名跨域
//     res.header("Access-Control-Allow-Origin","*")
//     //设置允许的Headers类型
//     res.header("Access-Control-Allow-Headers","'Content-Type, Token'")
//     //设置允许的请求方式
//     res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS")
//     //让options尝试请求 快速结束
//     req.method === 'OPTIONS' ? res.sendStatus(200) : next();  //快请求
//     // else next();
// })
// 后端中间件标准化头部字段（app.js）
// const token = req.headers.token || req.headers['Token'];
app.use(cors({
    origin: 'http://localhost:5174',  // 允许前端源
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // 允许的请求方法
    allowedHeaders: ['Content-Type', 'Authorization', 'token', 'headers'],  // 允许的请求头
    exposedHeaders: ['Token'],
    credentials: true  // 允许携带凭证（如 Cookie）
}));
// Express 中配置 CORS 中间件
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // 允许前端源
//     res.header('Access-Control-Allow-Methods', 'GET, PUT,POST, OPTIONS');    // 允许的请求方法
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Token');   // 允许自定义头部（必须包含 Token）
//     req.method === 'OPTIONS' ? res.sendStatus(200) : next();             // 预检请求直接响应
// });
// server.js（Express 全局错误处理）
app.use((err, req, res, next) => {
    console.error("[全局错误捕获]:", err.stack);
    res.status(500).json({
        code: 500,
        msg: "服务器内部错误",
        error: process.env.NODE_ENV === 'development' ? err.message : null
    });
});
//文件上传中间件
const update = multer({
    dest:"./public/upload/temp"
})
app.use(update.any())
app.use(express.static(path.join(__dirname, "public")))

const ADMIN_TOKEN_PATH = "/token"
app.use(async (req, res, next) => {
    // console.log("执行了2")//问题：重复执行两次验证
    // console.log("[Middleware] Received Token:", req.headers.token);
    if (req.path.includes(ADMIN_TOKEN_PATH)) {//includes //startsWith
        try {
            // const token = req.headers.token
            // const token = req.headers.authorization?.replace('Bearer ', '')
            // app.js 中间件添加
            const token = req.headers.token || req.headers['Token'] || req.headers['token'];
            // 在中间件中添加日志
            // console.log('Received Headers:', req.headers);
            // console.log('Token Value:', token);
            console.log(token)
            const { result} = await tokenAdmin("SELECT * FROM admin WHERE token=?", [token]);
            // console.log(result)
            const useless ="无用"
            // console.log(useless)
            // console.log("result")//问题：重复执行两次验证
            if (result.length==0) {
                res.status(403).send({
                    code:403,
                    data:useless,
                    msg:"请先登录" });
                return;
            }
            next();
        } catch (error) {
            res.status(500).json({
                code:500,
                msg:"服务器错误" });
        }
    } else {
        next();
    }
})

const admin = require("./src/router/AdminRouter")//账户
app.use("/admin",admin)

const category = require("./src/router/CategoryRouter")//博客类型
app.use("/category",category)

const  blog = require("../server/src/router/blogRouter")//博客
app.use("/blog",blog)

const  upload = require("../server/src/router/uploadRouter")//博客
app.use("/upload",upload)


//根路由
app.get("/",(req,res)=>{
    res.send("Hello World");
})

app.listen(port,()=>{//监听一个端口
    console.log(`启动成功:http://localhost:${port}/`)
})