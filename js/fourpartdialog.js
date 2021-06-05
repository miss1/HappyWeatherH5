 /**
 * Created by Administrator on 2017/2/20.
 */

//弹出提示框
function alertFDialog(city) {
    fdialogHtml(city);
    btnClose();
}

//四格弹出框结构
function fdialogHtml(city) {
    var _fhtml = '';
    _fhtml += '<div id="fb_box"></div><div id="fb_con"><img src="../img/close.png" id="close"><table>';
    _fhtml += '<tr id="line1"><td class="line"><a href="../html/weatherPK.html"><img src="../img/weatherPK.png"></a></td>';
    _fhtml += '<td><a href="javascript:void(0);" onclick="jumpToLine(city)"><img src="../img/chartline.png"></a></td></tr>';
    _fhtml += '<tr><td class="line"><a href="https://miss1.github.io/outLinkPage/puzzle/"><img src="../img/weatherGame.png"></a></td>';
    _fhtml += '<td><a href="../html/historyTody.html"><img src="../img/historyTody.png"></a></td></tr>';
    _fhtml += '</table></div>';
    $("body").append(_fhtml);
    fdialogCss();
    $("#fb_box,#fb_con").fadeIn();
}

//四格弹出框样式
function fdialogCss() {
    $("#fb_box").css({ width: '100%', height: '100%', zIndex: '99999', position: 'fixed',
        filter: 'Alpha(opacity=60)', backgroundColor: 'black', top: '0', left: '0', opacity: '0.6', display: 'none'
    });
    $("#fb_con").css({ zIndex: '999999', position: 'fixed', display: 'none',
        backgroundColor: 'White', borderRadius: '15px'
    });
    $("#close").css({zIndex: '99999', position: 'fixed'});

    var _widht = document.documentElement.clientWidth;  //屏幕宽
    var _height = document.documentElement.clientHeight; //屏幕高
    if (_widht > 700){
        $("#fb_con").css('width', 400);
        $("#fb_con").css('height', 400);
    }else {
        $("#fb_con").css('width', _widht - 100);
        $("#fb_con").css('height', _widht - 100);
        $("#fb_con table img").css({width: '80px', height: '80px'});
    }
    //让提示框居中
    var boxWidth = $("#fb_con").width();
    var boxHeight = $("#fb_con").height();
    $("#fb_con").css({ top: (_height - boxHeight) / 2 + "px", left: (_widht - boxWidth) / 2 + "px" });
    $("#close").css({top: (_height - boxHeight) / 2 - 10 + "px", right: (_widht - boxWidth) / 2 - 10 + "px"});

    $("#line1").css({borderBottom: '1px solid #3db39e'});
    $(".line").css({borderRight: '1px solid #3db39e'});
    $("#fb_con table td").css({width: boxWidth/2, height: boxHeight/2, textAlign: 'center'});
}

//点击事件
function btnClose() {
    $("#close").click(function () {
        $("#fb_box,#fb_con").fadeTo("slow", 0.01, function () {
            $("#fb_box,#fb_con").remove();
        });
    });
}

//跳转到七天预报折线页面并将当前城市名传递过去
function jumpToLine(city) {
    window.location.href = "../html/weatherForecastLine.html?cityname="+city;
}
