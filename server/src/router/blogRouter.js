//此文件用作对博客文章的类型的操作，它汇总了所有的博客文章的类型，用来对博客的类别进行分类
const express = require("express")
const router = express.Router();
const {v4: uuidv4} = require("uuid")
const mysql = require("mysql2/promise.js")//E:/GeRenBoKe/bookending-test/server/db/DbUtils
const {allblog, updatecategory} = require("../../db/Dbblog")
const FlakeId = require("flake-idgen");
//添加
router.post("/add", async (req, res) => {
            const  { category_id , title , content  }  = req.body
            const create_time = new Date().getTime()

            const flakeIdGen = new FlakeId();//博客文章的ID
            const boke_id = flakeIdGen.next().toString("hex");

            const sqll = "insert into blog (boke_id,category_id , title ,content ,create_time) values (?,?,?,?,?)"
            const arr = [boke_id,category_id , title ,content ,create_time]

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
    const  { boke_id,category_id , title , content  }  = req.body
    const create_time = new Date().getTime()
    const sqll = " update blog set  category_id =?, title =? ,content = ? ,create_time = ? where boke_id = ? "
    const arr = [ category_id,title ,content,create_time,boke_id]
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
    const {boke_id,title} = req.body
    const sqll = "delete from blog where boke_id = ? and title = ?"
    const arr = [boke_id,title]
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

//查找文章
router.get("/seek", async (req, res) => {
    let {keyword, categoryID, page, pageSize} = req.body

    keyword = keyword || ""
    categoryID = categoryID || 0
    page = page != null || 1
    pageSize = pageSize || 10

    let spli = "select * from blog where  "

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
    spli = spli+ " order by create_time DESC limit ?,? "
    arr.push((page-1)*10)
    arr.push((Number(pageSize)))

    const {err,cow} = await  allblog(spli,arr)
    if(err==null){
        let seek = `delete
                   from category
                   where id = ?`
        res.send({
            code:200,
            msg:"查询成功",
            data:{
               cow,
                keyword,
                categoryID,
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

