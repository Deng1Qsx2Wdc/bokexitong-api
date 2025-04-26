//此文件用作对博客文章的类型的操作，它汇总了所有的博客文章的类型，用来对博客的类别进行分类
const express = require("express")
const router = express.Router();
const {v4: uuidv4} = require("uuid")
const mysql = require("mysql2/promise.js")//E:/GeRenBoKe/bookending-test/server/db/DbUtils
const FlakeId = require("flake-idgen");
//修改一个类型
router.post("/update", async (req, res) => {
    const {id, name} = req.body;
    const arr = [name, id]
    let connection;
    try {
        let updates = "update  category set name = ? where  id= ? "
        const {err, cow} = await allcategory(updates, arr)
    } catch (err) {
        console.error("修改错误", err)
        throw err
    } finally {
        if (connection)
            connection.release()
    }
})
//查找一个类型
router.post("/seek", async (req, res) => {
    const {name} = req.body;
    let connection;
    let deletes = `delete
                   from category
                   where name = ?`
    const {err, cow} = await updatecategory(deletes, name)
    if (err == null) {
        console.log(cow)
        res.send({
            code: 200,
            msg: "查找成功"
        })
    } else {
        res.send({
            code: 500,
            msg: "查找失败"
        })
    }
})
//删除一个类型
router.post("/delete", async (req, res) => {
    const {name} = req.body;
    let connection;
    let deletes = `delete
                   from category
                   where name = ?`
    const {err, cow} = await allcategory(deletes, name)
    if (err == null) {
        res.send({
            code: 200,
            msg: "删除成功"
        })
    } else {
        res.send({
            code: 200,
            msg: "删除失败"
        })
    }
})
//添加一个类型
router.post("/add", async (req, res) => {//当客户端发送一个post请求到/test时，Express会调用这个回调函数。
    try {
        const {name} = req.body
        let seek = " select * from category where name = ? "
        const {err, cow} = await allcategory(seek, name)
        if (err) {
            return res.status(400).send({
                code: 400,
                msg: "类型已存在"
            })
        }
        let adds = " insert into  category  (id,name) values (?,?)"

        const flakeIdGen = new FlakeId();
        const id = flakeIdGen.next().toString("hex");

        const arr =[id,name]
        const {errs, col} = await allcategory(adds, arr)
        if (errs == null) {
            res.send({
                code: 200,
                msg: "添加成功",
                data: col
            })
        } else {
            res.status(500).send({
                code: 500,
                msg: "添加失败"
            })
        }
    } catch (err) {
        console.log("登录错误：", err)
        res.status(500).send({
            code: 500,
            msg: "发送失败"
        })
    }
})
module.exports = router

//添加一个类型
// router.post("/add",async (req,res)=>{
//     const { name } = req.body;
//     async function addcategory() {
//         let connection;
//         try{
//             let  adds = `insert into category (name) values (?)`
//             const forval = uuidv4();
//             const arr = {forval, name}
//             const [result] = await connection.query(adds,arr)
//             return result.affectedRows > 0;
//         }
//         catch(err){
//             console.error("添加错误",err)
//             throw err
//         }finally{
//             if(connection)
//                 connection.release()
//         }
//     }
// })