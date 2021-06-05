/**
 * Created by Administrator on 2017/2/27.
 */
var city;

var dataTmpmax = [];
var dataTmpmin = [];
var datasr = [], datasrafter = [];
var datass = [], datassafter = [];
var datavis = [];

$(document).ready(function () {
    preperforMobile();
    init();
    console.log("cityname:" + getUrlParam('cityname'));
    city = getUrlParam('cityname');
    $("#other").text(city);
    queryWeather();
});

//自适应手机
function preperforMobile() {
    $("#content").css('height', documentHeight - 115);
    if (documentWidth > 700){
        $(".chartline").css('width', 500);
        $("#chartitle").css('width', 570);
        $(".chartline canvas").css('width', 500)
    }else {
        $(".chartline").css('width', 320);
        $("#chartitle").css('width', documentWidth);
        $(".chartline canvas").css('width', 320)
    }
    $("#chartitle span").css('width', $("#chartitle").width()/7);
}

//事件监听
function init() {
    //返回上一页
    $("#back").click(function () {
        history.go(-1);
    });

    //点击滚动条定位到相应位置
    $(".chartline").click(function () {
        console.log($(this).offset().top);
        $("#content").animate({
            scrollTop: $(this).offset().top - $("#content").offset().top + $("#content").scrollTop()
        });
    });
}

//查询未来七天天气信息
function queryWeather() {
    $.ajax({
        type:'get',
        url:SERVER_URL + PATH_FORECAST + '?city=' + city + "&key=" + KEY,
        dataType:'json',
        beforeSend:function () {

        },
        success:function (data) {
            console.log(data);
            updateChartitle(data);
            startDrawLine(data);
        },
        complete:function () {
            $("#loading_tips").css('display', 'none');
            $("#content_vediol").css('display', 'block')
        },
        error: function (XMLHttpReuqest, textStautus, errothrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpReuqest.readyState);
            console.log(XMLHttpRequest.responseText);
            console.log(textStautus);
            console.log(errothrown);
            $("#loading_tips").css('display', 'none');
            $("#content_vediol").css('display', 'block')
        }
    });
}

//更新折线头部时间信息
function updateChartitle(data) {
    $("#chartitle span").each(function () {
        var i = $(this).index();
        var forecastInfo = data.HeWeather5[0].daily_forecast[i];
        if (forecastInfo) {
            $(this).text(splitDate(forecastInfo.date));
        } else {
            $(this).hide();
        }
    });
}

//开始画折线
function startDrawLine(data) {
    filldata(data);
    drawchatline("forcast_tmpmax", dataTmpmax, [], 1);

    setTimeout(function () {
        scollposition();
        drawchatline("forcast_tmpmin", dataTmpmin, [], 1);
    }, 2000);

    setTimeout(function () {
        scollposition();
        drawchatline("forcast_sr", datasr, datasrafter, 3)
    }, 4000);

    setTimeout(function () {
        scollposition();
        drawchatline("forcast_ss", datass, datassafter, 3);
    }, 6000);

    setTimeout(function () {
        drawchatline("forcast_vis", datavis, [], 2);
    }, 8000);
}

//滚动条定位
function scollposition() {
    $("#content").animate({
        scrollTop: 311 - $("#content").offset().top + $("#content").scrollTop()
    });
}

//填充数据
function filldata(data) {
    for (var i = 0; i < data.HeWeather5[0].daily_forecast.length; i++){
        var forecastInfo = data.HeWeather5[0].daily_forecast[i];
        dataTmpmax.push(parseInt(forecastInfo.tmp.max));
        dataTmpmin.push(parseInt(forecastInfo.tmp.min));
        datavis.push(parseInt(forecastInfo.vis));
        datasr.push(parseInt(timeToInt(forecastInfo.astro.sr)));
        datass.push(parseInt(timeToInt(forecastInfo.astro.ss)));
    }
    datasrafter = filleTimedata(datasr);
    datassafter = filleTimedata(datass);
}

//处理时间数据（七个数据中同时存在6:59和7:01这样的情况时）
function filleTimedata(datas) {
    var aftersdata = [];
    var max = parseInt(Math.max.apply(null, datas)/100);
    var min = parseInt(Math.min.apply(null, datas)/100);
    if (max != min){
        for (var i = 0; i < datas.length; i++){
            if (parseInt(datas[i]/100) == max){
                aftersdata.push(datas[i]%100 + 60);
            }else {
                aftersdata.push(datas[i]%100);
            }
        }
    }
    return aftersdata;
}
