//此文件用作对博客文章的类型的操作，它汇总了所有的博客文章的类型，用来对博客的类别进行分类
const express = require("express")
const router = express.Router();
const{v4:uuidv4} = require("uuid")
const mysql =require("mysql2/promise.js")//E:/GeRenBoKe/bookending-test/server/db/DbUtils
const {queryAdmin,insertAdmin} = require("../../db/DbUtils")
//修改一个类型
router.post("/update",async (req,res)=>{
    const { id,name } = req.body;
    async function addcategory() {
        let connection;
        try{
            connection = await pool.getConnection();
            const sqll = `select * from category  set name = ? where id = ?`
            arr = {name,id}
            const [result] = await connection.query(sqll,arr)
            return result.affectedRows > 0;
        }
        catch(err){
            console.error("修改错误",err)
            throw err
        }finally{
            if(connection)
                connection.release()
        }
    }
})
//查找一个类型
router.post("/query",async (req,res)=>{
    const { name } = req.body;
    async function addcategory() {
        let connection;
        try{
            connection = await pool.getConnection();
            const sqll = `select * from category where name = ?`
            const [result] = await connection.query(sqll,name)
            return result.affectedRows > 0;
        }
        catch(err){
            console.error("查找错误",err)
            throw err
        }finally{
            if(connection)
                connection.release()
        }
    }
})
//删除一个类型
router.post("/delete",async (req,res)=>{
    const { name } = req.body;
    async function addcategory() {
        let connection;
        try{
            connection = await pool.getConnection();
            const sqll = `delete from category where name = ?`
            const [result] = await connection.query(sqll,name)
            return result.affectedRows > 0;
        }
        catch(err){
            console.error("删除错误",err)
            throw err
        }finally{
            if(connection)
                connection.release()
        }
    }
})
//添加一个类型
router.post("/add",async (req,res)=>{
    const { name } = req.body;
    async function addcategory() {
        let connection;
        try{
            connection = await pool.getConnection();
            const sqll = `insert into category (name) values (?)`
            const [result] = await connection.query(sqll,name)
            return result.affectedRows > 0;
        }
        catch(err){
            console.error("添加错误",err)
            throw err
        }finally{
            if(connection)
                connection.release()
        }
    }
})
module.exports = router