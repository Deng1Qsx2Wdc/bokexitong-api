//此文件用作对博客文章的类型的操作，它汇总了所有的博客文章的类型，用来对博客的类别进行分类
const express = require("express")
const router = express.Router();
const {v4: uuidv4} = require("uuid")
const mysql = require("mysql2/promise.js")//E:/GeRenBoKe/bookending-test/server/db/DbUtils
const FlakeId = require("flake-idgen");
const {allcategory,updatecategory,category} = require("../../db/DbCate")
const {queryAdmin} = require("../../db/Dbadmin");

//修改一个类型
router.post("/token/update", async (req, res) => {
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
router.post("/token/seek", async (req, res) => {
    const {name} = req.body;
    let deletes = `select *
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
//查找所有数据
router.post("/seekall", async (req, res) => {
    // console.log("执行了")
    try {
        const {name} = req.body
        const {result,err} = await category()
        // console.log("执行了")
        // console.log(result)
        if (result.length>0) {
            return res.status(200).send({
                code: 200,
                data:result,
                msg: "获取正确"
            })
        } else {
            return res.status(401).send({
                code: 401,
                data:result,
                msg: "获取错误"});
        }
    }catch(err){
        console.log("查询错误：",err)
        res.status(500).send({
            code:500,
            msg:"发送失败"
        })
    }
})
//删除一个类型
router.post("/token/delete", async (req, res) => {
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
router.post("/token/add", async (req, res) => {//当客户端发送一个post请求到/test时，Express会调用这个回调函数。
    // console.log("执行了1")
    try {
        const {name} = req.body
        let seek = " select * from category where name = ? "
        const arrs =[ name]
        // console.log(arrs)
        const {results1,err} = await allcategory(seek, arrs)
        // console.log("result3")
        // console.log(results1)
        // console.log("result1")
        if (results1.length !==0){
            // console.log("result2")
            return res.status(400).send({
                code: 400,
                msg: "类型已存在"
            })
        }else if(results1=== undefined){
            // console.log("啊？")
        }
        // console.log("result2")
        const flakeIdGen = new FlakeId();
        const id = flakeIdGen.next().toString("hex");

        let adds = " insert into  category  (id,name) values (?,?)"
        const arr =[id,name]
        const {results,errs} = await allcategory(adds, arr)
        // console.log(results)
        // console.log("result")
        if (errs == null) {
            res.send({
                code: 200,
                msg: "添加成功",
                data: results
            })
        } else {
            res.status(500).send({
                code: 500,
                msg: "添加失败"
            })
        }
    } catch (err) {
        console.log("添加错误：", err)
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