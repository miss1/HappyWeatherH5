/**
 * Created by Administrator on 2017/2/14.
 */
var toast_id = 0;

//toast
function toast(message, duration) {
    window.clearTimeout(toast_id);
    if ($("#app_toast") != undefined){
        //上次toast未消失,此时强制停止动画并删除该元素
        $("#app_toast").stop();
        $("#app_toast").remove();
    }
    //设置超时时间
    duration = duration == null ? "short" : duration;
    if (duration == "short"){
        duration = 2000;
    }else if (duration == "long"){
        duration = 5000;
    }
    ToastHtml(message);
    toast_id = window.setTimeout(function () {
        $("#app_toast").fadeOut(200, function () {
            $("#app_toast").remove();
            toast_id = 0;
        })
    }, duration)
}

//toast结构
function ToastHtml(message) {
    var _toasthtml = '';
    _toasthtml += '<div id="app_toast"><span type="button" id="app_txt_toast">'+ message +'</span></div>';
    $("body").append(_toasthtml);
    ToastCss();
}

//toast样式
function ToastCss() {
    $("#app_toast").css({position: 'fixed', top: '89%', textAlign: 'center', width: '95%', zIndex: '99'});
    $("#app_txt_toast").css({paddingLeft: '20px', paddingRight: '20px', borderRadius: '8px', fontSize: '16px',
        opacity: '0.2', height: '30px', background: '#000000', color: '#ffffff', border: 'none', zIndex: '100'
    });
    $("#app_txt_toast").animate({height: '29px', lineHeight: '29px', opacity: '0.7'}, 200, function(){});
    $("#app_toast").animate({top: '85%'}, 200, function(){});　　//制作一个toast从底部滑动效果
}

