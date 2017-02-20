/**
 * Created by Administrator on 2017/2/15.
 */

$(document).ready(function () {
    //设置加载提示框的位置，隐藏加载框
    $("#waittips").css('top', documentHeight/2 - 24);
    $("#waittips").css('right', documentWidth/2 - 24);
    $("#waittips").css('display', 'none');
    //左滑
    preperForMobile();
    touchWipe("list-li", "btn");
    init();
    loadAllWeather();
});

//自适应手机
function preperForMobile() {
    $("header h2").css('width', documentWidth - 98);
}

//点击事件绑定
function init() {
    //返回上一页
    $("#maback").click(function () {
        console.log("back");
        history.go(-1);
    });
    //删除
    $("body").on('click', '#city_ul .btn', function (e) {
        console.log(e.target.parentNode.id);
        var liid = e.target.parentNode.id;
        var txt = $("#"+liid+" .cityname").text();
        if (localStorage.getItem("0") == txt){
            toast("该城市为当前定位城市，不可删除");
            return;
        }else {
            localStorage.removeItem(txt);
            $("#"+liid).slideUp();
        }
    })
}

//获取所有已添加城市的天气
function loadAllWeather() {
    for (var i = 0; i < localStorage.length; i++){
        console.log(localStorage.getItem(localStorage.key(i)));
        if (localStorage.key(i) != '_AMap_maintcvdircgCitySearch'){
            queryWeather(localStorage.getItem(localStorage.key(i)), i)
        }
    }
}

//从服务器查询天气信息
function queryWeather(city, i) {
    $.ajax({
        type:'get',
        url:SERVER_URL + PATH_FORECAST + '?city=' + city + "&key=" + KEY,
        dataType:'json',
        beforeSend:function () {
            $("#waittips").css('display', 'block');
        },
        success:function (data) {
            updateView(city, data, i);
        },
        complete:function () {
            $("#waittips").css('display', 'none');
        },
        error: function (XMLHttpReuqest, textStautus, errothrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpReuqest.readyState);
            console.log(XMLHttpRequest.responseText);
            console.log(textStautus);
            console.log(errothrown);
            $("#waittips").css('display', 'none');
        }
    });
}

//刷新界面，将获取到的天气信息填充到界面
function updateView(name, info, i) {
    var weather = info.HeWeather5[0].daily_forecast[0];
    var _weatherhtml = '';
    _weatherhtml += "<li class='list-li' id='"+ i +"'><div class='con'><span class='cityname'>"+ name +"</span>";
    _weatherhtml += "<img src='"+ imgPath(weather.cond.code_d) +"'/>";
    _weatherhtml += "<span class='citytmp'>"+ weather.tmp.min + "°- " + weather.tmp.max + "°" + "</span>";
    _weatherhtml += "</div><div class='btn'>删除</div></li>";
    $("#city_ul").append(_weatherhtml);
    if (localStorage.getItem('0') == name){
        $("#"+i+" .cityname").addClass('citylocation');
    }
}