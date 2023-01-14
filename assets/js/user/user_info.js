(function () {
    let layer = layui.layer
    // 表单验证
    let form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return layer.msg('昵称长度必须在 1 ~ 6 个字符之间！')
            }
        }
    })

    // 初始化用户信息
    initUserInfo()

    // 封装一个获取用户信息的函数 初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return '获取用户信息失败！'
                }
                // 快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }


    // 重置功能
    $('#btnReset').on('click', function (e) {
        // 阻止默认重置事件
        e.preventDefault()
        // 初始化用户信息
        initUserInfo()
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function(e) {
        // 阻止表单的默认提交事件
        e.preventDefault()
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！')
                // 在子窗口调用父窗口的方法重新渲染用户名和头像
                window.parent.getUserinfo()

            }
        })
    })
})();

