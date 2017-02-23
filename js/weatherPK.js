/**
 * Created by Administrator on 2017/2/21.
 */

$(document).ready(function () {
    preperforMobile();
    init();
    loadprogressbar("myCanvas", 40, 40, 34, 20, 100, 20);
    setTimeout(function () {
        loadprogressbar("myCanvas1", 130, 70, 30, 20, 220, 20);
    },2000);

});

//自适应手机
function preperforMobile() {
    $("#pk_begin").css('height', documentHeight);
}

//绑定点击事件
function init() {
    //关闭本页面，返回上一页面
    $("#pk_close div").click(function () {
        history.go(-1);
    });

    //弹出选择城市框选择城市
    $("#pkcity_left").click(function () {
        alertCDialog(function (cityname) {
            $("#pkcity_left").text(cityname);
        })
    });
    $("#pkcity_right").click(function () {
        alertCDialog(function (cityname) {
            $("#pkcity_right").text(cityname);
        })
    });

    //开始pk按钮
    $("#pkcity_ok").click(function () {
        if ($("#pkcity_left").text() != "？" && $("#pkcity_right").text() != "？"){
            $("#page1").fadeOut();
            $("#page2").slideDown();
        }else {
            toast("请先选择要pk的城市");
        }
    });
}
