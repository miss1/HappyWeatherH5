/**
 * Created by Administrator on 2017/3/1.
 */

var month;
var date;

$(document).ready(function () {
    var curDate = new Date();
    month = curDate.getMonth() + 1;
    date = curDate.getDate();
    $("#h_head span").text(month + "-" + date);
    preperforM();
    queryHistory();
});

//自适应手机
function preperforM() {
    //设置加载提示框的位置，隐藏加载框
    $("#waittips").css({top: documentHeight/2 - 24, right: documentWidth/2 - 24, display: 'none'});

    $("#h_page2").css('height', documentHeight - 50);
    if (documentWidth > 700){
        $("#h_detail").css('width', 500);
        $("#hd_img img").css('max-width', 500);
    }else {
        $("#h_detail").css('width', documentWidth - 10);
        $("#hd_img img").css('max-width', documentWidth - 10);
    }
}

//查询所有数据
function queryHistory() {
    $.ajax({
        type:'get',
        url:H_SERVER_URL + '?key=' + H_KEY + '&date=' + month + '/' + date,
        dataType:'jsonp',
        data:'',
        jsonp:'callback',
        beforeSend:function () {
            $("#waittips").css('display', 'block');
        },
        success:function (data) {
            initViewpage1(data);
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

//将查询的数据显示到界面上，界面1
function initViewpage1(data) {
    var h_html = "";
    for (var i in data.result){
        //console.log(data.result[i].title);
        h_html += "<div class='box'><div class='box-content'>";
        h_html += "<span class='time'>"+ data.result[i].date +"</span>";
        h_html += "<span class='happend'>"+ data.result[i].title +"</span>";
        h_html += "</div></div>";
    }
    $("#h_box").append(h_html);
    prepercssPage1();
    initclick(data);
}

//设置瀑布流位置
function prepercssPage1() {
    $("#h_box").css('height', documentHeight - 50);
    if (documentWidth > 700){
        $("#h_box").css('width', 500);
        $(".box-content").css('width', 144);
    }else {
        $("#h_box").css('width', documentWidth - 10);
        $(".box-content").css('width', (documentWidth - 76)/3);
    }
    var boxHeightArr = [];      //得到所有图片高度
    $(".box-content").each(function (index) {
        var boxheight = Math.random() * 100 + 150;
        $(this).css('height', boxheight);
        if (index < 3){
            boxHeightArr[index] = boxheight + 30;
        }else {
            var minHeight = Math.min.apply(null, boxHeightArr);
            var minIndex = getminHeightLocation(boxHeightArr, minHeight);
            $(this).css({position: 'absolute', top: minHeight, left: $(".box-content").eq(minIndex).position().left - 4});
            boxHeightArr[minIndex] = boxHeightArr[minIndex] + $(this).height() + 20;
        }
    });
}

//得到最小高度图片的位置
function getminHeightLocation(boxHeightAttr, minHeight) {
    for (var i in boxHeightAttr){
        if (boxHeightAttr[i] == minHeight){
            return i;
        }
    }
}

//绑定点击事件
function initclick(data) {
    $("#h_head img").click(function () {
        if ($("#h_container").css('display') == 'none'){
            $("#h_container").css('display', 'block');
            $("#h_page2").css('display', 'none');
        }else {
            history.go(-1);
        }
    });

    $(".box-content").click(function () {
        var index = $(".box-content").index(this);
        console.log(data.result[index].e_id);
        $("#h_container").css('display', 'none');
        $("#h_page2").css('display', 'block');
        queryHistoryDetail(data.result[index]);
    });
}

//查询详细数据
function queryHistoryDetail(info) {
    $.ajax({
        type:'get',
        url:H_DETAIL_SERVER_URL + '?key=' + H_KEY + '&e_id=' + info.e_id,
        dataType:'jsonp',
        data:'',
        jsonp:'callback',
        beforeSend:function () {
            $("#waittips").css('display', 'block');
        },
        success:function (data) {
            initViewpage2(info, data);
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

//将查询的数据显示到界面上，界面2详细数据
function initViewpage2(targetinfo, data) {
    $("#hd_time").text(targetinfo.date);
    $("#hd_title").text(targetinfo.title);

    //分段
    var attr = data.result[0].content.split("\r\n");
    var _html = "";
    for (var i in attr){
        _html += attr[i] + "<br/>"
    }
    $("#hd_content").html("<p>"+ _html +"</p>");

    if (data.result[0].picUrl.length > 0){
        $("#hd_img img").attr('src', data.result[0].picUrl[0].url);
    }else {
        $("#hd_img img").attr('src', '../img/ZWCPTP.gif');
    }

}