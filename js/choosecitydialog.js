/**
 * Created by Administrator on 2017/2/21.
 */
var cityinfo = '';

function alertCDialog(callback) {
    choosedialogHtml();
    initAllCity();
    selectCity();
    btnOK(callback);
    btnClose();
}

//弹出框结构
function choosedialogHtml() {
    var _chtml = '';
    _chtml += '<div id="c_box"></div><div id="c_con"><img src="../img/close.png" id="close">';
    _chtml += '<input id="c_input" type="text" placeholder="请输入城市名" oninput="onInput(event)"/>';
    _chtml += '<div id="c_content"><ul id="c_cityl"></ul></div>';
    _chtml += '<div><input id="c_btnok" type="button" value="确定"/></div>';
    _chtml += '</div>';

    $("body").append(_chtml);
    choosedialogCss();
    $("#c_box,#c_con").fadeIn();
}

//弹出框样式
function choosedialogCss() {
    $("#c_box").css({ width: '100%', height: '100%', zIndex: '99999', position: 'fixed',
        filter: 'Alpha(opacity=60)', backgroundColor: 'black', top: '0', left: '0', opacity: '0.6', display: 'none'
    });
    $("#c_con").css({ zIndex: '999999', position: 'fixed', display: 'none',
        backgroundColor: 'White', borderRadius: '15px'
    });
    $("#close").css({zIndex: '99999', position: 'fixed'});

    var _widht = document.documentElement.clientWidth;  //屏幕宽
    var _height = document.documentElement.clientHeight; //屏幕高
    if (_widht > 700){
        $("#c_con").css('width', 400);
        $("#c_con").css('height', 450);
    }else {
        $("#c_con").css('width', _widht - 100);
        $("#c_con").css('height', _widht - 50);
    }
    //让提示框居中
    var boxWidth = $("#c_con").width();
    var boxHeight = $("#c_con").height();
    $("#c_con").css({ top: (_height - boxHeight) / 2 + "px", left: (_widht - boxWidth) / 2 + "px" });
    $("#close").css({top: (_height - boxHeight) / 2 - 10 + "px", right: (_widht - boxWidth) / 2 - 10 + "px"});

    //弹出框内容部分
    $("#c_input").css({height: '30px', width: '80%', margin: '10px 8%', borderRadius: '5px', fontSize: '16px'});
    $("#c_content").css({width: '100%', height: '60%', overflowY: 'auto'});
    //$("#c_cityl li").css({color: '#888888', width: '100%', height: '30px', textAlign: 'center', lineHeight: '30px', fontSize: '18px'});
    $("#c_btnok").css({width: '50%', height: '30px', background: '#5DC4C4', color: 'white', margin: '10px 25%', border: 'none'});
}

//加载所有城市
function initAllCity() {
    $.getJSON(PATH_SEARCH, function (data) {
        cityinfo = data;
        var strHtml = '';
        $.each(cityinfo, function (index, info) {
            strHtml += "<li>" + info.cityZh + " - " + info.provinceZh + "</li>";
        });
        $("#c_cityl").html(strHtml);
    })
}

//根据输入显示搜索结果
function searchCity(key) {
    var strHtml = '';
    if (key != ''){
        $.each(cityinfo, function (index, info) {
            if (info.provinceZh.indexOf(key) >= 0 || info.cityZh.indexOf(key) >= 0){
                strHtml += "<li>" + info.cityZh + " - " + info.provinceZh + "</li>";
            }
        });
    }else {
        $.each(cityinfo, function (index, info) {
            strHtml += "<li>" + info.cityZh + " - " + info.provinceZh + "</li>";
        });
    }
    $("#c_cityl").html(strHtml);
}

//实时监听搜索框内容变化，进行搜索
function onInput(event) {
    searchCity(event.target.value);
}

//点击事件，点击列表选择城市
function selectCity() {
    $("#c_content ul").on('click', 'li', function (e) {
        $("#c_input").val(e.target.innerHTML.split(' ')[0]);
    })
}

//点击事件,关闭弹出框
function btnClose() {
    $("#close").click(function () {
        $("#c_box,#c_con").fadeTo("slow", 0.01, function () {
            $("#c_box,#c_con").remove();
        });
    });
}

//点击事件，确定按钮
function btnOK(callback) {
    $("#c_btnok").click(function () {
        var i = 0;
        $.each(cityinfo, function (index, info) {
            if (info.cityZh == $("#c_input").val()){
                i = 1;
                return;
            }
        });
        if (i == 0){
            toast("该城市不存在");
        }else {
            $("#c_box,#c_con").fadeTo("slow", 0.01, function () {
                $("#c_box,#c_con").remove();
            });
            if (typeof (callback) == 'function') {
                callback($("#c_input").val());
            }
        }
    })
}