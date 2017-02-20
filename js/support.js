/**
 * Created by Administrator on 2017/1/16.
 */
documentWidth = window.innerWidth;
documentHeight = window.innerHeight;

var SERVER_URL = "https://free-api.heweather.com/v5";
var PATH_FORECAST = "/forecast";
var PATH_NOW = "/now";
var PATH_SUGGESTION = "/suggestion";
var PATH_SEARCH = "../json/city.json";
var KEY = "46ffe7931e3f4da38a47fa1554abcd59";

$(document).ready(function () {
    if (sessionStorage.getItem("bgcode") != undefined){
        setBgPic(sessionStorage.getItem("bgcode"));
    }else {
        setBgPic("101");
    }
});

//设置背景图
function setBgPic(code) {
    $("body").css('background', 'url("'+ bgPath(code) +'")');
    if (documentWidth > 700){
        $("body").css('background-size', 'auto '+documentHeight+'px');
        $("body").css('background-repeat', 'repeat-x');
    }else {
        $("body").css('background-size', documentWidth+'px '+documentHeight+'px');
        $("body").css('background-repeat', 'no-repeat');
    }
}

//获取url参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null){
        return decodeURI(r[2]);
    }
    return null;
}

//将时间去掉年份之后显示出来
function splitDate(data) {
    return data.split("-")[1] + "-" + data.split("-")[2];
}

//将时间去掉时分秒后显示出来
function splitDate1(data) {
    return data.split(" ")[0];
}

//根据天气代码返回相应的背景图片
function bgPath(code) {
    var path;
    console.log(code.substr(0, 1));
    switch (code.substr(0, 1)){
        case "1":
            path = "../img/bg_sunny.png";
            break;
        case "2":
            path = "../img/bg_thunder.png";
            break;
        case "3":
            path = "../img/bg_rain.png";
            break;
        case "4":
            path = "../img/bg_snow.png";
            break;
        case "5":
            path = "../img/bg_cloudynight.png";
            break;
        default:
            path = "../img/bg_sunny.png";
            break;
    }
    return path;
}

//根据天气代码返回相应的天气图标
function imgPath(code) {
    var path;
    switch (code){
        case "100":
            path = "../img/aoo.png";
            break;
        case "101":
            path = "../img/aoa.png";
            break;
        case "102":
            path = "../img/aob.png";
            break;
        case "103":
            path = "../img/aoc.png";
            break;
        case "104":
            path = "../img/aod.png";
            break;
        case "200":
            path = "../img/boo.png";
            break;
        case "201":
            path = "../img/boa.png";
            break;
        case "202":
            path = "../img/bob.png";
            break;
        case "203":
            path = "../img/boc.png";
            break;
        case "204":
            path = "../img/bod.png";
            break;
        case "205":
            path = "../img/boe.png";
            break;
        case "206":
            path = "../img/bof.png";
            break;
        case "207":
            path = "../img/bog.png";
            break;
        case "208":
            path = "../img/boh.png";
            break;
        case "209":
            path = "../img/boi.png";
            break;
        case "210":
            path = "../img/boj.png";
            break;
        case "211":
            path = "../img/bok.png";
            break;
        case "212":
            path = "../img/bol.png";
            break;
        case "213":
            path = "../img/bom.png";
            break;
        case "300":
            path = "../img/coo.png";
            break;
        case "301":
            path = "../img/coa.png";
            break;
        case "302":
            path = "../img/cob.png";
            break;
        case "303":
            path = "../img/coc.png";
            break;
        case "304":
            path = "../img/cod.png";
            break;
        case "305":
            path = "../img/coe.png";
            break;
        case "306":
            path = "../img/cof.png";
            break;
        case "307":
            path = "../img/cog.png";
            break;
        case "308":
            path = "../img/coh.png";
            break;
        case "309":
            path = "../img/coi.png";
            break;
        case "310":
            path = "../img/coj.png";
            break;
        case "311":
            path = "../img/cok.png";
            break;
        case "312":
            path = "../img/col.png";
            break;
        case "313":
            path = "../img/com.png";
            break;
        case "400":
            path = "../img/doo.png";
            break;
        case "401":
            path = "../img/doa.png";
            break;
        case "402":
            path = "../img/dob.png";
            break;
        case "403":
            path = "../img/doc.png";
            break;
        case "404":
            path = "../img/dod.png";
            break;
        case "405":
            path = "../img/doe.png";
            break;
        case "406":
            path = "../img/dof.png";
            break;
        case "407":
            path = "../img/dog.png";
            break;
        case "500":
            path = "../img/eoo.png";
            break;
        case "501":
            path = "../img/eoa.png";
            break;
        case "502":
            path = "../img/eob.png";
            break;
        case "503":
            path = "../img/eoc.png";
            break;
        case "504":
            path = "../img/eod.png";
            break;
        case "507":
            path = "../img/eog.png";
            break;
        case "508":
            path = "../img/eoh.png";
            break;
        case "900":
            path = "../img/ioo.png";
            break;
        case "901":
            path = "../img/ioa.png";
            break;
        case "999":
            path = "../img/iii.png";
            break;
        default:
            path = "../img/iii.png";
            break;
    }
    return path;
}