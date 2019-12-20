//Node中无需指定package

//导入其他的包
let mysql = require('mysql')

//使用第三方包提供的函数和对象
//创建数据库连接池
let pool = mysql.createPool({
    host:"localhost",
    port:"3306",
    user:"root",
    password:"123456",
    database:"chatroom_db",
    connectionLimit:100  //连接池大小限制
})

/*
//测试：使用连接池查询数据库中的数据
let sql = "SELECT * FROM user"
pool.query(sql,(err,result)=>{
if(err) throw err
console.log(result)
})
console.log('脚本执行完毕')
*/
   
//导入第三方模块：express，创建基于node.js的web服务器
let express = require('express')

//调用第三方模块提供的功能
let server = express()

//运行web服务器监听端口
let port = 5050
server.listen(port,()=>{
    console.log("服务器启动成功！正在监听端口：",port)
})


server.post('/user/register',(req,res)=>{
    //读取客户端提交的请求数据
    let uname = req.body.uname
    let nickname = req.body.nickname2
    let upwd = req.body.upwd
    let repwd = req.body.repwd
    let sex = req.body.sex
    let age = req.body.age
    let hobby = req.body.hobby
    if(!uname){
        res.json({code:401,msg:'uname required'})
        return
    }
    if(!upwd){
        res.json({code:402,msg:'upwd required'})
        return
    }
    if(!nickname){
        res.json({code:403,msg:'nickname required'})
        return
    }
    if(!phone){
        res.json({code:404,msg:'phone required'})
        return
    }
    //执行数据库操作-SELECT
    let sql = 'SELECT uid FROM xz_user WHERE uname=? OR email=? OR phone=?'
    pool.query(sql,[uname,email,phone],(err,result)=>{
        if(err) throw err
        if(result.length>0){
            res.json({code:500, msg:'user already exists'})
            return
        }
        //执行数据库操作-INSERT
        sql = 'INSERT INTO xz_user(uname,upwd,email,phone) VALUES (?,?,?,?)'
        pool.query(sql,[uname,upwd,email,phone],(err,result)=>{
            if(err) throw err
            res.json({code:200, msg:'register succ', uid:result.insertId})
        })
    })
})