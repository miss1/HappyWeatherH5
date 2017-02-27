/**
 * Created by Administrator on 2017/2/21.
 */

var startX = 20;   //进度条距离画布左边缘的距离
var endX;          //进度条距离画布右边缘的距离
var y = 50;        //进度条距离画布上边缘的距离
var pheight = 46;  //进度条的宽度

var infoR;  //右边城市天气信息
var infoL;  //左边城市天气信息

var fireworkX;

$(document).ready(function () {
    preperforMobile();
    init();

});

//自适应手机
function preperforMobile() {
    $("#pk_begin").css('height', documentHeight);
    $(".pkcanvas").css('width', documentWidth - 120);
    if (documentWidth > 700){
        $(".pkitem canvas").css('width', 300);
        endX = 280;
        fireworkX = (documentWidth - 300)/2 + 80;
    }else {
        $(".pkitem canvas").css('width', documentWidth - 120);
        endX = documentWidth - 90;
        fireworkX = 100;
    }
}

//绑定点击事件
function init() {
    //关闭本页面，返回上一页面
    $("#pk_close div").click(function () {
        if ($("#page1").css('display') != 'none'){
            history.go(-1);
        }else {
            document.getElementById("tmpCanvas").getContext('2d').clearRect(0, 0, endX+20, 100);
            document.getElementById("visCanvas").getContext('2d').clearRect(0, 0, endX+20, 100);
            document.getElementById("hunCanvas").getContext('2d').clearRect(0, 0, endX+20, 100);
            document.getElementById("pmCanvas").getContext('2d').clearRect(0, 0, endX+20, 100);

            $("#progresscanvas").fadeOut();
            $("#prepertips").fadeIn();
            $("#page2").fadeOut();
            $("#page1").fadeIn();
        }
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
        var cityl = $("#pkcity_left").text();
        var cityr = $("#pkcity_right").text();
        if (cityl != "？" && cityr != "？" && cityl != cityr){
            $("#page1").fadeOut();
            $("#page2").fadeIn();
            $("#page2_cityl").text(cityl);
            $("#page2_cityr").text(cityr);
            infoL = "";
            infoR = "";
            postweatherinfo(cityl, true);
            postweatherinfo(cityr, false)
        }else {
            toast("请先选择要pk的城市");
        }
    });
}

//获取天气信息
function postweatherinfo(cityname, isleft) {
    $.ajax({
        type:'get',
        url:SERVER_URL + PATH_WEATHER + '?city=' + cityname + "&key=" + KEY,
        dataType:'json',
        success:function (data) {
            if (isleft){
                infoL = data;
            }else {
                infoR = data;
            }
            startprogress();
        },
        error: function (XMLHttpReuqest, textStautus, errothrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpReuqest.readyState);
            console.log(XMLHttpRequest.responseText);
            console.log(textStautus);
            console.log(errothrown);
        }
    });
}

//显示进度条PK界面
function startprogress() {
    if (infoL == "" || infoR == ""){
        return;
    }
    var leftdata = infoL.HeWeather5[0].now;
    var rightdata = infoR.HeWeather5[0].now;
    $("#prepertips").fadeOut();
    $("#progresscanvas").fadeIn();
    console.log(endX - startX);
    setTimeout(function () {
        loadprogressbar("tmpCanvas", calculateLeft(2, 5)["left"],
            calculateLeft(2, 5)["right"], pheight, startX, endX, y, fireworkX, 130);
    },1000);
    setTimeout(function () {
        loadprogressbar("visCanvas", calculateLeft(leftdata.vis, rightdata.vis)["left"],
            calculateLeft(leftdata.vis, rightdata.vis)["right"], pheight, startX, endX, y, fireworkX, 230);
    },7000);
    setTimeout(function () {
        loadprogressbar("hunCanvas", calculateLeft(leftdata.hum, rightdata.hum)["left"],
            calculateLeft(leftdata.hum, rightdata.hum)["right"], pheight, startX, endX, y, fireworkX, 330);
    },13000);
    setTimeout(function () {
        loadprogressbar("pmCanvas", calculateLeft(leftdata.wind.spd, rightdata.wind.spd)["left"],
            calculateLeft(leftdata.wind.spd, rightdata.wind.spd)["right"], pheight, startX, endX, y, fireworkX, 430);
    },19000);
}

//计算进度条左右长度的长度
function calculateLeft(leftdata, rightdata) {
    var canvalenth = endX - startX;
    var datalenth = parseInt(leftdata) + parseInt(rightdata);
    var multiply = digit(canvalenth / datalenth, 2);
    var calculateresult = {"left":multiply*parseInt(leftdata),"right":multiply*parseInt(rightdata)};
    return calculateresult;
}

//保留两位小数
function digit(digit, length) {
    length = length ? parseInt(length) : 0;
    if (length <= 0) return Math.round(digit);
    digit = Math.round(digit * Math.pow(10, length)) / Math.pow(10, length);
    return digit;
}
