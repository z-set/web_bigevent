(function () {
    // 点击 去登录
    $('#link-login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })


    // 点击 去注册账号
    $('#link-reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 从layui中获得 form对象 layer弹出层对象
    let form = layui.form
    let layer = layui.layer
    // 通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫pwd的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 定义一个验证注册密码一直的校验规则
        repwd: function (value) {
            // 获取设置密码的值
            let pwd = $('.reg-box [name=password]').val()
            if (value !== pwd) {
                return '两次密码不一致'
            }
        }
    })


    // 监听注册表单的提交
    $('#reg_form').on('submit', function (e) {
        // 阻止表单默认提交行为
        e.preventDefault()
        // 发起POST请求
        let data = {
            username: $('#reg_form [name=username]').val(),
            password: $('#reg_form [name=password]').val()
        }
        $.post(
            '/api/reguser',
            data,
            function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg('注册成功，请登录！')
                // 跳转到登录页面
                $('#link-login').click()
                // 自动填充刚刚注册的用户名和密码
                $('.login-box [name=username]').val($('#reg_form [name=username]').val())
                $('.login-box [name=password]').val($('#reg_form [name=password]').val())
                // 重置注册面板
                $('#reg_form')[0].reset()
            }
        )
    })


    // 监听登陆表单的提交
    $('#form_login').on('submit', function(e) {
        // 阻止默认提交行为
        e.preventDefault()
        // 发起POST请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功')
                localStorage.setItem('token',res.token)
                location.href = './index.html'
            }
        })
    })
})();