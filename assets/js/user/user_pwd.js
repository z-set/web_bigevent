(function () {
    let layer = layui.layer
    let form = layui.form

    // 密码框验证
    form.verify({
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        },
    })

    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        // 阻止默认提交事件
        e.preventDefault()
        // 发起ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // layer.msg('更新密码成功！')
                // 重置表单
                $('.layui-form')[0].reset()
                // 转到登陆页面 重新登陆
                window.parent.goLogin() 
            }
        })
    })

})();