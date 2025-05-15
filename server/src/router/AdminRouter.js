const express = require("express")
const router = express.Router();
const{v4:uuidv4} = require("uuid")
const mysql =require("mysql2/promise.js")//E:/GeRenBoKe/bokexitong-test/server/db/DbUtils
const {queryAdmin,insertAdmin} = require("../../db/Dbadmin")
//一个处理put请求的路由，路径为/login，登录
router.put("/login1",async (req,res)=>{//当客户端发送一个post请求到/test时，Express会调用这个回调函数。
    try {
        const {acount, password} = req.body
        const arr = {
            acount,
            password,
        }
        const cow = await queryAdmin(arr)
        if (cow.length>0) {
            return res.status(200).send({
                code: 200,
                data:cow,

                msg: "账户和密码正确"
            })
        } else {
            return res.status(401).send({code: 401, msg: "账户或密码错误"});
        }
    }catch(err){
        console.log("登录错误：",err)
        res.status(500).send({
            code:500,
            msg:"发送失败"
        })
    }
})
//一个处理post请求的路由，路径为/login,注册
router.post("/login2",async (req,res)=>{//当客户端发送一个post请求到/test时，Express会调用这个回调函数。
    try{
        const {acount, password} = req.body
        const arr = {
            acount,
            password,
        }
        const cow = await queryAdmin(arr)
        if (cow.length>0) {
            return res.status(401).send({
                code:401,
                msg: "用户已存在"
            })
        }
        const   login_token = uuidv4();
        const arrs = {
            acount,
            password,
            login_token
        }
        const col = await insertAdmin(arrs)
        if(col){
            res.send({
                code:200,
                msg:"注册成功",
                 data:arr
            })
        }else{
            res.status(500).send({
                code:500,
                msg:"注册失败"
            })
        }
    }catch(err){
        console.log("登录错误：",err)
        res.status(500).send({
            code:500,
            msg:"发送失败"
        })
    }
})
module.exports = router