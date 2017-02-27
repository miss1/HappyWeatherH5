/**
 * Created by Administrator on 2017/2/22.
 */
var i = 0;         //左边进度条走的长度
var j = 0;         //右边进度条走的长度
var leftres = 0;       //从左往右
var rightres = 0;      //从右往左
var context = null;

var l_width;   //进度条长度
var r_width;
var total_height;   // 进度条宽度
var start_x;      //起始位置
var p_y;      //起始位置
var end_x;     //结束位置

var progress_lingrad;   //左边进度条颜色
var progress_lingradr;  //右边进度条颜色

var fireHeight;
var fireWidth;

var weather_l;
var weather_r;

/**
 * 画一个两边往中间走的进度条
 * @param idname 画笔的id
 * @param left_width 左边进度条的长度
 * @param right_width 右边进度条的长度
 * @param height 进度条宽度
 * @param startX 进度条起始位置
 * @param endX 进度条结束位置（右边起始位置）
 * @param y 进度条纵向的位置
 * @param fw 烟花的x轴位置
 * @param fh 烟花的y轴位置
 * @param weatherl 左边天气信息
 * @param weatherr 右边天气信息
 */
function loadprogressbar(idname, left_width, right_width, height, startX, endX, y, fw, fh, weatherl, weatherr) {

    l_width = left_width;
    r_width = right_width;
    total_height = height;
    start_x = startX;
    end_x = endX;
    p_y = y;
    i = 0;
    j = 0;
    
    fireHeight = fh;
    fireWidth = fw;

    weather_l = weatherl;
    weather_r = weatherr;

    var elem = document.getElementById(idname);
    if (!elem || !elem.getContext) {
        return;
    }
    context = elem.getContext('2d');
    if (!context) {
        return;
    }

    //context.clearRect(start_x, p_y, l_width+right_width, total_height);

    // set font
    context.font = "16px Verdana";

    // Blue gradient for progress bar
    progress_lingrad = context.createLinearGradient(0,y+height,0,0);
    progress_lingrad.addColorStop(0, '#4DA4F3');
    progress_lingrad.addColorStop(0.4, '#ADD9FF');
    progress_lingrad.addColorStop(1, '#9ED1FF');
    //context.fillStyle = progress_lingrad;

    progress_lingradr = context.createLinearGradient(0,y+height,0,0);
    progress_lingradr.addColorStop(0, '#E7E708');
    progress_lingradr.addColorStop(0.4, '#B5DE10');
    progress_lingradr.addColorStop(1, '#88CE20');
    //context.fillStyle = progress_lingradr;

    //draw();
    leftres = setInterval(drawLeft, 10);
    rightres = setInterval(drawRight, 10);
}

function drawLeft() {
    i+=1;
    // Clear everything before drawing
    //context.clearRect(initial_x-5,initial_y-5,total_width+15,total_height+15);
    var radius = total_height/2;
    progressBarRectLeft(context, start_x, p_y, i, total_height, radius);
    progressTextLeft(context, start_x, p_y, i, radius);
    if (i>=l_width) {
        clearInterval(leftres);
    }
}

function drawRight() {
    j+=1;
    var radius = total_height/2;
    progressBarRectRight(context, end_x, p_y, j, total_height, radius);
    progressTextRight(context, end_x, p_y, j, radius);
    if (j>=r_width) {
        clearInterval(rightres);
    }
}

/**
 * Draws a half-rounded progress bar to properly fill rounded under-layer
 * @param {CanvasContext} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the bar
 * @param {Number} height The height of the bar
 * @param {Number} radius The corner radius;
 */
//从左往右画
function progressBarRectLeft(ctx, x, y, width, height, radius) {
    // var to store offset for proper filling when inside rounded area
    var offset = 0;
    ctx.beginPath();
    if (width<radius) {
        offset = radius - Math.sqrt(Math.pow(radius,2)-Math.pow((radius-width),2));
        ctx.moveTo(x + width, y+offset);
        ctx.lineTo(x + width, y+height-offset);
        ctx.arc(x + radius, y + radius, radius, Math.PI - Math.acos((radius - width) / radius), Math.PI + Math.acos((radius - width) / radius), false);
    }
    else {
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.arc(x+radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, false);
    }
    ctx.fillStyle = progress_lingrad;
    ctx.closePath();
    ctx.fill();
}

//从右往左画
function progressBarRectRight(ctx, x, y, width, height, radius) {
    var offset = 0;
    ctx.beginPath();
    if (width<radius) {
        offset = radius - Math.sqrt(Math.pow(radius,2)-Math.pow((radius-width),2));
        ctx.moveTo(x - width, y+offset);
        ctx.lineTo(x - width, y+height-offset);
        ctx.arc(x - radius, y + radius, radius, Math.PI/2, 3*Math.PI/2, true);
    }
    else {
        ctx.moveTo(x - radius, y);
        ctx.lineTo(x - width, y);
        ctx.lineTo(x - width, y + height);
        ctx.lineTo(x - radius, y + height);
        ctx.arc(x-radius, y+radius, radius, Math.PI/2, 3*Math.PI/2, true);
    }
    context.fillStyle = progress_lingradr;
    ctx.closePath();
    ctx.fill();
}

/**
 * Draws properly-positioned progress bar percent text
 * 进度条上的数字显示
 * @param {CanvasContext} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the bar
 * @param {Number} radius The corner radius;
 */
//从左往右
function progressTextLeft(ctx, x, y, width, radius) {
    ctx.save();
    ctx.fillStyle = 'red';
    var text_width = ctx.measureText(width).width;
    var text_x = x+width-text_width-5;
    if (width<=radius+text_width) {
        text_x = x+radius/2;
    }
    ctx.fillText(width, text_x, y+22);
    ctx.restore();
    //放烟花
    if (width >= l_width){
        if (l_width >= r_width){
            startFirework(fireWidth, fireHeight, 5, 30);
            showpkResult();
        }
    }
}

//从右往左
function progressTextRight(ctx, x, y, width, radius) {
    ctx.save();
    ctx.fillStyle = 'red';
    var text_width = ctx.measureText(width).width;
    var text_x = x-width+5;
    if (width<=radius+text_width) {
        text_x = x-radius-5;
    }
    ctx.fillText(width, text_x, y+22);
    ctx.restore();
    //放烟花
    if (width >= r_width){
        if (l_width < r_width){
            startFirework(fireWidth, fireHeight, 5, 30);
            showpkResult();
        }
    }
}

//天气pk页面展示pk结果
function showpkResult() {
    var isleft;
    if (parseInt(weather_l) < parseInt(weather_r)){
        isleft = false;
    }else {
        isleft = true;
    }
    switch (fireHeight){
        case 130:
            showPkResult(weather_l+"°", weather_r+"°", "tmpvaluel", "tmpvaluer", isleft);
            break;
        case 230:
            showPkResult(weather_l+"km", weather_r+"km", "visvaluel", "visvaluer", isleft);
            break;
        case 330:
            showPkResult(weather_l+"%", weather_r+"%", "hunvaluel", "hunvaluer", isleft);
            break;
        case 430:
            showPkResult(weather_l+"kmph", weather_r+"kmph", "pmvaluel", "pmvaluer", isleft);
            break;
    }
}