(function () {
    getUserinfo()
    let layer = layui.layer
    // 点击退出
    $('#btn_logout').on('click', function () {
        // 弹出提示框 是否退出
        layer.confirm('确定退出登陆？', { icon: 3, title: '提示' }, function (index) {
            // 清除本地缓存的 token
            localStorage.removeItem('token')
            // 跳转到登陆页面
            location.href = './login.html'
            // 关闭询问框
            layer.close(index);
        })
    })
})();

// 封装一个获取用户信息的函数
function getUserinfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            renderAvatar(res.data)
        },
        // 不论请求成功与否都会执行的compiete回调函数
        // complete: function(res) {
        //     if(res.responseJSON.status ===1 && res.responseJSON.message === '身份认证失败！') {
        //         // 清空本地缓存
        //         localStorage.removeItem('token')
        //         // 跳转到登陆页面
        //         location.href = './login.html'
        //     }
        // }
    })
}

// 封装一个渲染头像的函数
function renderAvatar(user) {
    // 渲染昵称
    let name = user.nickname || user.username
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需渲染头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 渲染文字头像
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
        $('.layui-nav-img').hide()
    }
}