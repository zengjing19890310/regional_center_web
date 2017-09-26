//@require _
//@require $
var all_width,all_height,real_width=$('#svg_map').width(),real_height=$('#svg_map').height();
function draw_svg(opt) {
    opt = _.defaults(opt, {
        el: '#svg',//svg selector
        data: [{
            locate: '{"area":["123,1223","12,34"],"width":1600,"height":900}'
        }],
        row_no: 'env_no',
        row_title: 'name',
        draw: null,//绑定到 window.draw
        mousedown:function(){

        },
        mouseup:function(env_no){

        },
        draw_before: function () {

        }
    });
    var $svg = $(opt.el);

    draw_html($svg,opt);

    if (opt.data&&opt.data.length>0&&opt.data[0].locate) {
        all_width=$.parseJSON(opt.data[0].locate).width;
        all_height=$.parseJSON(opt.data[0].locate).height;
    }else{
        all_width=real_width;
        all_height=real_height;
    }
    $('.map_view').bind('mousewheel',function(e){
        if ($('#svg_draw_menu')[0]) {
            return
        }
        draw_html($svg,opt);
    }).find('.btn_view').bind('click',function(){
        draw_html($svg,opt);
    });

    if (opt.draw) {
        window.draw = function () {
            draw($svg, opt);
        }
        $(document).bind('keydown', function (e) {
            if (e.key == 'F6'||e.keyCode==117) {
                var $menu=$('#svg_draw_menu');
                if ($menu[0]) {
                    $menu.remove();
                    $svg.off().html(oldSvg);
                    draw_html($svg,opt);
                    addPoint=[];
                    opt.draw_after&&opt.draw_after();
                    window.oncontextmenu=function(){
                        return true;
                    }
                }else{
                    svg_locate = '', draw_point = [],oldSvg=false,addPoint=[];
                    draw($svg, opt);
                    e.preventDefault();
                }
            }
        });
    }


    $(window).on('resize', function () {
        draw_html($svg,opt);
        real_width=$('#svg_map').width(),real_height=$('#svg_map').height();
    });
    $svg.siblings('img').on('load', function () {
        draw_html($svg,opt);
    });

    return {
        get_locate: function () {
            return svg_locate;
        }
    }
}

function draw_html($svg,opt) {
    var polygon_html = '';
    _.each(opt.data, function (row) {
        if (!row['locate']) {
            return;
        }
        var locate;
        try {
            locate = $.parseJSON(row.locate);
        } catch (e) {
            console.error(e, row.locate);
            return;
        }

        var svg_data = [];
        if (!locate || !locate.area || !locate.width) {
            return;
        }
        _.each(locate.area, function (v) {
            var points = v.split(',');
            points[0] = $svg.width() * points[0] / locate.width;
            points[1] = $svg.height() * points[1] / locate.height;
            svg_data.push(points[0].toFixed(0) + ',' + points[1].toFixed(0));
        });
        var style = [];
        if (locate['color']) {
            style.push('fill: ' + locate['color'] + ';');
        }
        if (style.length > 0) {
            style = " style='" + style.join('') + "'";
        }

        polygon_html += "<polygon data-title="+row[opt.row_title]+" data-no='" + row[opt.row_no] + "' points='" + svg_data.join(" ") + "' " + style + ">" +
            "</polygon>";
    });
    $svg.html(polygon_html);

    addEvent($svg,opt);
}

function addEvent($svg,opt){
    var _x=0,_y=0;
    $svg.find('polygon').mousedown(function(e){
        _x=e.clientX;
        _y=e.clientY;
    }).mouseup(function(e){
        if (_x==e.clientX&&_y==e.clientY) {
            var $this = $(this), no = $this.attr('data-no');
            opt.mouseup && opt.mouseup(no, e);
        }
    });
}

var svg_locate = '', draw_point = [],oldSvg=false,addPoint=[];
function draw($svg, opt) {
    draw_point.length = 0;
    if (!oldSvg) {
        oldSvg=$svg.html();
    }
    $svg.off().html('');
    menu_init($svg, opt);
    opt.draw_before && opt.draw_before();

    $svg.mousedown(function (e) {
        if (e.button==2) {return;};
        _x=e.offsetX/$svg.width()*all_width;
        _y=e.offsetY/$svg.height()*all_height;
        addPoint.push( _x+ ',' +_y );

        draw_point.push(e.offsetX + ',' + e.offsetY);
        draw_polyline($svg);
    }).mousemove(function (e) {
        draw_polyline($svg, e);
    });
    oncontextmenu=function(){
        return false;
    }
}
function draw_polyline($svg, e) {
    var polygon_html = '', line_html = '';
    var color = $('#svg_draw_color').val();
    if (draw_point.length > 0) {

        polygon_html = "<polyline points='" + draw_point.join(" ") + "' style='fill-opacity:0.5;stroke-opacity:0.5;stroke: " + color + ";fill: " + color + ";'></polyline>";
        if (e) {
            var last_point = draw_point[draw_point.length - 1].split(',');
            line_html = '<line x1="' + last_point[0] + '" y1="' + last_point[1] + '" x2="' + e.offsetX + '" y2="' + e.offsetY + '" style="stroke: ' + color + ';"/>';
        }
    }
    $svg.html(polygon_html + line_html);
    svg_locate = JSON.stringify({area: draw_point, width: $svg.width(), height: $svg.height(), color: color});
}

function menu_init($svg, opt) {
    if ($('#svg_draw_menu')[0]) {
        return;
    }
    var $menu = $('<div/>', {
        id: 'svg_draw_menu'

    }).html('勾画热区,填充颜色：<input id="svg_draw_color" type="color" value="#1eb16d" />' +
        '<div style="position: absolute;right:5px;top:2px">' +
        '<button type="button" id="svg_draw_undo">撤销上一步</button> ' +
        '<button type="button" id="svg_draw_clear">清空</button>' +
        '</div>' +
        '<hr style="margin:5px;"/>' +
        '<button style="position:absolute;left:5px;padding:0 5px;" type="button" id="svg_close">取消</button>'+
        '<div style="position: absolute;right:5px;">' +
        '环境：<select id="svg_draw_env_no" style="width: 167px;"></select> ' +
        '<button type="button" id="svg_draw_ok">保存</button></div>').css({
        position: 'absolute', top: 0, left: '20%',
        width: 300, height: 72, padding: '0 5px',
        background: '#fff', 'font-size': '14px',
        'z-index': 99999, 'line-height': '25px'
    });
    $('body').append($menu);

    var $select = $('#svg_draw_env_no');
    var env_data = {};
    _.each(opt.data, function (row) {
        env_data[row.env_no] = row;
        $select.append('<option value="' + row.env_no + '">' + row.name + '</option>');
    });
    var now_env_no = $select.val();

    if (env_data[now_env_no]&&env_data[now_env_no].locate) {
        all_width=$.parseJSON(env_data[now_env_no].locate).width;
        all_height=$.parseJSON(env_data[now_env_no].locate).height;
    }
    else{
        all_width=real_width;
        all_height=real_height;
    }
    draw_old($svg, env_data[now_env_no]);

    $('.map_view').bind('mousewheel',function(){
        var $menu=$('#svg_draw_menu');
        if (!$menu[0]) {
            return
        }
        if (addPoint) {
            var newLocate={};
            if (opt.data&&opt.data.length>0&&opt.data[0].locate) {
                for(var i in env_data[now_env_no]){
                    newLocate[i]=env_data[now_env_no][i];
                }
                var locate=$.parseJSON(newLocate.locate);
                for (var i = 0,len=addPoint.length; i < len; i++) {
                    var points = addPoint[i].split(',');
                    locate.area.push(points[0] + ',' + points[1]);
                }
                newLocate.locate=JSON.stringify(locate);
            }else{
                newLocate={
                    locate:{}
                }
                var locate={area:[]};
                var area=locate.area;
                for (var i = 0,len=addPoint.length; i < len; i++) {
                    var points = addPoint[i].split(',');
                    area.push(points[0] + ',' + points[1]);
                }
                locate.width=all_width;
                locate.height=all_height;
                locate.color='#1eb16d';
                newLocate.locate=JSON.stringify(locate);
            }
            
        }
        draw_old($svg,newLocate);
    });

    $('#svg_draw_color').on('change', function () {
        draw_polyline($svg);
    });
    $select.on('change', function () {
        now_env_no = $select.val();
        if (env_data[now_env_no]&&env_data[now_env_no].locate) {
            all_width=$.parseJSON(env_data[now_env_no].locate).width;
            all_height=$.parseJSON(env_data[now_env_no].locate).height;
        }
        else{
            all_width=real_width;
            all_height=real_height;
        }
        addPoint=[];
        // if (env_data[now_env_no].locate) {
            draw_old($svg, env_data[now_env_no]);
        // }
    });
    $('#svg_draw_undo').on('click', function () {
        draw_point.pop();
        addPoint.pop();
        draw_polyline($svg);
    });
    $('#svg_draw_clear').on('click', function () {
        draw_point.length = 0;
        draw_polyline($svg);
    });
    $('#svg_close').on('click',function(e){
        $menu.remove();
        $svg.off().html(oldSvg);
        draw_html($svg,opt);
        addPoint=[];
    });
    $('#svg_draw_ok').on('click', function () {
        var env_no = $select.val(),
            env_name = env_data[env_no].name;

        if (confirm("确认保存环境热区：" + env_name + '(' + env_no + ')?' + svg_locate)) {
            $.post(API('/base/envs/edit/' + env_no), {locate: svg_locate}, function (data) {
                if (data['error']) {
                    alert(data.error);
                    return;
                }
                alert(data.msg);
                window.location.reload();
            }, 'json');
        }
    });


}

function draw_old($svg, row) {
    draw_point.length = 0;
    var locate={
        area:[]
    };

    if(row.locate){
        locate = $.parseJSON(row.locate);
    }

    console.log(locate.area)
    _.each(locate.area, function (v) {
        var points = v.split(',');
        points[0] = $svg.width() * points[0] / all_width;
        points[1] = $svg.height() * points[1] / all_height;
        draw_point.push(points[0].toFixed(0) + ',' + points[1].toFixed(0));
    });
    if (locate['color']) {
        $('#svg_draw_color').val(locate['color']);
    }
    draw_polyline($svg);
}

module.exports = draw_svg;