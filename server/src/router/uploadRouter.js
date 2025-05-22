const express = require("express")
const router = express.Router();
const {v4: uuidv4} = require("uuid")
const fs = require("fs")
const path = require(("path"))
const mysql = require("mysql2/promise.js")//E:/GeRenBoKe/bookending-test/server/db/DbUtils
const {allblog, updatecategory} = require("../../db/blog")
const FlakeId = require("flake-idgen");

router.post("/editor_upload",async (req,res)=>{
   // console.log(req.files)
    try {
        if (!req.files) {
            res.send({
                "errno": 1,
                "message": "失败信息"
            })
            return;
        }
        const list = req.files;//接收文件
        const sex = [];//记录文件的路径，以供后续使用
        for (let file of list) {//文件是可能分多段接收过来的，使用的使用也需要分开使用
            let file_last = path.extname(file.originalname).slice(1);//获取文件后缀
            let fileds = new FlakeId().next();//生成随机ID
            let filed = fileds.toString('hex')
            let cop = filed + "." + file_last;//生成随机文件名

            //将文件名替换为随机文件名并储存在置顶位置
            fs.renameSync(
                path.join(process.cwd(), "public", "upload", "temp", file.filename),//描定指定文件
                path.join(process.cwd(), "public", "upload", "icons", cop)//将文件名替换为cop，并储存在指定位置
            )

            sex.push("/upload/icons/" + cop)//记录的是文件的路径
            console.log(sex)
        }
        res.send({
            "errno": 0, // 注意：值是数字，不能是字符串
            "data": {
                "url": sex[0]
            }
        })
    }catch (err){
        res.status(500).send({
            code:500,
            message: err,
        })
    }
})

module.exports = router