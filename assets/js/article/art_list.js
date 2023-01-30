(function () {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage
    // 定义一个查询参数对象，将来在请求数据时，需要将请求参数对象提交到服务器
    let q = {
        pagenum: 1,//页码值
        pagesize: 2,//	每页显示多少条数据
        cate_id: '',//文章分类的 Id
        state: '',//文章的状态，可选值有：已发布、草稿
    }
    initTable()
    initCate()
    // 定义一个补零方法
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个格式化时间的过滤器
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date)

        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }

    // 获取文章列表的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 渲染模板引擎
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // console.log('ok');
                // 渲染分页
                renderPage(res.total)
            }
        })
    }


    //初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                //渲染模板引擎
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //通过 layui 中的 render 方法重新渲染UI结构
                form.render()
            }
        })
    }

    //为 form-search 表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        //阻止默认提交事件
        e.preventDefault()
        // 获取新的提交数据
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        // 将新的提交数据修改到对应的查询参数对象中
        q.cate_id = cate_id
        q.state = state
        //重新渲染文章列表
        initTable()
    })

    //定义一个渲染分页的方法
    function renderPage(total) {
        //使用 laypage.render() 渲染分页
        laypage.render({
            elem: 'pageBox',//存放分页容器的ID
            count: total,//数据总个数
            limit: q.pagesize,//每页显示的数据个数
            curr: q.pagenum,//默认显示的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 页面发生切换时触发 jump 回调函数
            // 触发jump回调函数的方式有两种
            // 1、通过点击页码时触发
            // 2、调用 laypage.render() 方法时触发
            jump: function (obj, first) {
                // console.log(first);//返回布尔值
                //可以通过first 判断触发jump回调函数的方式
                //如果是true 则是通过 laypage.render() 触发的
                //如果返回undefined 则是通过点击的方式触发的

                // console.log(obj.curr)得到当前的页码
                //将当前页码赋值给查询参数所对应的属性中
                q.pagenum = obj.curr
                // console.log(obj.limit)//得到每页显示条数
                q.pagesize = obj.limit//将当前页码条数赋值给查询参数对象对应的属性
                // 判断触发 jump 回调函数的方式 避免发生死循环
                if (!first) {
                    initTable()
                }
            }
        })
    }

    //通过事件委托的方式为 删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数 用来判断当前页面的数据个数
        let len = $('.btn-delete').length
        // console.log(len)
        // 获取文章的 ID
        let id = $(this).attr('data-id')
        // console.log(id);
        // 提示是否删除
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败！')
                    }
                    layer.msg('删除成功！')
                    // 当删除数据成功时，需要判断当前页面是否还有数据，如果没有数据 需要将页码值 - 1 再进行渲染
                    // 当按钮的个数等于1 时 证明当前页面已经没有数据了
                    if (len === 1) {
                        // 页码数最小必须为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }

                    // 重新渲染列表数据
                    initTable()
                    layer.close(index)
                }
            })
        })

    })
})()