//@require $
//@require _
var vm, $svg_map, $svg_div;
exports.init = function (env_no, opt) {
    opt = _.defaults(opt, {
        show_small_env: true,
        show_micro_env: true,
        show_network: true,
        show_relic: true,
        svg_map: ''//svg selector
    });
    $svg_map = $(opt.svg_map);
    $svg_div = $(opt.svg_map + '_div');

    vm = exports.vm = new Vue({
        el: '#map_switch',
        data: {
            i:0,
            show_small_env: opt.show_small_env,
            small_sensor_total: 0,
            small_sensor_list: {},
            small_controller_total: 0,
            small_controller_list: {},

            show_micro_env: opt.show_micro_env,
            micro_sensor_total: 0,
            micro_sensor_list: {},
            micro_controller_total: 0,
            micro_controller_list: {},

            show_network: opt.show_network,
            network_list: {},
            network_total: 0,

            show_relic: opt.show_relic,
            relic_list: {},
            relic_total: 0
        },
        methods: {
            show_map: function (legend, type) {
                var $box = $('#' + legend);
                var $icon = $box.find('.bgImg.' + type);

                if (!$icon.hasClass('now')) {
                    $icon.addClass('now');
                    add_point(env_no, legend, type);
                } else {
                    $icon.removeClass('now');
                    remove_point(env_no, legend, type);
                }
                if ($box.find('.bgImg').length == $box.find('.bgImg.now').length) {
                    $box.find('input:checkbox').prop('checked', true);
                } else {
                    $box.find('input:checkbox').prop('checked', false);
                }
            },
            sel_all: function (legend) {
                var $box = $('#' + legend);
                if ($box.find('input:checkbox:checked')[0]) {
                    $box.find('.bgImg').addClass('now');
                    add_all_point(env_no, legend);
                } else {
                    $box.find('.bgImg').removeClass('now');
                    remove_all_point(env_no, legend);
                }
            },
            move:function(e){
                if ($('.icon_').size()==0||this.i!=0) {
                    return;
                }
                setTimeout(function(){
                    iconMove();
                },200);
                this.i++;
            }
        }
    });

    $.get(API('/env/environments/legends/legend_classifies/' + env_no), function (data) {
        set_small_env(data, opt);
        set_micro_env(data, opt);
        set_network(data, opt);
        set_relic(data, opt);
        setTimeout(function(){
            $('.sel_all').click();
        },0);
    }, 'json');
};
function iconMove(){
    var $title=$('.title');
    $('.icon_').mouseover(function(){
        var name=$(this).find('.bgImg').attr('class').split(' ')[1];
        $title.find('span').html(name_list[name]);
    }).mousemove(function(e){
        $title.css({'display':'block','left':e.clientX-$('.Legend').offset().left-10+'px','top':e.clientY-$('.Legend').offset().top-46+'px'});
    }).mouseout(function(){
        $title.css('display','none');
    })
}

var name_list={
    co2_sensor:'二氧化碳传感器',
    qcm_sensor:'QCM传感器',
    lu_sensor:'光照紫外传感器',
    th_sensor:'湿度传感器',
    sth_sensor:'带屏温湿度传感器',
    voc_sensor:'VOC传感器',
    hum_machine:'调湿机',
    hum_agent:'调湿剂',
    repeater:'中继',
    gateway:'网关',
    一级文物:'一级文物',
    二级文物:'二级文物',
    三级文物:'三级文物',
    其他文物:'其他文物'
};

function set_network(data, opt) {
    if (!opt.show_network || !data['network']) {
        return;
    }
    if (data.network.total > 0) {
        vm.$set('network_list', _.omit(data.network, 'total'));
        vm.$set('network_total', data.network.total);
    }
}
function set_small_env(data, opt) {
    if (!opt.show_small_env || !data['small_env']) {
        return;
    }
    if (data.small_env.sensor && data.small_env.sensor.total > 0) {
        vm.$set('small_sensor_total', data.small_env.sensor.total);
        vm.$set('small_sensor_list', _.omit(data.small_env.sensor, 'total'));
    }
    if (data.small_env.controller && data.small_env.controller.total > 0) {
        vm.$set('small_controller_total', data.small_env.controller.total);
        vm.$set('small_controller_list', _.omit(data.small_env.controller, 'total'));
    }
}
function set_micro_env(data, opt) {
    if (!opt.show_micro_env || !data['micro_env']) {
        return;
    }

    if (data.micro_env.sensor && data.micro_env.sensor.total > 0) {

        vm.$set('micro_sensor_total', data.micro_env.sensor.total);
        vm.$set('micro_sensor_list', _.omit(data.micro_env.sensor, 'total'));
    }
    if (data.micro_env.controller && data.micro_env.controller.total > 0) {
        vm.$set('micro_controller_total', data.micro_env.controller.total);
        vm.$set('micro_controller_list', _.omit(data.micro_env.controller, 'total'));
    }

}

function set_relic(data, opt) {
    if (!opt.show_relic || !data['relic']) {
        return;
    }

    vm.$set('relic_list', data.relic);
    vm.$set('relic_total', _.reduce(_.values(data.relic), function (memo, num) {
        return memo + num;
    }));
}
var legend_data = {};
function get_legend_data(env_no, legend, callback) {
    if (legend_data[legend]) {
        callback && callback(legend_data[legend]);
        return;
    }
    $.get(API('/env/environments/legends/legend_detail/' + env_no + '/' + legend), function (data) {
        callback && callback(data);
        legend_data[legend] = data;
    }, 'json');
}

//添加到地图上
function add_point(env_no, legend, type) {
    get_legend_data(env_no, legend, function (data) {
        if (!data[type]) {
            return;
        }

        add_point_map(data[type], legend, type);
    });

}
function remove_point(env_no, legend, type) {

    $svg_div.find('div[data-legend=' + legend + '][data-type=' + type + ']').remove();

}
function add_all_point(env_no, legend) {
    get_legend_data(env_no, legend, function (data) {
        _.each(data, function (list, type) {
            add_point_map(list, legend, type);
        });
    });
}
function remove_all_point(env_no, legend) {

    $svg_div.find('div[data-legend=' + legend + ']').remove();
}

function add_point_map(list, legend, type) {


    _.each(list, function (row) {
        if (row['locate']) {//有坐标定位
            var locate;
            try {
                locate = $.parseJSON(row['locate']);
            } catch (e) {
                console.log(e);
            }
            if (locate && locate.width && locate.height && locate.area) {
                var svg_data = [];
                _.each(locate.area, function (v) {
                    var points = v.split(',');
                    points[0] = $svg_map.width() * points[0] / locate.width;
                    points[1] = $svg_map.height() * points[1] / locate.height;
                    svg_data.push(points[0].toFixed(0) + ',' + points[1].toFixed(0));
                });

                add_to_map_div(svg_data, row);
                return;
            }
        }
        //搜索上级环境坐标第一个点
        var env_no = row['env_no'];
        if (!env_no && row['parent_env_no']) {
            env_no = row.parent_env_no;
        }
        var $env_polygon = $svg_map.find('polygon[data-no=' + env_no + ']');
        if ($env_polygon[0]) {
            var points = $env_polygon.attr('points');
            if (points) {
                add_to_map_div(points, row);
                return;
            }
        }

        add_to_map_div(["0,0"], row);

    });
    function add_to_map_div(points, row) {
        var xy;
        if (points[0]=="0,0") {
            return;
        }

        if (_.isString(points)) {
            xy = points.split(' ')[0];
        } else if (_.isArray(points)) {
            xy = points[0];
        }

        var xy_arr = xy.split(',');
        var left = (100 * xy_arr[0] / $svg_map.width()).toFixed(2),
            top = (100 * xy_arr[1] / $svg_map.height()).toFixed(2);
        var attr = {};
        attr['title'] = row.name;
        attr['data-type'] = type;
        attr['data-legend'] = legend;
        attr['class'] = 'icon_map ' + type;

        var $icon = $('<div>', attr);

        switch (legend) {
            case 'small_env':
            case 'micro_env':
                create_sensor($icon, row);
                break;
            case 'network':
                create_network($icon, row);
                break;
            case 'relic':
                create_relic($icon, row);
                break;
        }
        var left_top_id = 'area_' + left.replace('.', '') + '_' + top.replace('.', '');
        if (!$('#' + left_top_id)[0]) {
            $('<div/>', {id: left_top_id, class: 'left_top_box'}).css({
                left: left + '%',
                top: top + '%'
            }).hover(function () {
                $(this).css('z-index','2');
                $(this).addClass('active')
                    .find('.icon_map').addClass('now')
                    .hover(function () {
                        var $tip = $(this).find('.tip');
                        $tip.show();
                        if ($tip.offset().top < 0) {
                            $tip.animate({left: '35px', bottom: $tip.offset().top});
                            $tip.find('.triangle').hide();
                        }

                    }, function () {
                        $(this).find('.tip').hide();
                    });

            }, function () {
                $(this).css('z-index','1');
                $(this).removeClass('active').find('.icon_map').removeClass('now');
            }).appendTo($svg_div);

        }
        $('#' + left_top_id).append($icon);
    }

    function create_sensor($icon, equip) {
        $icon.attr('data-equip_no', equip.equip_no);
        var $tip = $('<div/>', {
            class: 'tip',
            id: 'tip_' + equip.equip_no
        });

        $.get(API('/env/equipments/new_data/' + equip.equip_no), function (data) {
            var tip_html = '<ul>';
            _.each(data, function (row, param) {
                if (param == 'equip_no') {
                    tip_html += '<li>设备 <a href="../equip?equip_no=' + equip.equip_no + '" target="_self">' + equip.name + '</a></li>';
                    // tip_html += '<li>设备类型 ' + equip.equip_type + '</a></li>';
                } else {
                    tip_html += '<li><i>' + row.name + '</i><span>' + row.value + '</span><em>' + row.unit + '</em></li>';
                }
            });
            $tip.append(tip_html + '</ul><div class="triangle"></div>');

        }, 'json');

        $icon.append($tip);
    }

    function create_network($icon, equip) {
        $icon.attr('data-equip_no', equip.equip_no);

        var $tip = $('<div/>', {
            class: 'tip',
            id: 'tip_' + equip.equip_no
        });

        $.get(API('/env/equipments/overviews/' + equip.equip_no), function (equip) {
            var tip_html = '<ul>';
            tip_html += '<li>设备 <a href="../equip?equip_no=' + equip.equip_no + '" target="_self">' + equip.equip_type + '-' + equip.name + '</a></li>';

            $tip.append(tip_html + '</ul><div class="triangle"></div>');

        }, 'json');

        $icon.append($tip);

    }

    function create_relic($icon, relic) {
        $icon.attr('data-relic_no', relic.relic_no);

        var $tip = $('<div/>', {
            class: 'tip',
            id: 'tip_' + relic.relic_no
        });

        $.get(API('/relic/relics/relic_overview/' + relic.relic_no), function (data) {
            var tip_html = '<ul>';

            tip_html += '<li><a href="../relic?relic_no=' + relic.relic_no + '" target="_self">' + relic.name + '</a></li>';

            $tip.append(tip_html + '</ul><div class="triangle"></div>');

        }, 'json');

        $icon.append($tip);
    }

}
