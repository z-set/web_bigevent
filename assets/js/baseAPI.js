// 每次调用$.get() $.post()或$.ajax()时，都会先调用$.ajaxPrefilter 这个函数，在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // 发起Ajax请求前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url

    // 判断是不是有需求的借口
    if (options.url.indexOf('/my/') !== -1) {
        // 统一为有权限的借口设置请求头 headers 
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载 complete 回调函数
    options.complete = function(res) {
        if(res.responseJSON.status ===1 && res.responseJSON.message === '身份认证失败！') {
            // 清空本地缓存
            localStorage.removeItem('token')
            // 跳转到登陆页面
            location.href = './login.html'
        }
    }

})