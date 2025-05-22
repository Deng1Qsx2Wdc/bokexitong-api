const mysql =require("mysql2/promise.js")
const querystring = require("querystring");
const GenId = require("../utils/SnowFlake")

const pool = mysql.createPool({//数据库连接池，能够复用数据库连接，避免频繁建立/断开连接的开销
    connectionLimit: 10,
    host     : "localhost",
    user     : "root",
    password : "123456",
    database : "demo1",
    port     : "3306"
});
//增删查
async function allblog(sell,arr=[])  {
    let connection;
    try{
        connection = await pool.getConnection();
        const [result] = await connection.query(sell,arr)//返回的结果是一个数组，包含 结果对象 和 字段元数据 两部分
        // console.log(result)
        return {result};
    }
    catch(err){
        console.error("程序错误",err)
        throw err
    }finally{
        if(connection)
            connection.release()
    }
}
//改
async function updateblog(sell,arr = []) {
    let connection;
    try{
        connection = await pool.getConnection();
        const [result] = await connection.query(sell,arr)//返回的结果是一个数组，包含 结果对象 和 字段元数据 两部分
        return {result};
    }
    catch(err){
        console.error("程序错误",err)
        throw err
    }finally{
        if(connection)
            connection.release()
    }
}
module.exports = { allblog,updateblog };//将pool和genid导出文件，可以在其他文件中使用

