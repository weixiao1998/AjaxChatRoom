Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function getQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r!=null) return r[2]; return '';
}

function logout() {
    $.ajax({
        method: 'GET',
        url: 'http://127.0.0.1:5050/user/logout',
        xhrFields:{withCredentials:true},
        success: (data, msg, xhr) => {
            if (data.code === 200) {
                window.location.href = "login.html"
            } else {
                alert("注销失败！")
            }
        },
        error: (xhr, err) => {
            console.log(xhr)
            console.log(err)
        }
    })
    sessionStorage.removeItem("user")
}

function updateOnline(){
    $.ajax({
        method: 'GET',
        url: 'http://127.0.0.1:5050/user/online',
        xhrFields:{withCredentials:true},
        success: (data, msg, xhr) => {
            let html = '<a href="#" class="list-group-item active">在线用户列表</a>'
            for(let each of data){
                html += `<a href="private.html?id=${each.id}" class="list-group-item">${each.nickname}</a>`
            }
            $('#onlineList').html(html)
        },
        error: (xhr, err) => {
            console.log(xhr)
            console.log(err)
        }
    })
}

function updatePublic(){
    $.ajax({
        method: 'GET',
        url: 'http://127.0.0.1:5050/public/getAll',
        xhrFields:{withCredentials:true},
        success: (data, msg, xhr) => {
            let html = ''
            for(let each of data){
                html += `<div class="media">
                        <div class="media-body">
                            <h5 class="media-heading"><b>【${each.nickname}】&nbsp&nbsp${new Date(each.time).Format("yyyy年MM月dd日 hh:mm:ss")}</b></h5>
                            <h5>${each.content}</h5>
                        </div>
                    </div>
                    `
            }
            $('#contentList').html(html)
            //$("#contentList").scrollTop($("#contentList")[0].scrollHeight);
        },
        error: (xhr, err) => {
            console.log(xhr)
            console.log(err)
        }
    })
}

function updatePrivate(){
    $.ajax({
        method: 'GET',
        url: 'http://127.0.0.1:5050/private/getAll',
        data: `id=${id}`,
        xhrFields:{withCredentials:true},
        success: (data, msg, xhr) => {
            if(data.code==200){
                let html = ''
                for(let each of data.result){
                    html += `<div class="media">
                            <div class="media-body">
                                <h5 class="media-heading"><b>【${each.ufrom==user1.id?user1.nickname:user2.nickname}】&nbsp&nbsp${new Date(each.time).Format("yyyy年MM月dd日 hh:mm:ss")}</b></h5>
                                <h5>${each.content}</h5>
                            </div>
                        </div>
                        `
                }
                $('#contentList').html(html)
                 //$("#contentList").scrollTop($("#contentList")[0].scrollHeight);
            } else {
                console.log("获取对话失败")
            }
        },
        error: (xhr, err) => {
            console.log(xhr)
            console.log(err)
        }
    })
}