(function () {
    let layer = layui.layer
    let form = layui.form

    initCate()
    // 初始化富文本编辑器
    initEditor()

    // 封装一个获取文章类别的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                // 渲染模板引擎
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //通过 layui 中的 render 方法重新渲染UI结构
                form.render()
            }
        })
    }


    // 1. 初始化图片裁剪器
    let $image = $('#image')

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 未选择封面绑定点击事件
    $('.btn-cover').on('click', function () {
        $('[type=file]').click()
    })

    // 监听 file文件选择框的 change 事件
    $('[type=file]').on('change', function (e) {
        // 声明变量存储用户选择的文件
        let files = e.target.files
        console.log(files[0])

        // 判断用户是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据选择的文件，创建一个对应的 URL 地址
        let newImgURL = URL.createObjectURL(files[0])
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 声明一个变量指定文章状态
    let art_status = '已发布'

    // 监听存为草稿按钮的点击事件
    $('#btn-draft').on('click', function () {
        // 当点击存为草稿时 将状态改为草稿
        art_status = '草稿'
    })

    // 监听 form-pub 表单的 submit 事件
    $('#form-pub').on('submit', function (e) {
        // 阻止默认提交事件
        e.preventDefault()
        // 利用 FormData 获得表单的值
        let fd = new FormData($(this)[0])
        // 追加状态
        fd.append('state', art_status)
        // 
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
            })
        //调用发布文章的方法
        publishArticle(fd) 
    })

    // 封装一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 使用  FormData 对象管理表单数据时 必须有contentType 和 processData 两个属性 不然请求会失败
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(res);
                if(res.status !== 0) {
                    return layer.msg('文章发布失败！')
                }
                layer.msg('文章发布成功！')
                //跳转到文章列表页面
                location.href = '../article/art_list.html'
            }
        })
    }
})()