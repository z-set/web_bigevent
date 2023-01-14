(function () {
    let layer = layui.layer
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)


    //上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })

    // 给文件选择框绑定change事件
    $('#file').on('change', function (e) {
        // 获取用户选择的文件
        let filelist = e.target.files
        // console.log(filelist);
        if (filelist.length === 0) {
            layer.msg('请选择图片！')
        }
        // 拿到用户选择的文件
        let file = e.target.files[0]
        // 将文件转换为路径
        let imgURL = URL.createObjectURL(file)
        // console.log(imgURL);
        $image
            .cropper('destroy')    // 销毁旧的裁剪区域
            .attr('src', imgURL)// 重新设置图片路径
            .cropper(options)      // 重新初始化裁剪区域
    })

    // 为确定按钮绑定点击事件 上传图片 并渲染头像
    $('#btnUpload').on('click', function () {
        let dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 发起Ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新头像失败！')
                }
                layer.msg('更新头像成功！')
                window.parent.getUserinfo()
            }
        })
    })
})();