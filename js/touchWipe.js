/**
 * Created by Administrator on 2017/2/15.
 */

var initX;        //触摸位置
var moveX;        //滑动时的位置
var X = 0;        //移动距离
var objX = 0;    //目标对象位置

function touchWipe(classname, delclassname) {
    initPhoneListener(classname, delclassname);
    initListener(classname, delclassname);
}

//绑定事件(phone)
function initPhoneListener(classname, delclassname) {
    window.addEventListener('touchstart', function (event) {
        var obj = event.target.parentNode;
        //console.log(event.target.className);
        if (obj.className == classname && event.target.className != delclassname){
            event.preventDefault();
            if (obj.className == classname) {
                initX = event.targetTouches[0].pageX;
                objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
            }
            if (objX == 0) {
                window.addEventListener('touchmove', function (event) {
                    event.preventDefault();
                    var obj = event.target.parentNode;
                    if (obj.className == classname) {
                        moveX = event.targetTouches[0].pageX;
                        X = moveX - initX;
                        if (X >= 0) {
                            obj.style.WebkitTransform = "translateX(" + 0 + "px)";
                        }
                        else if (X < 0) {
                            var l = Math.abs(X);
                            obj.style.WebkitTransform = "translateX(" + -l + "px)";
                            if (l > 80) {
                                l = 80;
                                obj.style.WebkitTransform = "translateX(" + -l + "px)";
                            }
                        }
                    }
                });
            }
            else if (objX < 0) {
                window.addEventListener('touchmove', function (event) {
                    event.preventDefault();
                    var obj = event.target.parentNode;
                    if (obj.className == classname) {
                        moveX = event.targetTouches[0].pageX;
                        X = moveX - initX;
                        if (X >= 0) {
                            var r = -80 + Math.abs(X);
                            obj.style.WebkitTransform = "translateX(" + r + "px)";
                            if (r > 0) {
                                r = 0;
                                obj.style.WebkitTransform = "translateX(" + r + "px)";
                            }
                        }
                        else {     //向左滑动
                            obj.style.WebkitTransform = "translateX(" + -80 + "px)";
                        }
                    }
                });
            }
        }
    });
    window.addEventListener('touchend', function (event) {
        var obj = event.target.parentNode;
        if (obj.className == classname && event.target.className != delclassname){
            event.preventDefault();
            if (obj.className == classname) {
                objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
                if (objX > -40) {
                    obj.style.WebkitTransform = "translateX(" + 0 + "px)";
                    objX = 0;
                } else {
                    obj.style.WebkitTransform = "translateX(" + -80 + "px)";
                    objX = -80;
                }
            }
        }
    });
}

//绑定事件(pc)
function initListener(classname, delclassname) {
    $(document).bind('mousedown', function (event) {
        var obj = event.target.parentNode;
        //console.log(event.target.className);
        if (obj.className == classname && event.target.className != delclassname){
            event.preventDefault();
            if (obj.className == classname) {
                //initX = event.targetTouches[0].pageX;
                initX = event.clientX;
                objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
            }
            if (objX == 0) {
                $(document).bind('mousemove', function (event1) {
                    event1.preventDefault();
                    var obj = event1.target.parentNode;
                    if (obj.className == classname) {
                        //moveX = event.targetTouches[0].pageX;
                        moveX = event1.clientX;
                        X = moveX - initX;
                        if (X >= 0) {
                            obj.style.WebkitTransform = "translateX(" + 0 + "px)";
                        }
                        else if (X < 0) {
                            var l = Math.abs(X);
                            obj.style.WebkitTransform = "translateX(" + -l + "px)";
                            if (l > 80) {
                                l = 80;
                                obj.style.WebkitTransform = "translateX(" + -l + "px)";
                            }
                        }
                    }
                });
            }
            else if (objX < 0) {
                $(document).bind('mousemove', function (event1) {
                    event1.preventDefault();
                    var obj = event1.target.parentNode;
                    if (obj.className == classname) {
                        //moveX = event.targetTouches[0].pageX;
                        moveX = event1.clientX;
                        X = moveX - initX;
                        if (X >= 0) {
                            var r = -80 + Math.abs(X);
                            obj.style.WebkitTransform = "translateX(" + r + "px)";
                            if (r > 0) {
                                r = 0;
                                obj.style.WebkitTransform = "translateX(" + r + "px)";
                            }
                        }
                        else {     //向左滑动
                            obj.style.WebkitTransform = "translateX(" + -80 + "px)";
                        }
                    }
                });
            }

            $(document).bind('mouseup', function (event2) {
                var obj = event2.target.parentNode;
                if (obj.className == classname && event2.target.className != delclassname){
                    event2.preventDefault();
                    if (obj.className == classname) {
                        objX = (obj.style.WebkitTransform.replace(/translateX\(/g, "").replace(/px\)/g, "")) * 1;
                        if (objX > -40) {
                            obj.style.WebkitTransform = "translateX(" + 0 + "px)";
                            objX = 0;
                        } else {
                            obj.style.WebkitTransform = "translateX(" + -80 + "px)";
                            objX = -80;
                        }
                    }
                    //移除绑定
                    $(document).unbind('mousemove').unbind('mouseup');
                }
            });
        }
    });

}