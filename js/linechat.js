/**
 * Created by Administrator on 2017/3/12.
 */

var date = [];      //数据集
var widthstep;      //两个点之间的宽度间隔
var heightstep;     //两个点之间的高度间隔
var maxdate;        //数据中的最大值
var mindate;        //数据中的最小值
var dotradio = 4;       //小圆点的半径

var context;

var tres = 0;      
var s = 0;

var datatype;      //数据的类型（温度、能见度等）
var datebrfore = [];

/**
 * @param canvasid 画布id，决定在哪个画布上画折线
 * @param arr      数据集，要显示成折线的数据
 * @param arrafter 当数据表示的是时间时，处理时间之后的数据
 * @param type     数据代表的类型（温度、能见度、日出日落时间）
 */
function drawchatline(canvasid, arr, arrafter, type) {
    if (arrafter.length > 0 && type == 3){
        date = arrafter;
        datebrfore = arr;
    }else {
        date = arr;
        datebrfore = arr;
    }
    datatype = type;

    s = 0;
    
    var canvas = document.getElementById(canvasid);
    context = canvas.getContext("2d");

    maxdate = Math.max.apply(null, date);
    mindate = Math.min.apply(null, date);

    widthstep = (canvas.width - dotradio * 2) / (date.length - 1);
    heightstep = (canvas.height - dotradio * 2) / (maxdate - mindate);

    context.lineWidth = 2;    //线条宽度

    context.beginPath();
    if ((maxdate - date[0]) * heightstep == 0){
        context.moveTo(dotradio, (maxdate - date[0]) * heightstep + dotradio);
    }else {
        context.moveTo(dotradio, (maxdate - date[0]) * heightstep);
    }
    tres = setInterval(drawline, 200);
}

//画线
function drawline() {
    if (s >=7){
        clearInterval(tres);
        drawdate();
    }
    
    var a = s * widthstep;
    var b = (maxdate - date[s]) * heightstep;
    if (a == 0){
        a += dotradio;
    }
    if (b == 0){
        b += dotradio;
    }
    context.lineTo(a, b);
    context.strokeStyle = "red";  //线条颜色
    context.stroke();    //画图操作
    drawdot(s);
    s += 1;
}

//画圆点
function drawdot(j) {
    var x = j * widthstep;
    var y = (maxdate - date[j]) * heightstep;
    if (x == 0){
        x += dotradio;
    }
    if (y == 0){
        y += dotradio;
    }
    context.beginPath();
    context.arc(x, y, dotradio, 0, 2*Math.PI);
    context.fillStyle = "#5E5E5E";
    context.fill();
}

//画数据
function drawdate() {
    for (var j = 0; j < date.length; j++){
        var x = j * widthstep;
        var y = (maxdate - date[j]) * heightstep;
        if (x == 0){
            //x += dotradio * 2
        }else {
            x -= dotradio * 4;
        }
        if ( y == 0){
            y += dotradio * 4;
        }else {
            y -= dotradio * 2;
        }
        context.save();
        context.font="16px Georgia";
        context.fillStyle = "blue";
        
        switch (datatype){
            case 1:       //温度
                context.fillText(date[j] + "°", x, y);
                break;
            case 2:       //能见度
                context.fillText(date[j] + "km", x, y);
                break;
            case 3:       //日出日落时间
                context.fillText(intToTime(datebrfore[j].toString()), x, y);
                break;
        }
    }
}