/**
 * Created by Administrator on 2017/1/16.
 */
/*documentWidth = window.screen.availWidth;
documentHeight = window.screen.availHeight;*/

var city;
let currentCity;
let weatherInfo;
let updateTime;

//自适应手机
function preperForMobile() {
    console.log("width:"+documentWidth+"height:"+documentHeight);
    const loading = $("#waittips");
    const cityList = $("#citylist");

    //设置加载提示框的位置，隐藏加载框
    loading.css('top', documentHeight/2 - 24);
    loading.css('right', documentWidth/2 - 24);
    loading.css('display', 'none');

    $("#content").css('height', documentHeight - 130);        //设置中间部分高度自适应
    //设置底部横向tab栏宽度和城市下拉框的宽度及位置
    if (documentWidth > 700){
        $("#footer ul li").css('width', (documentWidth - 28)/7);
        cityList.css('width', 300);
        cityList.css('right', (documentWidth-300)/2);
    }else {
        $("#footer ul li").css('width', 100);
        cityList.css('width', documentWidth - 120);
        cityList.css('right', 65);
    }
}

//查询未来七天天气
async function queryWeather() {
    loading(true);
    const data = await sendRequest(`${SERVER_URL + PATH_FORECAST}?location=${currentCity.id}&key=${KEY}`, 'GET');
    console.log(data)
    loading(false);

    weatherInfo = data.daily;
    updateTime = formatDate(data.updateTime);
    updateBg(weatherInfo[0].iconDay, true);
    updateView(0);
    updateTab();
    updateCityNum();
}

async function queryCity(location) {
    const data = await sendRequest(`${SERVER_CITY}?location=${location}&key=${KEY}`, 'GET');
    let localCity = localStorage.getItem('localCity');
    if (!localCity) localCity = {};
    else localCity = JSON.parse(localCity);

    if (data.code === "200") {
        currentCity = data.location[0];
        const id = data.location[0].id;
        if (!localCity.hasOwnProperty(id)) {
            localCity[id] = currentCity;
        }
    } else {
        currentCity = {
            name: "北京",
            id: "101010100",
            adm1: "北京"
        }
        if (!localCity.hasOwnProperty("101010100")) {
            localCity[id] = currentCity;
        }
    }

    localStorage.setItem('localCity', JSON.stringify(localCity));

    console.log(currentCity.id, currentCity.name);
    $("#cityname").text(currentCity.adm1 + ' - ' + currentCity.name);
    queryWeather();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            queryCity(longitude.toFixed(2) + ',' + latitude.toFixed(2));
        }, (error) => {
            console.log(error);
            queryCity('beijing');
        });
    } else {
        console.log('Geolocation is not supported by this browser.');
        queryCity('beijing');
    }
}

//点击事件
function init() {
    //底部tab点击事件，点击切换查看七天天气
    $("#footer ul li").click(function () {
        removeSelection();
        $(this).addClass("select").siblings().removeClass("select");
        const footer = $("#footer");
        //让滚动条定位到所点击的位置
        footer.animate({
            scrollLeft: $(this).offset().left - footer.offset().left + footer.scrollLeft()
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
        if ($("#citylist").css("display") === "block"){
            $("#citylist").fadeOut();
        }else {
            $("#citylist").fadeIn();
        }
    });

    //鼠标点击事件
    $(document).click(function (e) {
        //设置当鼠标点击其他地方时隐藏下拉框
        if ($(e.target).attr("id") !== "cityname"){
            $("#citylist").fadeOut();
        }
    });

    //点击切换城市
    $("#citylist").on('click', 'span', function (e) {
        city = e.target.innerHTML;
        if (localStorage.getItem('0') === city){
            $("#cityname").addClass('location');
        }else {
            $("#cityname").removeClass('location');
        }
        $("#cityname").text(city);
        queryWeather();
    });
}

//更新背景图
function updateBg(code, save) {
    if (save){
        sessionStorage.setItem("bgcode", code);
    }
    setBgPic(code);
}

//更新底部七天天气信息
function updateTab() {
    $("#footer ul li").each(function () {
        var i = $(this).index();
        let forecastInfo = weatherInfo[i];
        if (forecastInfo) {
            $(this).children(".forc_tmp").text(forecastInfo.tempMin + "°" + " - " + forecastInfo.tempMax + "°");
            $(this).children(".forc_time").text(splitDate(forecastInfo.fxDate));
            $(this).children(".forc_code_d").attr('src', imgPath(forecastInfo.iconDay));
        } else {
            $(this).children(".forc_tmp").text('N/A');
            $(this).children(".forc_time").text('N/A');
            $(this).children(".forc_code_d").attr('N/A');
        }
    });
}

//更新界面显示信息
function updateView(x) {
    const info = weatherInfo[x];
    if ( x === 0 ){
        $("#txt_d").text("今天：" + info.textDay);
    }else if (x === 1){
        $("#txt_d").text("明天：" + info.textDay);
    }else {
        $("#txt_d").text(splitDate(info.fxDate)+"："+info.textDay);
    }
    $("#update").text(updateTime);
    $("#tmp").text(info.tempMin + "°" + " - " + info.tempMax + "°");
    $("#code_d").attr('src', imgPath(info.iconDay));
    updateBg(info.iconDay, false);
}

//更新下拉框城市个数
function updateCityNum() {
    let cityHtml = '';
    const localCity = JSON.parse(localStorage.getItem('localCity'));
    Object.keys(localCity).forEach((key) => {
        cityHtml += "<span>" + localCity[key].adm1 + " - " + localCity[key].name + "</span>"
    });
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

$(document).ready(function () {
    preperForMobile();
    init();
    getLocation();
});
