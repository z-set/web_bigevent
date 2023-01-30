(function () {
    let layer = layui.layer
    let form = layui.form
    initArtCateList()
    // 封装一个获取后台数据 函数
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                let htmlStr = template('tpl-table', res)
                // console.log(res)
                $('tbody').html(htmlStr)
                // console.log(res);

            }
        })
    }

    let indexAdd = null
    let indexRedact = null
    // 为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#popups-add').html()
        })

    })

    // 因为表单是动态添加的 不能之间监听
    // 通过事件委托的方式 监听 form-add 表单的提交事件
    $('body').on('submit', '#form-add', function (e) {
        // 阻止默认提交
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    // layer.close(indexAdd)
                    return layer.msg('新增文章分类失败！')
                }
                // 重新渲染列表
                initArtCateList()
                layer.msg('新增文章分类成功！')
                // 关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 通过事件委托的方式监听  编辑按钮
    $('tbody').on('click', '.btn_redact', function () {
        // 弹出一个修改文章信息分类的层
        indexRedact = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类', 
            content: $('#popups-redact').html()
        })
        // 根据自定义属性获得对应的id值
        let id = $(this).attr('data-id')
        // 发起Ajax请求 
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取文章分类数据失败！')
                }
                form.val('form-redact', res.data)
            }
        })
    })

    // 通过事件委托的方式 监听 form-redact 表单的提交事件
    $('body').on('submit', '#form-redact', function(e) {
        // 阻止表单的默认提交事件
        e.preventDefault()
        // 发起Ajax请求 
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    // layer.close(indexRedact)
                    return layer.msg('更新分类信息失败！')
                }
                 // 重新渲染列表
                 initArtCateList()
                 layer.msg('更新分类信息成功！')
                // 关闭弹出层
                layer.close(indexRedact)
            }
        })
    })

    // 通过事件委托的方式 为删除按钮绑定点击事件
    $('tbody').on('click', '.btn_delete', function() {
        let id = $(this).attr('data-id')
        // 询问用户是否删除
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    // console.log(res);
                    if(res.status !== 0) {
                        return layer.msg('删除文章分类失败！')
                    }
                    layer.msg('删除文章分类失败！')
                    layer.close(index)
                    // 重新渲染数据
                    initArtCateList()
                }
            })
           
          })
    })


})();