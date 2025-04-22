//此文件用作对博客文章的类型的操作，它汇总了所有的博客文章的类型，用来对博客的类别进行分类
const express = require("express")
const router = express.Router();
const {v4: uuidv4} = require("uuid")
const mysql = require("mysql2/promise.js")//E:/GeRenBoKe/bookending-test/server/db/DbUtils
const {allblog, updatecategory} = require("../../db/Dbblog")
const  { Genid } = require("../../utils/SnowFlake")
//插入
router.post("/add", async (req, res) => {
            const  { category_id , title , content  }  = req.query
            const create_time = new Date().getTime()
            const sqll = "insert into blog (category_id , title ,content ,create_time) values (?,?,?,?)"
            const arr = [category_id , title ,content ,create_time]
            const {err,cow} = await  allblog(sqll,arr)
            if(err==null){
                res.send({
                    code:200,
                    msg:"添加新博客成功"
                })
            }else{
                res.send({
                    code:500,
                    msg:"添加新博客失败"
                    }
                )
            }
})
//更新
router.post("/update", async (req, res) => {
    const  { id,category_id , title , content  }  = req.query
    const create_time = new Date().getTime()
    const sqll = " update blog set  category_id =?, title =? ,content = ? ,create_time = ? where id = ? "
    const arr = [ category_id,title ,content,create_time,id]
    const {err,cow} = await  allblog(sqll,arr)
    if(err==null){
        res.send({
            code:200,
            msg:"更新新博客成功"
        })
    }else{
        res.send({
                code:500,
                msg:"更新新博客失败"
            }
        )
    }
})
//删除
router.post("/delete", async (req, res) => {
    const {id,title} = req.query
    const sqll = "delete from blog where id = ? and title = ?"
    const arr = [id,title]
    const {err, cow} = await allblog(sqll, arr)
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
})
router.post("/delete", async (req, res) => {
    const {category_id, title, content} = req.query
    const creat_time = new Date().getTime()
    const sqll = "insert into blog (category_id , title ,content ,create_time) values (?,?,?,？)"
    const arr = [category_id, title, content, create_time]
    const {err, cow} = await allblog(sqll, arr)
    if (err == null) {
        res.send({
            code: 200,
            msg: "添加新博客成功"
        })
    } else {
        res.send({
                code: 500,
                msg: "添加新博客失败"
            }
        )
    }
})
router.get("/search", async (req, res) => {
    let {keyword, categoryID, page, pageSize} = req.query

    keyword = keyword || ""
    categoryID = categoryID || 0
    page = page != null || 1
    pageSize = pageSize || 10

    let searchstr = "select * from blog "

    let spli = "select * from blog "

    let arr = []
    let k = 0
    if (keyword) {
        spli += (" title like ?  ")
        arr.push("%" + keyword + "%")
        k = 1
    }

    if (categoryID) {
        if (k == 0) {
            spli += " category_id like ? "
            arr.push("%" + categoryID + "%")
        } else {
        spli += (" or category_id like ? ")
        arr.push("%" + categoryID + "%")
        k = 0
    }
}
    spli = spli+ " order by create_time DESC limit ?,?"
    arr.push((page-1)*10)
    arr.push((pageSize))

    const {err,cow} = await  allblog(spli,arr)
    if(err==null){
        res.send({
            code:200,
            msg:"查询成功",
            data:{
                title,
                keyword,
                categoryID,
                content,
                page,
                pageSize,
            }
        })
    }else{}
    res.send({
        code:500,
        msg:"查询失败"
    })
})

module.exports = router

