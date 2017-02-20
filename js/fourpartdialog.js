/**
 * Created by Administrator on 2017/2/20.
 */

//弹出提示框
function alertFDialog() {
    fdialogHtml();
    btnClose();
}

//四格弹出框结构
function fdialogHtml() {
    var _fhtml = '';
    _fhtml += '<div id="fb_box"></div><div id="fb_con"><img src="../img/close.png" id="close"><table>';
    _fhtml += '<tr id="line1"><td class="line"><a href="#"><img src="../img/minionl.png"></a></td>';
    _fhtml += '<td><a href="#"><img src="../img/minion.png"></a></td></tr>';
    _fhtml += '<tr><td class="line"><a href="#"><img src="../img/minionl.png"></a></td>';
    _fhtml += '<td><a href="#"><img src="../img/minion.png"></a></td></tr>';
    _fhtml += '</table></div>';
    $("body").append(_fhtml);
    fdialogCss();
}

//四格弹出框样式
function fdialogCss() {
    $("#fb_box").css({ width: '100%', height: '100%', zIndex: '99999', position: 'fixed',
        filter: 'Alpha(opacity=60)', backgroundColor: 'black', top: '0', left: '0', opacity: '0.6'
    });
    $("#fb_con").css({ zIndex: '999999', position: 'fixed',
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
        $("#fb_box,#fb_con").remove();
    });
}