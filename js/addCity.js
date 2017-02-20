/**
 * Created by Administrator on 2017/1/22.
 */

var cityinfo = '';      //所有城市信息

$(document).ready(function () {
    preparforM();
    init();
});

//自适应手机
function preparforM() {
    $(".add_center").css('width', documentWidth - 125);
    $("#content").css('height', documentHeight - 60);
}

//点击事件
function init() {
    //搜索按钮点击事件
    $("#add_search").click(function () {
        $("#add_title").css('display', 'none');
        $("#add_input").css('display', 'inline-block');
        $("#add_search").css('display', 'none');
        //首次搜索，加载城市信息
        if (cityinfo == ''){
            $.getJSON(PATH_SEARCH, function (data) {
                cityinfo = data;
                var strHtml = '';
                $.each(cityinfo, function (index, info) {
                    strHtml += "<li>" + info.cityZh + " - " + info.provinceZh + "</li>";
                });
                $("#searchlist").html(strHtml);
            })
        }
    });
    
    //返回按钮点击事件
    $("#add_back").click(function () {
        if ($("#add_search").css('display') == 'none'){
            $("#add_title").css('display', 'inline-block');
            $("#add_input").css('display', 'none');
            $("#add_search").css('display', 'inline-block');
            $("#searchlist").html('');
        }else {
            history.go(-1);        //返回上一页（表单数据还在）;history.back(-1)，返回上一页，新页面
        }
    });

    //城市结果列表点击事件，点击弹出提示框添加城市
    //给动态添加的元素绑定事件，1.7以前用live，以后用on
    $("#content ul").on('click', 'li', function (e) {
        //alert(e.target.innerHTML);
        alertBox("添加城市", e.target.innerHTML, function () {    //回调函数，点确定之后执行的操作
            var arr = e.target.innerHTML.split(' ');
            console.log(arr[0]);
            if (localStorage.getItem(arr[0]) != undefined){
                toast("该城市已在列表中", 3000);
                return;
            }
            localStorage.setItem(arr[0], arr[0]);
            /*for (var i = 0; i < localStorage.length; i++){
                if (localStorage.getItem(localStorage.key(i)) == arr[0]){
                    toast("该城市已在列表中", 3000);
                    return;
                }
            }
            localStorage.setItem(localStorage.length-1+'', arr[0]);*/
            toast("添加成功");
        })
    });
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
    $("#searchlist").html(strHtml);
}

//实时监听搜索框内容变化，进行搜索
function onInput(event) {
    console.log(event.target.value);
    searchCity(event.target.value);
}

