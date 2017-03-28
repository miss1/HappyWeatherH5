/**
 * Created by Administrator on 2017/2/14.
 */
var city;
var weatherInfo;
var suggesstionInfo;

$(document).ready(function () {

    //自适应手机
    $("#content").css('height', documentHeight - 80);
    //设置加载提示框的位置，隐藏加载框
    $("#waittips").css('top', documentHeight/2 - 24);
    $("#waittips").css('right', documentWidth/2 - 24);
    $("#waittips").css('display', 'none');

    console.log("cityname:" + getUrlParam('cityname'));
    city = getUrlParam('cityname');
    queryDetailWeather();
    querySuggesstion();
    init();
});

//点击事件
function init() {

    //tab点击事件,切换查看各项生活建议
    $("#suggesstion_title ul li").click(function () {
        removeSelection();
        $(this).addClass("suggesstion_selector").siblings().removeClass("suggesstion_selector");
        updateSuggesstionView($(this).index());
    });

    //返回按钮点击事件
    $("#header img").click(function () {
        history.go(-1);
    });
}

//查询天气详情
function queryDetailWeather() {
    $.ajax({
        type:'get',
        url:SERVER_URL + PATH_NOW + '?city=' + city + "&key=" + KEY,
        dataType:'json',
        beforeSend:function () {
            $("#waittips").css('display', 'block');
        },
        success:function (data) {
            weatherInfo = data;
            updateWeatherView();
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

//查询生活建议
function querySuggesstion() {
    $.ajax({
        type:'get',
        url:SERVER_URL + PATH_SUGGESTION + '?city=' + city + "&key=" + KEY,
        dataType:'json',
        beforeSend:function () {
            $("#waittips").css('display', 'block');
        },
        success:function (data) {
            suggesstionInfo = data;
            updateSuggesstionView(0);
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

//更新天气详情界面显示信息
function updateWeatherView() {
    var nowWeatherInfo = weatherInfo.HeWeather5[0].now;
    if (localStorage.getItem('0') == city){
        $("#cityname").addClass('locationcity');
    }else {
        $("#cityname").removeClass('locationcity');
    }
    $("#cityname").text(city);
    $("#time").text("today: " + splitDate1(weatherInfo.HeWeather5[0].basic.update.loc));
    $("#weather_icon img").attr('src', imgPath(nowWeatherInfo.cond.code));
    $("#weather_word span").each(function () {
        switch ($(this).index()){
            case 0:
                $(this).text("温度：" + nowWeatherInfo.tmp + "°");
                break;
            case 1:
                $(this).text("体感温度：" + nowWeatherInfo.fl + "°");
                break;
            case 2:
                $(this).text("相对湿度：" + nowWeatherInfo.hum + "%");
                break;
            case 3:
                $(this).text("风力风向：" + nowWeatherInfo.wind.dir + nowWeatherInfo.wind.sc + "级");
                break;
            case 4:
                $(this).text("降水量：" + nowWeatherInfo.pcpn + "mm");
                break;
            case 5:
                $(this).text("能见度：" + nowWeatherInfo.vis + 'km');
                break;
        }
    });
}

//更新生活建议界面显示信息
function updateSuggesstionView(x) {
    var suggesstion = suggesstionInfo.HeWeather5[0].suggestion;
    switch (x){
        case 0:
            $("#suggesstion_detail span").html(suggesstion.comf.brf + '<br/>' + suggesstion.comf.txt);
            break;
        case 1:
            $("#suggesstion_detail span").html(suggesstion.drsg.brf + '<br/>' + suggesstion.drsg.txt);
            break;
        case 2:
            $("#suggesstion_detail span").html(suggesstion.cw.brf + '<br/>' + suggesstion.cw.txt);
            break;
        case 3:
            $("#suggesstion_detail span").html(suggesstion.flu.brf + '<br/>' + suggesstion.flu.txt);
            break;
        case 4:
            $("#suggesstion_detail span").html(suggesstion.sport.brf + '<br/>' + suggesstion.sport.txt);
            break;
        case 5:
            $("#suggesstion_detail span").html(suggesstion.trav.brf + '<br/>' + suggesstion.trav.txt);
            break;
        case 6:
            $("#suggesstion_detail span").html(suggesstion.uv.brf + '<br/>' + suggesstion.uv.txt);
            break;
    }
}

//移除选中状态
function removeSelection() {
    $("#suggesstion_title ul li").each(function () {
        $(this).removeClass("suggesstion_selector");
    });
}
