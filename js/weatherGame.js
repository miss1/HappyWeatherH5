var imgOrigArr = [];  //图片的正确顺序
var imgRandArr = [];  //图片打乱后的顺序
var width;           //整张图片的宽度
var height;          //整张图片的高度
var cellWidth;       //每一碎块的宽度
var cellHeight;      //每一碎块的高度
var moveTime = 400;  //记录animate动画的运动时间，默认400毫秒

var imgCells = '';    //记录碎片节点

var lever = 3;      //难度 2x2

$(document).ready(function () {
    imgSplit("../img/man.jpg");
    initClick();
});

function initClick() {
    //开始/重置游戏
    $("#game_begin span").click(function () {
        imgSplit("../img/man.jpg");
        randomArr();
        cellOrder(imgRandArr);

        imgCells.unbind("mouseover");
        imgCells.unbind("mouseout");
        imgCells.unbind("mousedown");
        imgCells.off("touchstart");

        beginGamePc();
        beginGamePhone();
    });
}

//切割图片
function imgSplit(img) {
    width = $("#imgArea").width();
    height = $("#imgArea").height();
    cellWidth = width/lever;
    cellHeight = height/lever;

    imgOrigArr = [];
    imgRandArr = [];
    var cell = '';   //记录单个图片碎片的变量
    $("#imgArea").html("");
    for (var i = 0; i < lever; i++){
        for (var j = 0; j < lever; j++){
            imgOrigArr.push(i*lever+j);
            cell = document.createElement("div");
            cell.className = "imgCell";
            $(cell).css({width: cellWidth - 2, height: cellHeight - 2, left: j * cellWidth, top: i * cellHeight, background: "url('"+ img +"')", backgroundPosition: (-j)*cellWidth + 'px ' + (-i)*cellHeight + 'px'});
            $("#imgArea").append(cell);
        }
    }
    imgCells = $(".imgCell");
    imgCells.css('cursor', 'pointer');
}

//开始游戏(pc)
function beginGamePc() {

    imgCells.bind("mouseover", function () {
        $(this).addClass("hover");
    });

    imgCells.bind("mouseout", function () {
        $(this).removeClass("hover");
    });

    imgCells.bind("mousedown", function (e) {
        /*此处是图片移动*/
        $(this).css('cursor','move');

        //所选图片碎片的下标以及鼠标相对该碎片的位置
        var cellIndex_1 = $(this).index();
        var cell_mouse_x = e.pageX - $(this).offset().left;
        var cell_mouse_y = e.pageY - $(this).offset().top;

        //拖动碎片
        $(document).bind("mousemove", function (e2) {
            imgCells.eq(cellIndex_1).css({
                zIndex: '40',
                left: e2.pageX - cell_mouse_x - $("#imgArea").offset().left,
                top: e2.pageY - cell_mouse_y - $("#imgArea").offset().top
            });
        });

        $(document).bind("mouseup", function (e3) {
            var cellIndex_2 = cellChangeIndex(e3.pageX - $("#imgArea").offset().left, e3.pageY - $("#imgArea").offset().top, cellIndex_1);
            console.log(cellIndex_2);
            if (cellIndex_1 == cellIndex_2){
                cellReturn(cellIndex_1);
            }else {
                cellExchange(cellIndex_1, cellIndex_2);
            }
            //移除绑定
            $(document).unbind('mousemove').unbind('mouseup');
        })
    });

    imgCells.bind("mouseup", function () {
        $(this).css('cursor','pointer');
    })
}

//开始游戏(phone)
function beginGamePhone() {
    imgCells.on('touchstart', function (e) {
        //所选图片碎片的下标以及鼠标相对该碎片的位置
        var cellIndex_1 = $(this).index();
        var cell_mouse_x = e.touches[0].pageX - $(this).offset().left;
        var cell_mouse_y = e.touches[0].pageY - $(this).offset().top;
        $(document).on('touchmove', function (e2) {
            imgCells.eq(cellIndex_1).css({
                zIndex: '40',
                left: e2.touches[0].pageX - cell_mouse_x - $("#imgArea").offset().left,
                top: e2.touches[0].pageY - cell_mouse_y - $("#imgArea").offset().top
            });
        });

        $(document).on('touchend', function (e3) {
            var cellIndex_2 = cellChangeIndex(e3.changedTouches[0].pageX - $("#imgArea").offset().left, e3.changedTouches[0].pageY - $("#imgArea").offset().top, cellIndex_1);
            console.log(cellIndex_2);
            if (cellIndex_1 == cellIndex_2){
                cellReturn(cellIndex_1);
            }else {
                cellExchange(cellIndex_1, cellIndex_2);
            }
            //移除绑定
            $(document).off('touchmove').off('touchend');
        })
    });
}

//打乱数组顺序
function randomArr() {
    imgRandArr = [].concat(imgOrigArr);   //将顺序的数组值赋给新数组之后打乱顺序
    imgRandArr.sort(function () {
       return 0.5 - Math.random();
    });
    console.log("before:"+imgOrigArr);
    console.log("after:"+imgRandArr);
}

//根据打乱的数组给图片排序
function cellOrder(arr) {
    for (var i = 0; i < arr.length; i++){
        imgCells.eq(i).animate({
            left: arr[i] % lever * cellWidth,
            top: Math.floor(arr[i] / lever) * cellHeight     //Math.floor向下取值（1.6为1）
        }, moveTime);
    }
}

//计算被交换碎片的下标
function cellChangeIndex(x, y, index1) {
    //鼠标拖动碎片移至大图片外
    if (x < 0 || x > width || y < 0 || y > height){
        return index1;
    }
    //鼠标拖动碎片在大图范围内移动
    var row = Math.floor(y / cellHeight);
    var col = Math.floor(x / cellWidth);
    var position = row * lever + col;
    
    var i = 0;
    while ((i < imgRandArr.length) && (imgRandArr[i] != position)){
        i++;
    }
    return i;
}

//被拖动的图片返回原位置
function cellReturn(index) {
    var row = Math.floor(imgRandArr[index]/lever);
    var col = imgRandArr[index] % lever;

    imgCells.eq(index).animate({
        left: col * cellWidth,
        top: row * cellHeight
    }, moveTime, function () {
        imgCells.eq(index).css('z-index','10');
    })
}

//交换图片位置
function cellExchange(indexfrom, indexto) {
    var rowform = Math.floor(imgRandArr[indexfrom] / lever);
    var colform = imgRandArr[indexfrom] % lever;
    var rowto = Math.floor(imgRandArr[indexto] / lever);
    var colto = imgRandArr[indexto] % lever;

    //交换图片的位置
    imgCells.eq(indexfrom).animate({
        left: colto * cellWidth,
        top: rowto * cellHeight
    }, moveTime, function () {
        imgCells.eq(indexfrom).css('z-index','10');
    });

    imgCells.eq(indexto).css('z-index','30').animate({
        left: colform * cellWidth,
        top: rowform * cellHeight
    }, moveTime, function () {
        imgCells.eq(indexto).css('z-index','10');

        //交换存储的数据
        var temp = imgRandArr[indexfrom];
        imgRandArr[indexfrom] = imgRandArr[indexto];
        imgRandArr[indexto] = temp;

        //判断是否完成全部移动，可以结束游戏
        if (checkPass(imgOrigArr, imgRandArr)){
            passGame();
        }
    })
}

//判断是否完成全部移动，可以结束游戏
function checkPass(rightArr, puzzleArr) {
    if (rightArr.toString() == puzzleArr.toString()){
        return true;
    }
    return false;
}

//成功完成游戏之后的处理
function passGame() {
    //取消样式和事件绑定
    /*for (var i = 0; i < imgOrigArr.length; i++){
        if (imgCells.eq(i).has("mouseOn")){
            imgCells.eq(i).removeClass("mouseOn");
        }
    }*/
    imgCells.unbind("mouseover");
    imgCells.unbind("mouseout");
    imgCells.unbind("mousedown");
    alert("恭喜过关");
}