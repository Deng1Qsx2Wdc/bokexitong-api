//此文件用作对博客文章的类型的操作，它汇总了所有的博客文章的类型，用来对博客的类别进行分类
const express = require("express")
const router = express.Router();
const {v4: uuidv4} = require("uuid")
const mysql = require("mysql2/promise.js")//E:/GeRenBoKe/bookending-test/server/db/DbUtils
const {allblog, updatecategory} = require("../../db/blog")
const FlakeId = require("flake-idgen");
//添加
router.post("/token/add", async (req, res) => {
            try {
                const {category_id, title, content} = req.body
                const create_time = new Date().getTime()

                const flakeIdGen = new FlakeId();//博客文章的ID
                const boke_id = flakeIdGen.next().toString("hex");

                const sqll = "insert into blog (boke_id,category_id , title ,content ,create_time) values (?,?,?,?,?)"
                const arr = [boke_id, category_id, title, content, create_time]

                const {result, err} = await allblog(sqll, arr)
                // console.log(result)
                if (err == null) {
                    res.status(200).send({
                        code: 200,
                        data: {result},
                        msg: "添加新博客成功"
                    })
                } else {
                    res.status(500).send({
                            code: 500,
                            data: {result},
                            msg: "添加新博客失败"
                        }
                    )
                }
            }catch (err){
                res.status(500).send({
                        code: 500,
                        msg: "添加错误"
                    }
                )
            }
})
//更新
router.post("/token/update", async (req, res) => {
    try {
        const {boke_id, category_id, title, content} = req.body
        const create_time = new Date().getTime()
        const sqll = " update blog set  category_id =?, title =? ,content = ? ,create_time = ? where boke_id = ? "
        const arr = [category_id, title, content, create_time, boke_id]
        const {err, cow} = await allblog(sqll, arr)
        if (err == null) {
            res.status(200).send({
                code: 200,
                msg: "更新新博客成功"
            })
        } else {
            res.status(500).send({
                    code: 500,
                    msg: "更新新博客失败"
                }
            )
        }
    }catch (err){
        res.status(500).send({
            code: 500,
            msg: "发送失败"
        })
    }
})
//删除
router.post("/token/delete", async (req, res) => {
    try {
        const {boke_id, title} = req.body
        console.log("boke_id", boke_id)
        console.log("title", title)
        const sqll = "delete from blog where boke_id = ? and title = ?"
        const arr = [boke_id, title]
        const {err, result} = await allblog(sqll, arr)
        if (err == null) {
            res.send({
                code: 200,
                msg: "删除新博客成功"
            })
        } else {
            res.send({
                    code: 500,
                    msg: "删除新博客失败"
                }
            )
        }
    }catch (err){
        res.status(500).send({
            code: 500,
            msg: "发送失败"
        })
    }
})

//查找文章
router.get("/seek", async (req, res) => {
    try {
        let {keyword, categoryID, page, pageSize} = req.query

        keyword = keyword || ""
        categoryID = categoryID || ""
        page = page !== 0?page:1
        pageSize = pageSize !== 0?pageSize:3

        let spli = "select * from blog "

        if(keyword.length>0 || categoryID !=="" )
                spli += " where"
        let arr = []
        let k = 0
        if (keyword.length>0) {
            spli += " title like ?"
            arr.push("%" + keyword + "%")
            k = 1
        }
        // console.log("spli")
        if (categoryID !=="") {
            if (k == 0) {
                spli += " category_id = ? "
                arr.push(categoryID)
            } else {
                spli += " and category_id = ? "
                arr.push(categoryID)
            }
        }
            //firstResult：解构后自定义的新变量名。result = firstResult
        const {result:firstResult,err:firstErr} = await allblog(spli, arr)//正常查询
        // console.log(firstErr)

       // console.log(sumber)
        spli = spli +" order by create_time DESC limit ?,? "
        arr.push((page - 1) * pageSize)
        // console.log(page)
        arr.push(Number(pageSize))

        const {result,err} = await allblog(spli, arr)//分页查询
        // console.log(result)
        if (err == null) {
            let sumber = 0
            for(let row of firstResult){
                sumber ++
            }
            res.send({
                code: 200,
                data:
                    {
                    result:result,
                    sumber:sumber,
                }
                ,
                msg: "查询成功"
            })
        } else {
            res.send({
                code: 500,
                data: result,
                msg: "查询失败"
            })
        }
    }catch (err){
        res.status(500).send({
            code: 500,
            msg: "发送失败"
        })
    }
})
//查找单个文章
router.get("/seeke", async (req, res) => {
    try {
        let {boke_id, page, pageSize} = req.query
        boke_id = boke_id || ""
        page = parseInt(page) || 1
        pageSize = parseInt(pageSize) || 3
        // console.log(boke_id)
        // console.log(page)
        // console.log(pageSize)

        let spli = "select * from blog where boke_id = ?  order by create_time DESC limit ?,? "
        let arr = [boke_id,(page - 1) * (Number(pageSize)), (Number(pageSize))]

        // console.log("执行了")
        const {result,err} = await allblog(spli, arr)
        // console.log(result)
        if (err == null) {
            res.status(200).send({
                code: 200,
                data: result,
                msg: "查询成功"
            })
        } else {
            res.status(500).send({
                code: 500,
                data: result,
                msg: "查询失败"
            })
        }
    }catch (err){
        res.status(500).send({
            code: 500,
            msg: "发送失败"
        })
    }
})
module.exports = router

