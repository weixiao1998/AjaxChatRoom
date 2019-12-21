let mysql = require('mysql')

//使用第三方包提供的函数和对象
//创建数据库连接池
let pool = mysql.createPool({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "123456",
    database: "chatroom_db",
    connectionLimit: 100  //连接池大小限制
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
let server = express()

//运行web服务器监听端口
let port = 5050
server.listen(port, () => {
    console.log("服务器启动成功！正在监听端口：", port)
})


/********************************************** */
/*********************后台API****************** */
/********************************************** */
//使用Express提供的中间件：处理POST请求中的主体数据，保存在req.body属性中
//处理application/x-www-form-urlencoded类型的请求数据
server.use(express.urlencoded({
    extended: false     //是否使用扩展工具解析请求主体
}))
//自定义中间件：允许指定客户端的跨域访问
server.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*')  //当前服务器允许来自任何客户端的访问
    next()  //放行，让后续的请求处理方法继续处理
})

server.post('/user/register', (req, res) => {
    //读取客户端提交的请求数据
    let username = req.body.username
    let nickname = req.body.nickname
    let password = req.body.password
    let repwd = req.body.repwd
    let sex = req.body.sex
    let age = Number(req.body.age)
    let hobby = req.body.hobby
    if (!username) {
        res.json({ code: 401, msg: '需要填写用户名' })
        return
    }
    if (!password) {
        res.json({ code: 402, msg: '需要填写密码' })
        return
    }
    if (!nickname) {
        res.json({ code: 403, msg: '需要填写昵称' })
        return
    }
    if (!sex) {
        res.json({ code: 404, msg: '需要填写性别' })
        return
    }
    if (!age) {
        res.json({ code: 405, msg: '需要填写年龄' })
        return
    }

    if (password != repwd) {
        res.json({ code: 450, msg: '两次输入的密码不一致！' })
        return
    }
    if (age < 1 || age > 150) {
        res.json({ code: 451, msg: '年龄有误！' })
        return
    }

    //执行数据库操作-SELECT
    let sql = 'SELECT id FROM cr_user WHERE username=?'
    pool.query(sql, [username], (err, result) => {
        if (err) throw err
        if (result.length > 0) {
            res.json({ code: 500, msg: '用户名已经存在！' })
            return
        }
        //执行数据库操作-INSERT
        sql = 'INSERT INTO cr_user(username,nickname,password,sex,age,hobby) VALUES (?,?,?,?,?,?)'
        pool.query(sql, [username, nickname, password, sex, age, hobby], (err, result) => {
            if (err) throw err
            res.json({ code: 200, msg: '注册成功!', id: result.insertId })
            console.log(`${username} 注册成功！`)
        })
    })
})

server.post('/user/login', (req, res) => {
    let username = req.body.username
    let password = req.body.password

    if (!username) {
        res.json({ code: 401, msg: '需要填写用户名' })
        return
    }
    if (!password) {
        res.json({ code: 402, msg: '需要填写密码' })
        return
    }

    //执行数据库操作-SELECT
    let sql = 'SELECT * FROM cr_user WHERE username=? AND password=?'
    pool.query(sql, [username, password], (err, result) => {
        if (err) throw err
        console.log(result)
        if (result.length > 0) {
            res.json({ code: 200, msg: '登录成功！', user: result[0] })
            return
        } else {
            res.json({ code: 400, msg: '用户名或密码错误！' })
            return
        }

    })
})