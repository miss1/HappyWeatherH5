/**
 * Created by Administrator on 2017/2/27.
 */

var lastrueslt;
var querytimes = 0;

$(document).ready(function () {
    Bmob.initialize(APPLICATIONID, RESTAPIKEY);

    preperforMobile();
    init();

    querycomic();
});

//自适应手机
function preperforMobile() {
    $("#content").css('height', documentHeight - 70);
}

//事件监听
function init() {
    //返回上一页
    $("#back").click(function () {
        history.go(-1);
    });

    //滚动事件
    $("#content").scroll(function () {
        if ($(this).scrollTop() > $("#content_img").height() - documentHeight + 70 && $(this).scrollTop() < $("#content_img").height() - documentHeight + 80){
            console.log("滚动条已经到达底部："+$(this).scrollTop());
            if (getDate(querytimes + 1) == "2017-02-25"){
                $("#loading_tips").css('display', 'block');
                $("#loading_tips span").css('display', 'block');
                $("#loading_tips img").css('display', 'none');
                $("#loading_tips span").text("暂无更多");
            }else {
                if (lastrueslt != -1){
                    querytimes += 1;
                }
                querycomic();
            }
        }
    });
}

//从服务器获取漫画
function querycomic() {
    console.log(getDate(querytimes));
    $("#loading_tips").css('display', 'block');
    var commic = Bmob.Object.extend("comic");
    var query = new Bmob.Query(commic);
    query.equalTo("date", getDate(querytimes));
    query.find({
        success: function (object) {
            console.log("共查询到"+object.length+"条记录");
            lastrueslt = object.length;
            if (lastrueslt == 0 && getDate(querytimes + 1) != "2017-02-25"){
                querytimes += 1;
                querycomic();
            }else {
                $("#loading_tips").css('display', 'none');
                var _html = "<span>"+ getDate(querytimes) +"</span><span>"+ object[0].get("name") +"</span>";
                //var _html = "";
                if (documentWidth > 700){
                    for (var i = 0; i < object.length; i++){
                        _html += "<img src='"+ object[i].get("picurl")._url +"'>";
                    }
                }else {
                    for (var i = 0; i < object.length; i++){
                        _html += "<img src='"+ object[i].get("picurl")._url +"' style='width: "+ (documentWidth - 20) +"px'>";
                    }
                }
                $("#content_img").append(_html);
            }
        },
        error: function (object, error) {
            console.log("query fail");
            $("#loading_tips").css('display', 'none');
            lastrueslt = -1;
        }
    });
}