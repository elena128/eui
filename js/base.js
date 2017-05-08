/*
 * =====================================
 * base.js    elena  QQ：329655021
 * 本项目用到的公共js片段
 * Version 0.1.0
 * =====================================
 */
// 城市联动数据初始化
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
// 添加地址/编辑地址
    function address(i){
        var data = typeof(i) !== "undefined"?address_list[i]:{};
        editno = typeof(i) !== "undefined"?i:"";
        $(".edit_address").show().html(evaledit(data));
        level({ele:".select",data1:data_city,data2:data_area,level1:data.province||"",level2:data.city||"",level3:data.area||"",func:evalcity})
    }
// 地址编辑时取消
    function quit(){
        $(".edit_address").hide();
    }
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
                if(editno===""){
                    address_list.push(data_submit);
                }else{
                    address_list[editno] = data_submit;
                }
                $(".address_list").html(evaladdress(address_list));
                $(".edit_address").hide();
            }
        }
    })
