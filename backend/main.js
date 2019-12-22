let mysql = require('mysql')

//使用第三方包提供的函数和对象
//创建数据库连接池
let pool = mysql.createPool({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "",
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
let session = require('express-session')
let port = 5050
server.listen(port, () => {
    console.log("服务器启动成功！正在监听端口：", port)
})


/********************************************** */
/*********************工具方法****************** */
/********************************************** */

//服务器数据
let online = []
let onlineTTL = 1000 * 60 * 10

//定时器清除非活跃用户
let schedule = require('node-schedule')
schedule.scheduleJob('0 * * * * *',()=>{
    for(let i=0;i<online.length;i++){
        let t = online[i]
        if(t.time<=Date.now()){
            online.splice(i,1)
            i--
        }
    }
})


function addOnline(user){
    for(let t of online){
        if(t.id == user.id){
            t.time = Date.now()+onlineTTL
            return
        }
    }
    online.push({id: user.id,nickname: user.nickname,time: Date.now()+onlineTTL})
}

function removeOnline(userid){
    for(let i=0;i<online.length;i++){
        if(online[i].id == userid){
            online.splice(i,1)
            return
        }
    }
}

/********************************************** */
/*********************后台API****************** */
/********************************************** */
//使用Express提供的中间件：处理POST请求中的主体数据，保存在req.body属性中
//处理application/x-www-form-urlencoded类型的请求数据
server.use(express.urlencoded({
    extended: false     //是否使用扩展工具解析请求主体
}))

//使用session
//server.set('trust proxy', 1)
server.use(session({
    name: 'ChatRoom',
    secret: 'ajax chat room secret',
    resave: true,
    saveUninitialized: true,
    cookie: { 
        secure: false,
        maxAge : onlineTTL
    }
}))

//登录拦截器
server.use((req,res,next)=>{
    if(req.url=='/user/login' || req.url=='/user/register' || req.session.user){
        next()
    } else {
        res.redirect(302,'http://127.0.0.1:5500/frontend/login.html')
        return
    }
})

//自定义中间件：允许指定客户端的跨域访问
server.use((req, res, next) => {
    res.set('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')  //当前服务器允许来自任何客户端的访问
    res.set("Access-Control-Allow-Credentials",'true');
    res.set("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
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

    let sql = 'SELECT * FROM cr_user WHERE username=? AND password=?'
    pool.query(sql, [username, password], (err, result) => {
        if (err) throw err
        if (result.length > 0) {
            req.session.user = result[0]
            req.session.loginTime = Date.now()
            addOnline(result[0])
            res.json({ code: 200, msg: '登录成功！', user: result[0] })
            return
        } else {
            res.json({ code: 400, msg: '用户名或密码错误！' })
            return
        }

    })
})

server.get('/user/logout',(req,res)=>{
    if(req.session.user){
        let userid = req.session.user.id
        removeOnline(userid)
        req.session.destroy()
    }
    res.json({ code: 200, msg: '注销成功！'})
})

server.get('/user/online',(req,res)=>{
    res.json(online)
})

server.get('/user/isLogin',(req,res)=>{
    if(res.session.user){
        res.json({code:200, msg: '用户已登录！'})
    } else {
        res.json({code:400, msg: '用户未登录！'})
    }
})


server.get('/user/getInfo',(req,res)=>{
    let id = req.query.id

    if(id==undefined || id==null){
        res.json({ code: 400, msg: '请求有误，id为空！'})
        return
    }

    let sql = 'SELECT * FROM cr_user WHERE id=?'
    pool.query(sql, [id], (err, result) => {
        if (err) throw err
        if(result.length>0){
            res.json({code:200 ,msg:"获取成功！", info:result[0]})
            return
        } else {
            res.json({code:500 ,msg:"获取失败！"})
            return
        }
    })
})

server.get('/public/getAll',(req,res)=>{
    let sql = 'SELECT cr_public.*,username FROM cr_public,cr_user WHERE cr_public.userid=cr_user.id AND time >= ? ORDER BY time'
    //let sql = 'SELECT cr_public.*,nickname FROM cr_public,cr_user WHERE cr_public.userid=cr_user.id ORDER BY time'
    pool.query(sql, [req.session.loginTime], (err, result) => {
        if (err) throw err
        res.json(result)
    })
})

server.post('/public/send',(req,res)=>{
    let user = req.session.user
    let content = req.body.content
    let time = Date.now()

    if(content==null || content==""){
        res.json({ code: 400, msg: '不能发空信息！'})
        return
    }

    let sql = 'INSERT INTO cr_public(userid,content,time) VALUES(?,?,?)'
    pool.query(sql, [user.id, content, time], (err, result) => {
        if (err) throw err
        if (result.affectedRows > 0) {
            res.json({ code: 200, msg: '发送成功！'})
            return
        } else {
            res.json({ code: 500, msg: '发送失败！' })
            return
        }
    })
})

server.get('/private/getAll',(req,res)=>{
    let uid1 = req.session.user.id
    let uid2 = Number(req.query.id)

    if(uid2==undefined || uid2==null){
        res.json({ code: 400, msg: '请求有误，id为空！'})
        return
    }
    if(uid2==NaN){
        res.json({ code: 401, msg: '请求有误！'})
        return
    }

    let sql = 'SELECT * FROM cr_private WHERE (ufrom=? AND uto=?) OR (ufrom=? AND uto=?) ORDER BY time'
    pool.query(sql, [uid1,uid2,uid2,uid1], (err, result) => {
        if (err) throw err
        res.json({code:200, result:result})
        return
    })
})


server.post('/private/send',(req,res)=>{
    let ufrom = req.session.user.id
    let uto = Number(req.body.uto)
    let content = req.body.content
    let time = Date.now()

    if(content==null || content==""){
        res.json({ code: 400, msg: '不能发空信息！'})
        return
    }
    if(uto==NaN){
        res.json({ code: 401, msg: '请求有误！'})
        return
    }

    let sql = 'INSERT INTO cr_private(ufrom,uto,content,time) VALUES(?,?,?,?)'
    pool.query(sql, [ufrom, uto, content, time], (err, result) => {
        if (err) throw err
        if (result.affectedRows > 0) {
            res.json({ code: 200, msg: '发送成功！'})
            return
        } else {
            res.json({ code: 500, msg: '发送失败！' })
            return
        }
    })
})


server.get('/test',(req,res)=>{
    console.log(req)
})
