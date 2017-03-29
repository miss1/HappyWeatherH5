/**
 * Created by Administrator on 2017/1/16.
 */
/*documentWidth = window.screen.availWidth;
documentHeight = window.screen.availHeight;*/

var city;
var weatherInfo;

$(document).ready(function () {
    preperForMobile();
    init();
    getLocation();
});

//自适应手机
function preperForMobile() {
    console.log("width:"+documentWidth+"height:"+documentHeight);
    
    //设置加载提示框的位置，隐藏加载框
    $("#waittips").css('top', documentHeight/2 - 24);
    $("#waittips").css('right', documentWidth/2 - 24);
    $("#waittips").css('display', 'none');
    
    $("#content").css('height', documentHeight - 130);        //设置中间部分高度自适应
    //设置底部横向tab栏宽度和城市下拉框的宽度及位置
    if (documentWidth > 700){
        $("#footer ul li").css('width', (documentWidth - 28)/7);
        $("#citylist").css('width', 300);
        $("#citylist").css('right', (documentWidth-300)/2);
    }else {
        $("#footer ul li").css('width', 100);
        $("#citylist").css('width', documentWidth - 120);
        $("#citylist").css('right', 65);
    }
}

//定位获取当前位置信息
function getLocation() {
    //实例化城市查询类
    var citysearch = new AMap.CitySearch();
    //自动获取用户IP，返回当前城市
    citysearch.getLocalCity(function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
            if (result && result.city) {
                console.log('个数：'+localStorage.length);
                if (localStorage.length > 1){
                    //当前定位城市与存储的所在城市不同，则更新当前城市
                    if (localStorage.getItem('0') != result.city){
                        if (localStorage.getItem(result.city) != undefined){
                            localStorage.setItem(localStorage.getItem('0'), localStorage.getItem('0'));
                            localStorage.setItem('0', result.city);
                            localStorage.removeItem(result.city);
                        }else {
                            localStorage.setItem(localStorage.getItem('0'), localStorage.getItem('0'));
                            localStorage.setItem('0', result.city);
                        }
                    }
                }else {
                    localStorage.setItem('0', result.city);
                }
                //localStorage.clear();
                city = result.city;
                queryWeather();
                console.log('您当前所在城市：'+city);
            }
        } else {
            if (localStorage.length > 1){
                city = localStorage.getItem('0');
            }else {
                localStorage.setItem('0', '北京');
                city = "北京";
            }
            queryWeather();
            console.log(result.info);
        }
        $("#cityname").text(city);
    });
}

//点击事件
function init() {
    //底部tab点击事件，点击切换查看七天天气
    $("#footer ul li").click(function () {
        removeSelection();
        $(this).addClass("select").siblings().removeClass("select");
        //让滚动条定位到所点击的位置
        $("#footer").animate({
            scrollLeft: $(this).offset().left - $("#footer").offset().left + $("#footer").scrollLeft()
        });
        updateView($(this).index());
    });
    
    //弹出四格框，选择进入相应功能界面
    $("#refresh").click(function () {
        alertFDialog(city);
    });
    
    //点击右上角图标弹出下拉框跳转到其他界面
    $("#more").click(function () {
        $("#droplist").slideDown();
    });
    $("#droplist a").click(function () {
        $("#droplist").slideUp();
    });
    
    //点击城市名称弹出下拉框切换城市
    $("#cityname").click(function () {
        if ($("#citylist").css("display") == "block"){
            $("#citylist").fadeOut();
        }else {
            $("#citylist").fadeIn();
        }
    });

    //鼠标点击事件
    $(document).click(function (e) {
        //设置当鼠标点击其他地方时隐藏下拉框
        if ($(e.target).attr("id") != "cityname"){
            $("#citylist").fadeOut();
        }
    });

    //点击切换城市
    $("#citylist").on('click', 'span', function (e) {
        city = e.target.innerHTML;
        if (localStorage.getItem('0') == city){
            $("#cityname").addClass('location');
        }else {
            $("#cityname").removeClass('location');
        }
        $("#cityname").text(city);
        queryWeather();
    });
}

//查询未来七天天气
function queryWeather() {
    console.log(SERVER_URL);
    $.ajax({
        type:'get',
        url:SERVER_URL + PATH_FORECAST + '?city=' + city + "&key=" + KEY,
        dataType:'json',
        beforeSend:function () {
            $("#waittips").css('display', 'block');
        },
        success:function (data) {
            weatherInfo = data;
            updateBg(weatherInfo.HeWeather5[0].daily_forecast[0], true);
            updateView(0);
            updateTab();
            updateCityNum();
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

//更新背景图
function updateBg(forecastInfo, issave) {
    if (issave){
        sessionStorage.setItem("bgcode", forecastInfo.cond.code_d);
    }
    setBgPic(forecastInfo.cond.code_d);
}

//更新底部七天天气信息
function updateTab() {
    $("#footer ul li").each(function () {
        var i = $(this).index();
        var forecastInfo = weatherInfo.HeWeather5[0].daily_forecast[i];
        $(this).children(".forc_tmp").text(forecastInfo.tmp.min + "°" + " - " + forecastInfo.tmp.max + "°");
        $(this).children(".forc_time").text(splitDate(forecastInfo.date));
        $(this).children(".forc_code_d").attr('src', imgPath(forecastInfo.cond.code_d));
    });
}

//更新界面显示信息
function updateView(x) {
    var forecastInfo = weatherInfo.HeWeather5[0].daily_forecast[x];
    if ( x == 0 ){
        $("#txt_d").text("今天：" + forecastInfo.cond.txt_d);
    }else if (x == 1){
        $("#txt_d").text("明天：" + forecastInfo.cond.txt_d);
    }else {
        $("#txt_d").text(splitDate(forecastInfo.date)+"："+forecastInfo.cond.txt_d);
    }
    $("#update").text(weatherInfo.HeWeather5[0].basic.update.loc);
    $("#tmp").text(forecastInfo.tmp.min + "°" + " - " + forecastInfo.tmp.max + "°");
    $("#code_d").attr('src', imgPath(forecastInfo.cond.code_d));
    updateBg(forecastInfo, false);
}

//更新下拉框城市个数
function updateCityNum() {
    var cityHtml = '';
    for (var i = 0; i < localStorage.length; i++){
        console.log("size:"+localStorage.key(i).length);
        if (localStorage.key(i).length < 5 && localStorage.key(i) != "null"){     //过滤掉地图以及bmob的信息
            cityHtml += "<span>" + localStorage.getItem(localStorage.key(i)) + "</span>"
        }
    }
    $("#citylist").html(cityHtml);
}

//移除选中状态
function removeSelection() {
    $("#footer ul li").each(function () {
        $(this).removeClass("select");
    });
}

//跳转到天气详情页面并将当前城市名传递过去
function jumpToWeatherDetail() {
    window.location.href = "../html/weatherDetail.html?cityname="+city;
}