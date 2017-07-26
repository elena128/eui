/*
 * =====================================
 * base.js    elena  QQ：329655021
 * 本项目用到的公共js片段
 * Version 0.1.0
 * =====================================
 */
// 各页面显示内容和方法
    var menu = {
        "text":{
            name:"文字样式",
            init:function(){
                $(".icon_close").click(function(){
                    $('#tips-1').remove();
                })
            }
        },
        "toolbar":{
            name:"首尾导航栏工具条",
            init:function(){
                $(".tab_btn_item,.tab_item").click(function(){
                    $(this).addClass("active").siblings().removeClass("active")
                })
                $("body").on("touchstart", function(e) {
                    e.preventDefault();
                    startX = e.originalEvent.changedTouches[0].pageX,
                    startY = e.originalEvent.changedTouches[0].pageY;
                });
                $("body").on("touchmove", function(e) {
                    e.preventDefault();
                    moveEndX = e.originalEvent.changedTouches[0].pageX,
                    moveEndY = e.originalEvent.changedTouches[0].pageY,
                    X = moveEndX - startX,
                    Y = moveEndY - startY;
                  
                    if ( Math.abs(X) > Math.abs(Y) && X > 0 ) {
                        alert("left 2 right");
                    }
                    else if ( Math.abs(X) > Math.abs(Y) && X < 0 ) {
                        alert("right 2 left");
                    }
                    else if ( Math.abs(Y) > Math.abs(X) && Y > 0) {
                        alert("top 2 bottom");
                    }
                    else if ( Math.abs(Y) > Math.abs(X) && Y < 0 ) {
                        alert("bottom 2 top");
                    }
                    else{
                        alert("just touch");
                    }
                });
            }
        },
        "layout":{
            name:"布局",
            init:function(){
                // 页面初始化
                    var goods = [
                        {id:"1",img:"image/liulangnan.png",o_price:"50.00",price:"30.00",title:"鲜美的小食品1",url:"index.html?goodid=0#detail",weight:"500.00",nums:10},
                        {id:"2",img:"image/sunshine.jpg",o_price:"55.00",price:"35.00",title:"鲜美的小食品2",url:"index.html?goodid=1#detail",weight:"500.00",nums:10},
                        {id:"3",img:"image/liulangnan.png",o_price:"40.00",price:"20.00",title:"鲜美的小食品3",url:"index.html?goodid=2#detail",weight:"500.00",nums:10},
                        {id:"4",img:"image/sunshine.jpg",o_price:"60.00",price:"40.00",title:"鲜美的小食品4",url:"index.html?goodid=3#detail",weight:"500.00",nums:10}
                    ];
                    if(!get_data("goods")){
                        set_data(goods,"goods");
                    }
                    var evalgoods = doT.template($("#goods_template").html());
                    $(".pros").html(evalgoods(goods))
                    cart_init();
                // 加入购物车
                    $(".pros").on("click",".addcart",function(){
                        var n = $(this).data("n");
                        addcart(1,goods[n]);
                    })
            }
        },
        "detail":{
            name:"商品详情",
            show:false,
            init:function(){
                // 页面初始化
                    var imgs = ["image/aui-icon.png","image/demo2.png","image/demo3.png","image/demo4.png","image/demo5.png","image/demo6.png",];
                    var goodsno = GetQueryString("goodid");
                    var goods_data = get_data("goods")[goodsno];
                    var evaldetail = doT.template($("#detail_template").html());
                    var evalswipe = doT.template($("#swipe_template").html());
                    $(".swipe").html(evalswipe(imgs))
                    $(".detail").html(evaldetail(goods_data))
                    swipe_init(i);
                    cart_init();
                // 改变数量
                    var total = 1;
                    $(".detail").on("click",".change_num",function(){
                        total += parseInt($(this).data("n"));
                        total = total<1?1:total;
                        $(".number").html(total);
                    })
                // 加入购物车
                    $(".detail_addcart").click(function(){
                        addcart(total,{id:goods_data.id,img:goods_data.img,o_price:goods_data.o_price,price:goods_data.price,title:goods_data.title,weight:goods_data.weight})
                    })
                // 直接购买
                    $(".gobuy").click(function(){
                        set_data({id:goods_data.id,img:goods_data.img,o_price:goods_data.o_price,price:goods_data.price,title:goods_data.title,weight:goods_data.weight,num:total,selected:true},"buy")
                        location.href ='index.html?type=gobuy#confirm';
                    })
            }
        },
        "form":{
            name:"表单",
            init:function(){
                // 随滑块更新range数值
                    $(".content").on("touchmove change mousemove",".range input",function(){
                        $(this).closest(".list_item").find(".range_value").html($(this).val())
                        $(this).next().show().html($(this).val())
                        var that = this;
                        setTimeout(function(){
                            $(that).next().hide()
                        },1000)
                    })
                // 邮箱输入提示
                    var str = $("#emailList").html();
                    $("#email").keyup(function(){
                        var con = $("#email").val().split("@")[0];
                        $("#emailList").html(str.replace(/\*/g,con))
                    })
                // 联动
                    var evalcity = doT.template($("#city_template").html());
                    level({ele:".content.list .level",data1:data1,data2:data2,level1:"idB",level2:"",level3:"",func:evalcity})
                // 大视频切割
                    $("input[name='video']").change(function(){
                        var file = $(this)[0].files[0],
                            name = file.name,
                            size = file.size,
                            succeed = 0;
                        var shardSize = 2 * 1024 * 1024,
                            shardCount = Math.ceil(size / shardSize);

                        for(var i = 0;i < shardCount;++i){
                            var start = i * shardSize,
                            end = Math.min(size, start + shardSize);
                            var form = new FormData();
                            form.append("data", file.slice(start,end));
                            form.append("name", name);
                            form.append("total", shardCount);
                            form.append("index", i + 1);
                            $.ajax({
                                url: "server/upload_video.php",
                                type: "POST",
                                data: form,
                                async: false,
                                processData: false,
                                contentType: false,
                                success: function(res){
                                    if(!res.message.error){console.log(res.message.path)
                                        // toast("ok",res.message.msg)
                                        // $(".video_preview").show().find("video").attr("src",res.message.path)
                                        // $("input[name='videosrc']").val(res.message.path)
                                    }
                                },
                                error: function(){
                                    alert('文件发送失败，请重新发送');
                                }
                            });
                        }
                    })
                // 提交form表单
                    $("#form").submit(function(e){
                        e.preventDefault();
                        with(this){
                            // 校验
                        }
                        $("input[name='imgstr']").val(imgs.join("%^"))
                        // 有上传文件时
                            var formData = new FormData($("#form")[0]);
                            $.ajax({
                                url: "send_data.php",
                                // url: "server/upload_image.php",
                                type: 'POST',
                                dataType: 'json',
                                data: formData,
                                contentType: false,
                                processData: false,
                                success: function (respond) {}
                            });
                        // 无上传文件时
                            // var formData = $("#form").serialize();
                            // $.post("send_data.php",formData,function(){

                            // },"json")
                    })
                // 选择图片
                    // 图片需要压缩(单文件)
                        var img_old=["image/l1.png","image/l2.png"],img_arr=[],imgs=[],evalImg = doT.template($("#img_template").html());
                        preview_img();
                        $(".imgs").on("change",".upload_btn input",function(){
                            var file = this.files[0];
                            var URL = window.URL || window.webkitURL;
                            // tobase64(file,function(res){
                            //     imgs.push(res);
                            // })
                            img_arr.push(URL.createObjectURL(file))
                            preview_img();
                            $(this).val("");
                        })
                    // 图片不需要压缩
                        // $(".imgs").on("change",".img_one input",function(){
                        //     var files = this.files;
                        //     var URL = window.URL || window.webkitURL;
                        //     // 多文件上传
                        //         // for (var i = 0; i < files.length; i++) {
                        //         //     var len = $(".imgs").find(".img_one").length;
                        //         //     $(".img_one").eq(len-1).addClass("preview").find("img").attr("src",URL.createObjectURL(files[i]))
                        //         //     if(len<9){
                        //         //         var ele = $(this).parent().clone();
                        //         //         if(i >= files.length-1){
                        //         //             ele.removeClass("preview").find("input").val("");
                        //         //         }else{
                        //         //             ele.removeClass("preview").find("input").remove();
                        //         //         }
                        //         //         ele.find("img").attr("src","");
                        //         //         $(".imgs").append(ele);
                        //         //     }
                        //         // }
                        //     // 单文件上传
                        //         var file = files[0];
                        //         var ele = $(this).parent().clone();
                        //         var len = $(".imgs").find(".img_one").length;
                        //         $(".img_one").eq(len-1).addClass("preview").find("img").attr("src",URL.createObjectURL(file))
                        //         if(len<2){
                        //             ele.find("input").val("");
                        //             $(".imgs").append(ele);
                        //         }
                        // })
                // 图片数组合并
                    function preview_img(){
                        $(".imgs").html(evalImg({img_old:img_old,img:img_arr,len:img_old.length+img_arr.length}));
                    }
                // 删除图片
                    // 图片需要压缩(单文件)
                        $(".imgs").on("click",".img_close",function(){
                            var i = $(this).data("i");
                            var t = $(this).data("t");
                            if(t){
                                img_old.splice(i,1);
                            }else{
                                imgs.splice(i,1);
                                img_arr.splice(i,1);
                            }
                            preview_img();
                        })
                    // 图片不需要压缩
                        // $(".img_close").on("click",function(){
                        //     $(this).parent().remove()
                        // })
                // 点击预览大图
                    // swipe配置项
                        // startSlide Integer (默认:0) - Swipe开始的索引
                        // speed Integer (默认:300) - 前进和后台的速度，单位毫秒.
                        // auto Integer - 自动滑动 (time in milliseconds between slides)
                        // continuous Boolean (默认:true) -是否可以循环播放（注：我设置为false好像也是循环的）
                        // disableScroll Boolean (默认:false) - 停止触摸滑动
                        // stopPropagation Boolean (默认:false) -停止事件传播
                        // callback Function - 回调函数，可以获取到滑动中图片的索引.
                        // transitionEnd Function - 在最后滑动转化是执行
                    var evalswipe = doT.template($("#swipe_template").html());
                    $(".imgs").on("click",".img_one img",function(){
                        var i = $(this).data("i");
                        open_popup();
                        $(".swipe").show().html(evalswipe(img_old.concat(img_arr)))
                        $(".position li").eq(i).addClass("on")
                        swipe_init(i);
                        var h = ($(window).height() - $(".swipe_e:first-child").height())/2;
                        $(".swipe_e").css("margin-top",h+"px")
                    })
                    $(".swipe").on("click",".swipe_close",function(){
                        $(".swipe").hide()
                        close_popup();
                    })
                // 编辑内容
                    $(".txtContent").focus(function(){
                        if($(this).html() == "说点什么吧"){
                            $(this).html("").removeClass("light")
                        }
                        $(".emoticon").hide()
                    })
                    $(".txtContent").blur(function(){
                        if($(this).html() == ""){
                            $(this).html("说点什么吧").addClass("light")
                        }
                    })
                    $(".image,input[name='video'],.posting").click(function(){
                        $(".emoticon").hide()
                    })
                // 表情模版
                    var evalEmoticon = doT.template($("#emoticon_template").text());
                    $(".emoticon").html(evalEmoticon())
                // 打开表情
                    $(".biaoqing").click(function(){
                        $(".emoticon").toggle()
                    })
                // 选择表情
                    $(".emoticon").on("click",".emo_b",function(){
                        if($('.txtContent').html() == "说点什么吧"){
                            $('.txtContent').removeClass("light").html('<img class="emo" src="'+$(this).attr("src")+'">');
                        }else{
                            $('.txtContent').append('<img class="emo" src="'+$(this).attr("src")+'">');
                            $(".emoticon").toggle()
                        }
                    })
                // 价格跟踪
                    var info = {no:1222,total_price:0,weight:0,price:0,records:[]};
                    var evalinfo = doT.template($("#info_template").text());
                    loaddata(".price_track_content",evalinfo,info);
                // 增加一行
                    $(".price_track_content").on("click",".addline",function(){
                        var len = info.records.length;
                        if(len && !checkedit()) return false;
                        var obj = {no:10000+len+1,type:"",weight:0,price:0};
                        info.records.push(obj);
                        cal()
                    })
                // 删除一行
                    $(".price_track_content").on("click",".delline",function(){
                        var len = info.records.length;
                        info.records.splice(len-1,1);
                        cal()
                    })
                // 检测编辑内容
                    function checkedit(){
                        var datas = info.records;
                        var len = datas.length;
                        var eles = $(".price_one");
                        var i = true;
                        for (var i = 0; i < len; i++) {
                            var ele = eles.eq(i).find("input");
                            for (var j = 0; j < ele.length; j++) {
                                var pattern = ele.eq(j).data("pattern");
                                var tips = ele.eq(j).data("tips");
                                var re = new RegExp(pattern);
                                if(!ele.eq(j).val()){
                                    alert("请输入必要项")
                                    ele.eq(j).focus();
                                    i = false;
                                    return false;
                                }else if(pattern && !re.test(ele.eq(j).val())){
                                    alert("请输入"+tips);
                                    ele.eq(j).focus();
                                    i = false;
                                    return false;
                                }
                            }
                            datas[i].type = ele.eq(0).val();
                            datas[i].weight = parseFloat(ele.eq(1).val());
                            datas[i].price = parseFloat(ele.eq(2).val());
                        }
                        return i;
                    }
                // 计算
                    function cal(){
                        var total = 0,weight = 0,price;
                        for (var i = 0; i < info.records.length; i++) {
                            total += info.records[i].weight*info.records[i].price;
                            weight += info.records[i].weight;
                        }
                        price = total/weight;
                        info.total_price = total;
                        info.weight = weight;
                        info.price = price||0;
                        loaddata(".price_track_content",evalinfo,info);
                    }
                // 评分
                    $(".icon_star").click(function(){
                        $(this).addClass("info").siblings().removeClass("info")
                        $.each($(".icon_star"),function(k,v){
                            $(".score").html(k+1)
                            if($(v).hasClass("info")){
                                return false
                            }
                            $(v).addClass("info")
                        })
                    })
            }
        },
        "wechat_form":{
            name:"微信表单样式",
            init:function(){
                // 根据选择日期计算包含多少半天
                    $("input[name='rsdate']").change(function(){console.log(11)
                        cal_days();
                    })
                    $("input[name='redate']").change(function(){
                        cal_days();
                    })
                    function cal_days(){
                        var date1 = new Date($("input[name='rsdate']").val());
                        var date2 = new Date($("input[name='redate']").val());
                        var days = Math.ceil((date2 - date1) /  1000  /  60  /  60  /24);
                        var h = '';
                        if(days > 0){
                            days = days+1;
                            for (var i = 0; i <= days; i++) {
                                h += '<option value="'+i+'">'+i+'</option>';
                            };
                            $("select[name='half']").html(h);
                        }
                    }
                // 新增回访记录
                    function add(ele,obj,no){
                        if(!check(ele,no)){
                            alert("请填入必要信息再添加");
                            return false;
                        }
                        $(obj).before($(ele).eq(0).clone());
                        setname(ele);
                        var len = $(ele).length;
                        $(ele).eq(len-1).find("input").val("");
                        $(".datetimepicker").each(function(){
                            var option = {
                                lang : "zh",
                                step : "10",
                                timepicker : true,
                                format : "Y-m-d"
                            };
                            $(this).datetimepicker(option);
                        });
                    }
                    function check(ele,no){
                        var i = true;
                        $(ele).each(function(k,v){
                            if(!$(v).find("input").eq(no).val()){
                                i = false;
                                return false;
                            }else{
                                i = true;
                            }
                        })
                        return i;
                    }
                    function setname(ele){
                        var names = $(ele).parent().data("name")
                        $(ele).each(function(k,v){
                            $(v).find("input").each(function(k1,v1){
                                $(v1).attr("name",names[k1]+(k+1))
                            })
                        })
                    }
                // 删除回访记录
                    function removeele(ele,obj){
                        var len = $(ele).length;
                        if(len <= 1){
                            alert("至少要填入一项");
                        }else{
                            $(obj).closest(ele).remove();
                        }
                        setname(ele);
                    }
                // 改变服务类型
                    $("select[name='type']").change(function(){
                        if($(this).val()==1){
                            $(".baseinfo").show();
                            $(".babyinfo").hide();
                        }else{
                            $(".baseinfo").hide();
                            $(".babyinfo").show();
                        }
                    })
                // 切换面板
                    $(".tab_btn_item").click(function(){
                        $(this).addClass("active").siblings().removeClass("active");
                        $(this).parent().parent().siblings(".tabnav_con").hide();
                        $("."+$(this).attr("for")).show();
                    })
                // 折叠面板
                    $(".fold_menu").click(function(){
                        $(this).toggleClass("arrow_up arrow_down");
                        $(this).next().toggle();
                    })
                // 计算文本域剩余可输入字数
                    $("textarea").keyup(function(){
                        var counter = $(this).val().length;
                        $(".text_left").text(200-counter);
                    })
                // 提交表单
                    $("#form").submit(function(e){
                        e.preventDefault();
                        var formData = new FormData($("#form")[0]);
                        console.log(formData);
                        $.ajax({
                            url: "{php echo $this->createMobileUrl('orderin')}",
                            type: 'POST',
                            data: formData,
                            async: false,
                            cache: false,
                            contentType: false,
                            processData: false,
                            dataType:"json",
                            success: function (respond) {
                                console.log(respond.message.error);
                                if (respond.message.error==0){
                                    alert(respond.message.msg);
                                    // window.location.href="{php echo $this->createMobileUrl('index',array('type'=>'s'))}";
                                }else{
                                    alert(respond.message.msg);
                                    location.reload();
                                }
                            },
                            error: function (respond) {

                            }
                        });
                    })
            }
        },
        "popover":{
            name:"弹出类（提示、菜单、选择）",
            init:function(){
                var className;
                $(".popup_open").click(function(){
                    className = $(this).data("p");
                    $(".popup").addClass(className).fadeIn()
                    $(".mask").show()
                })
                $(".toast_open").click(function(){
                    var icon = $(this).data("icon")
                    $(".toast").show().find(".icon").addClass("icon_"+icon).next(".toast_info").html();
                    setTimeout(function(){
                        $(".toast").hide().find(".icon").removeClass("icon_"+icon)
                    },2000)
                })
                $(".actionsheet_open").click(function(){
                    $(".actionsheet,.mask").show();
                    setTimeout(function(){
                        $(".actionsheet_menu").addClass("active");
                    },50)
                })
                $(".dialog_open").click(function(){
                    var type = $(this).data("type");
                    var content = $(this).data("content");
                    $(".mask").show()
                    switch(type){
                        case "text":
                            $(".dialog").fadeIn().find(".dialog_content").show().html(content);
                            break;
                        case "input":
                            $(".dialog").fadeIn().find("input").show().attr("name",content);
                            break;
                    }
                })
                $(".actionsheet_cancel").click(function(){
                    $(".actionsheet_menu").removeClass("active");
                    $(".actionsheet,.mask").fadeOut(400);
                })
                $(".dialog_btn").click(function(){
                    $(".mask,.dialog,.dialog .dialog_content,.dialog input").fadeOut(400)
                })
                $(".mask").click(function(e){
                    if(e.target == this){
                        className = $(this).data("p");
                        $(".actionsheet_menu").removeClass("active");
                        $(".popup,.mask,.dialog").fadeOut(400,function(){
                            $(".popup").removeClass(className)
                        })
                    }
                })
            }
        },
        "chat":{
            name:"聊天气泡",
            init:function(){}
        },
        "pull_refresh":{
            name:"下拉刷新",
            init:function(){
                var page = 0,evalList = doT.template($("#refresh_template").html());
                $(".pull_refresh").html(evalList(page*10));
                var pullRefresh = new mobileRefresh({
                    container: document.querySelector('.refresh_content'),
                    triggerDistance: 100,
                    type:"up"
                },function(){
                    setTimeout(function(){
                        page++;
                        $(".pull_refresh").prepend(evalList(page*10));
                        pullRefresh.cancelLoading();
                    },1500)
                })
            }
        },
        "iconfont":{
            name:"图标",
            init:function(){}
        },
        "wechat":{
            name:"微信",
            init:function(){}
        },
        "news_today":{
            name:"今日头条",
            init:function(){}
        },
        "zhihu":{
            name:"知乎首页",
            init:function(){}
        },
        "effect":{
            name:"一些特效",
            init:function(){
                var start = "2017-4-11 12:00:00";
                var end = "2017-4-11 12:01:02";
                var d = GetTimeDiff(start,end);console.log(d)
                countdown($(".time")[0],d);
            }
        },
        "address":{
            name:"地址管理",
            init:function(){
                // 城市联动数据初始化
                    if(typeof area !== 'undefined'){
                        var data_city = {},data_area = {};
                        for (var i = 0; i < area.length; i++) {
                            data_city[area[i].name] = {};
                            data_city[area[i].name].name = area[i].name;
                            data_city[area[i].name].data = {};
                            for (var j = 0; j < area[i].city.length; j++) {
                                data_city[area[i].name].data[area[i].city[j].name] = area[i].city[j].name;
                                data_area[area[i].city[j].name] = {};
                                data_area[area[i].city[j].name].name = area[i].city[j].name;
                                data_area[area[i].city[j].name].data = {};
                                for (var z = 0; z < area[i].city[j].county.length; z++) {
                                    data_area[area[i].city[j].name].data[area[i].city[j].county[z].name] = area[i].city[j].county[z].name;
                                }
                            }
                        }
                    }
                // 地址模版
                    var address_list = get_data("address")||[];console.log(address_list)
                    var editno = "",
                        evalcity = doT.template($("#city_template").html()),
                        evaladdress = doT.template($("#add_template").html()),
                        evaledit = doT.template($("#edit_template").html());
                    loaddata(".address_list",evaladdress,address_list);
                // 设为默认
                    $(".address_list").on("click",".address_default",function(){
                        var n = $(this).data("i")
                        for(var i=0;i<address_list.length;i++){
                            if(i == n){
                                address_list[i].default = 1;
                            }else{
                                address_list[i].default = 0;
                            }
                        }
                        loaddata(".address_list",evaladdress,address_list);
                        set_data(address_list,"address");
                        // ajax
                    })
                // 删除地址
                    $(".address_list").on("click",".address_del",function(){
                        var i = $(this).data("i")
                        if(confirm("真的要删除吗？")){
                            var n = (address_list[i].default==1) && true;
                            address_list.splice(i,1);
                            if(n && address_list.length){
                                address_list[0].default = 1;
                            }
                            loaddata(".address_list",evaladdress,address_list);
                            set_data(address_list,"address");
                            // ajax
                        }
                    })
                // 添加地址/编辑地址
                    $(".address_list").on("click",".address_edit",function(){
                        var i = $(this).data("i")
                        var data = typeof(i) !== "undefined"?address_list[i]:{};
                        $(".edit_address").show().html(evaledit(data));
                        level({ele:".select",data1:data_city,data2:data_area,level1:data.province||"",level2:data.city||"",level3:data.area||"",func:evalcity})
                    })
                // 地址编辑时取消
                    $(".edit_address").on("click",".address_quit",function(){
                        $(".edit_address").hide();
                    })
                // 提交地址
                    $(".edit_address").submit(function(e){
                        e.preventDefault();
                        with(this){
                            // 校验
                            var i = true;
                            $.each(this,function(k,v){
                                if($(v).attr("request")==""){
                                    if(!checkone(v)){
                                        i = false;
                                        return false;
                                    }
                                }
                            })
                            if(i){
                                //ajaxsubmit...
                                // 模拟存储数据
                                var data_submit = $(".edit_address").serializeObject();
                                if(!address_list.length){
                                    data_submit.default = 1;
                                }
                                if(editno===""){
                                    address_list.push(data_submit);
                                }else{
                                    address_list[editno] = data_submit;
                                }
                                set_data(address_list,"address");
                                $(".address_list").html(evaladdress(address_list));
                                $(".edit_address").hide();
                            }
                        }
                    })
                // 是否选择地址
                    if(GetQueryString("type") && GetQueryString("type") == "select"){
                        $(".address_list").on("click",".select_address",function(){
                            var i = $(this).data("i");
                            location.href="index.html?addressid="+i+"#confirm";
                        })
                    }
            }
        },
        "cart":{
            name:"购物车",
            init:function(){
                // 购物车模版
                    var carts = get_data("cart")||{total:0},evalcart = doT.template($("#mycart_template").html());;
                    if(typeof carts.allselected=="undefined"){
                        carts.allselected = 1;
                        carts.number = carts.total;
                    }
                    cal();console.log(carts)
                // 购物车增减
                    $(".cart").on("click",".change_num",function(){
                        var i = $(this).data("i"),n = $(this).data("type");
                        var num = carts[i].num;
                        var price = carts[i].price;
                        num += n;
                        if(num<1){
                            num = 1;
                        }else{
                            carts.total += n;
                        }
                        carts[i].num = num;
                        cal();
                    })
                // 计算总价
                    function cal(){
                        carts.number = 0,carts.totalprice = 0,carts.totalweight = 0;
                        every(carts,function(i){
                            if(carts[i].selected){
                                var number = carts[i].num;
                                var price = carts[i].price;
                                var weight = carts[i].weight;
                                carts.number += number;
                                carts.totalprice += price*number;
                                carts.totalweight += weight*number;
                            }
                        })
                        loaddata(".cart",evalcart,carts);
                        set_data(carts,"cart");
                    }
                // 单选
                    $(".cart").on("click",".selected",function(){
                        var i = $(this).data("i");
                        carts[i].selected = !carts[i].selected;
                        carts.allselected = 1;
                        every(carts,function(i){
                            if(!carts[i].selected){
                                carts.allselected = 0;
                            }
                        })
                        cal();
                    })
                // 全选
                    $(".cart").on("click",".allselected",function(){
                        carts.allselected = !carts.allselected;
                        every(carts,function(i){
                            carts[i].selected = carts.allselected;
                        })
                        cal();
                    })
                // 遍历函数
                    function every(data,callback){
                        for (var i in carts) {
                            if(i !== "total" && i!=="totalprice" && i!=="totalweight" && i!=="allselected" && i!=="number"){
                                callback(i)
                            }
                        }
                    }
                // 删除和移至收藏夹
                    $(".cart").on("click",".remove",function(){
                        if(!confirm("确定删除吗？")){
                            return false;
                        }
                        var n = [];
                        every(carts,function(i){
                             if(carts[i].selected){
                                n.push(i);
                            }   
                        })
                        if(n.length == 0){
                            alert("请选择")
                        }else{
                            // 1：删除，2：移至收藏夹
                            for (var j = n.length-1; j >= 0; j--) {
                                carts.total -= carts[n[j]].num;
                                delete carts[n[j]];
                            }
                            cal();
                            set_data(carts,"cart");
                        }
                    })
                // 提交函数
                    $(".cart").on("click",".settlement",function (){
                        if(carts.number){
                            location.href="index.html#confirm";
                        }else{
                            alert("购物车里暂时木有宝贝，快去添加吧")
                        }
                    })
            }
        },
        "confirm":{
            name:"订单确认",
            init:function(){
                // 自提点
                    var carrier_list = {"1":{realname:"廖英",mobile:"13326784467",address:"湖南省益阳市阮江市巴山西路园丁花园9017号(百合车站对面)微你云商体验店",remark:"为避免因商品缺货不能一次性提取，建议自提客户进行自提前至少提前按一个小时预约，确保商品完整。",selected:1},"2":{realname:"elena",mobile:"13325481173",address:"湖南省益阳市阮江市巴山西路园丁花园9017号(百合车站对面)微你云商体验店",remark:"为避免因商品缺货不能一次性提取，建议自提客户进行自提前至少提前按一个小时预约，确保商品完整。"}},
                        evalcarrier = doT.template($("#carrier_template").html());
                    loaddata(".carrier_list",evalcarrier,carrier_list);
                // 快递模版
                    var delivery_list = {"申通":{price:8.00,weight:2000,secondweight:1000,secondprice:2.00,selected:1},"韵达":{price:10.00,weight:2000,secondweight:1000,secondprice:"2.00"}},
                        evaldelivery = doT.template($("#delivery_template").text());
                    loaddata(".deliver_list",evaldelivery,delivery_list);
                // 订单模版
                    var address_list = get_data("address")||[];
                    var addressid = GetQueryString("addressid");
                    if(!addressid){
                        for (var i = 0; i < address_list.length; i++) {
                            if(address_list[i].default==1){
                                addressid = i;
                            }
                        }
                        addressid = addressid;
                    }
                    var order_info = {sendtype:1,address:address_list[addressid]||{},delivery:"申通",carrier:carrier_list["1"],allprice:0,freight:0,credit:20,reduce:0.2,cart:{}},
                        evalorder = doT.template($("#order_template").text());
                    if(GetQueryString("type") && GetQueryString("type") == "gobuy"){
                        var goods = get_data("buy");
                        order_info.cart["1"] = goods;
                        order_info.totalprice = F(goods.price)*goods.num;
                        order_info.totalweight = F(goods.weight)*goods.num;
                    }else{
                        var carts = get_data("cart");
                        delete carts.total;
                        delete carts.allselected;
                        delete carts.number;
                        for(var i in carts){
                            if(i!=='totalprice' && i!=='totalweight'){
                                order_info.cart[i] = carts[i]
                            }else{
                                order_info[i] = carts[i]
                            }
                        }
                    }
                    cal_total(order_info);
                    loaddata(".order_info",evalorder,order_info);
                // 选择快递或自提
                    $(".order_info").on("click",".select_sendtype",function(){
                        var n = $(this).data("n");
                        order_info.sendtype = n;
                        loaddata(".order_info",evalorder,cal_total(order_info));
                    })
                // 计算总价
                    function cal_total(d){
                        if(d.sendtype==1){
                            var delivery_one = delivery_list[d.delivery];
                            d.freight = I(d.totalweight)<I(delivery_one.weight)?F(delivery_one.price):F(delivery_one.price)+Math.ceil((I(d.totalweight)-I(delivery_one.weight))/I(delivery_one.secondweight))*F(delivery_one.secondprice);
                        }else{
                            d.freight = 0;
                        }
                        d.allprice = d.totalprice + d.freight;
                        return d;
                    }
                // 打开选择浮层
                    $(".order_info").on("click",".open_layer",function(){
                        var n = $(this).data("i");
                        open_popup();
                        switch(n){
                            case(2):var ele = ".carrier_list";break;
                            case(3):var ele = ".deliver_list";break;
                        }
                        $(ele).show();
                    })
                // 选择自提点、快递方式
                    $(".content").on("click",".select_para",function(){
                        var n = $(this).data("n"),i = $(this).data("i");
                        switch(n){
                            case(2):var ele = ".carrier_list";order_info.carrier = carrier_list[i];break;
                            case(3):var ele = ".deliver_list";order_info.delivery = i;break;
                        }
                        $(ele).hide();
                        close_popup()
                        loaddata(".order_info",evalorder,cal_total(order_info));
                    })
                // 是否使用积分抵扣
                    $("input[name='usecredit']").change(function(){
                        if($("input[name='usecredit']:checked").length){
                            order_info.allprice -= order_info.reduce;
                        }else{
                            order_info.allprice += order_info.reduce;
                        }
                        $(".allprice").html("￥"+order_info.allprice.toFixed(2))
                    })
                // 提交订单
                    $(".order_info").submit(function(e){
                        e.preventDefault();
                        with(this){
                            // 校验
                            var i = true;
                            $.each(this,function(k,v){
                                if($(v).attr("request")==""){
                                    if(!checkone(v)){
                                        i = false;
                                        return false;
                                    }
                                }
                            })
                            if(i){
                                //ajaxsubmit...
                                var data_submit = $(".order_info").serializeObject();
                                console.log(data_submit)
                            }
                        }
                    })
            }
        }
    };