//@require common.css
//@require $
//@require _
//@require echarts
//@require laydate
//@require tooltip

//确定drag是否显示

function dragUse(drag, array) {
    if (array.length > 6) {
        drag.style.display = 'block';
    } else {
        drag.style.display = 'none';
    }
    $(drag).parent().css('height', '138px');
}

//往下展开列表
function drag_down(drag, key) {
    var a = parseInt($(this).prev().css('height'));
    if (!key) {
        $(this).parent().animate({'height': 63 + a + 'px'});
    } else {
        $(this).parent().animate({'height': '138px'});
    }
}


exports.equip_relic=function(env_no,vm){
    //同柜文物,:env_no为展柜编号
    drag();
    $.get(API('/env/environments/cabinet/relics/' + env_no), function (data) {
        if (data.total==0) {
            $('.relic_equip.one').css('display','none');
            return;
        }
        var rows=data.rows;
        filter_relic(rows);
        vm.relic_list=rows;
        vm.all_relic=rows;
    });
    //同柜文物-end

    //柜内设备-start
    $.get(API('/env/environments/cabinet/equips/' + env_no), function (data) {
        if (data.controller.total+data.sensor.total==0) {
            $('.relic_equip.two').css('display','none');
            return;
        }
        var controller=data.controller.rows;
        var sensor=data.sensor.rows;
        vm.all_controller=controller;
        vm.controller=controller;
        vm.all_sensor=sensor;
        vm.sensor=sensor;

        filter_equip(controller,'controller');
        filter_equip(sensor,'sensor');
    });
    //柜内设备-end

    function filter_relic(rows){  //填补filter框
        var material=[],age=[],category=[];
        for(var i=0,len=rows.length;i<len;i++){
            if(material.indexOf(rows[i].material)==-1){
                material.push(rows[i].material);
            }
            if(category.indexOf(rows[i].age)==-1){
                age.push(rows[i].age);
            }
            if(category.indexOf(rows[i].category)==-1){
                category.push(rows[i].category);
            }
        }
        vm.relic={
            material:material,
            age:age,
            category:category
        };
    }
    function filter_equip(rows,type){  //填补filter框
        var row=[];
        for(var i=0,len=rows.length;i<len;i++){
            if(row.indexOf(rows[i].equip_type)==-1){
                row.push(rows[i].equip_type);
            }
        }
        vm.$set('equip.'+type,row);
    }

    function drag(){
        $('.filter .font').click(function(e){
            e.stopPropagation();
        }).hover(function(){
            $(this).find('ul').css('display','block').animate({'height':$(this).find('li').size()*23});
        },function(){
            $(this).find('ul').stop().animate({'height':0},function(){
                $(this).css('display','none');
            });
        });
    }
};

//展柜位置图,展柜编号
exports.cabinet_position_image = function (env_no) {

    $.get(API("/base/envs/position_image/" + env_no), function (data) {
        if (!data || !data['url']) {
            $('.left .position').css('display','none');
            return;
        }
        var img = new Image();
        img.src = data.url;
        img.onload = function () {
            $('.position').append(this);
        }
    }, 'json');
};
// 展柜内部位置图
exports.cabinet_show_image = function (env_no) {
    $.get(API("/base/envs/show_image/" + env_no), function (data) {
        var $roomView = $('.roomView'),
            $barnar = $roomView.find('.barnar'),
            $imgArr = data.images,
            $leftNav = $roomView.find('.leftNav'),
            $rightNav = $roomView.find('.rightNav'),
            timer;
        if (!_.isArray($imgArr)) {
            $('.left .roomView').css('display','none');
            return;
        }
        for (var i = 0; i < $imgArr.length; i++) {
            $barnar.append('<img src="' + $imgArr[i] + '">');
        }

        $barnar.css('width', $imgArr.length * 330);
        (function () {
            var i = 0;
            $rightNav.click(function () {
                i--;
                i = i % ($imgArr.length);
                $barnar.animate({'left': i * 330});
            });
            $leftNav.click(function () {
                i++;
                if (i > 0) {
                    i = (-$imgArr.length + 1)
                }

                $barnar.animate({'left': i * 330});
            });

            function start() {
                i--;
                i = i % ($imgArr.length);
                $barnar.animate({'left': i * 330});
                timer = setTimeout(start, 2000);
            }

            start();
            $roomView.mouseover(function () {
                clearTimeout(timer);
            }).mouseleave(function () {
                start();
            });
        })();
    });
};

var names_color = {
    temperature: {name: '温度', color: '#3BB48B'},
    humidity: {name: '湿度', color: '#2495FF'},
    voc: {name: 'VOC', color: '#AF9A2F'},
    co2: {name: 'CO²', color: '#FF3D3F'},
    light: {name: '光照', color: '#FF9000'},
    uv: {name: '紫外', color: '#FF5EDD'}
};

//微环境监控-start
function showLoad(myChart){
    myChart.showLoading('default',{
        color:'#5A9E6D',
        text:'正在努力加载ing...',
        textColor:'#5A9E6D',
        maskColor:'rgba(255, 255, 255, 0.4)'
    });
}

exports.chart_new_data = function (env_no, equip_no) {
    var new_data_api = API('/env/environments/cabinet/new_data/' + env_no);
    if (equip_no) {
        new_data_api = API('/env/equipments/new_data/' + equip_no);
    }
    var myChartArea = echarts.init($('.monitor .echartsArea')[0]);
    $('.echartsArea').css('background','none');
    showLoad(myChartArea);
    var $view = $('.monitor .view'),
        sel_param_list = [];

    $.get(new_data_api, function (data) {
		myChartArea.hideLoading();
        for (var i in data) {
            if (names_color[i]) {
                $view.append('<label><input data-key="' + i + '" type="checkbox" />' +
                    '<p>' + names_color[i].name + ' : <span>' + data[i].value + data[i].unit + '</span></p>' +
                    '</label>');
            }
        }

        create_chart();//创建echarts框架

        $('.diy_date button').on('click', function () {
            // var time
            getLine();
        });
        $('.monitor .chooceTime>span').on('click', function () {
            $(this).addClass('ower').siblings().removeClass('ower');
            var timeL = $(this).attr('data-time');
            var $diy = $('.chooceTime .diy'),
                $diy_date = $('.diy_date');
            if (timeL == 'diy') {
                if ($('#start_date').val() == '') {
                    $('#start_date').val(laydate.now('-30'));
                    $('#end_date').val(laydate.now());
                }
                $diy_date.css({left: $diy.position().left, top: $diy.position().top}).show();
            } else {
                getLine(timeL);
                $diy_date.hide();
            }
        });
        sel_param_bind();//绑定选择参数事件
        $view.find('input:first').click();
    });

    function sel_param_bind(){

        $view.find('input').bind('click', function () {
            var $this = $(this);
            if ($this.is(':checked')) {
                sel_param_list.push($this.attr('data-key'));
            } else {
                if (sel_param_list.length != 1) {
                    var key = sel_param_list.indexOf($this.attr('data-key'));
                    if (key != -1) {
                        sel_param_list.splice(key, 1);
                    }
                } else {
                    $this.prop('checked', 'checked');
                }
            }

            if (sel_param_list.length > 3) {
                var item = sel_param_list.shift();
                $view.find('input').each(function () {
                    if ($(this).attr('data-key') == item) {
                        $(this).prop('checked', '');
                    }
                });
            }
            getLine();
        });

    }

    function getLine(timeL) {
        showLoad(myChartArea);
        var timeL = timeL||$('.chooceTime .ower').attr('data-time');
        if (timeL == 'diy') {
            timeL = $('#start_date').val() + ',' + $('#end_date').val();
            if (timeL == ',') {
                return;
            }
        }
        var param_lines_api = API('/env/environments/cabinet/param_lines/' + env_no + '/' + timeL);
        if (equip_no) {
            param_lines_api = API('/env/equipments/param_lines/' + equip_no + '/' + timeL);
        }

        $.ajax({
            type: "get",
            dataType: 'json',
            url: param_lines_api,
            success: function (data) {
                myChartArea.hideLoading();
                var series = [], first_param,key=true;
                _.each(sel_param_list, function (param, i) {
                    if (!data[param]) {
                        return;
                    }
                    if (i == 0) {
                        first_param = param;
                    }
                    data[param].keyName=param;
                    series.push(data[param]);
                    if (data[param].value) {
                        key=false;
                    }
                });
                if(key){
                    if (sel_param_list.length == 1) {
                        one_option(first_param, series[0]);
                    } else {
                        many_option(series);
                    }
                }else{
                    equip_option(series);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                console.error(this, arguments);
                alert('数据获取异常');
            }
        });
    }

    var default_option;

    function create_chart() {
        default_option = {
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                show: false
            },
            dataZoom: [
                {
                    show: true,
                    realtime: true,
                    xAxisIndex: [0]
                },
                {
                    type: 'inside',
                    realtime: true,
                    xAxisIndex: [0]
                }
            ],
            grid: {
                left: 50,
                right: 100,
                top: '15%',
                bottom: '15%'
            },
            xAxis: {
                show: false,
                type: 'time',
                boundaryGap: false,
                axisLabel: {
                    textStyle: {
                        color: "#9fa6ac",
                        fontFamily: "微软雅黑"
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show:true,
                    inside: false
                },
                min:'dataMin',
                scale:true
            },
            series: []
        };
        myChartArea.setOption(default_option);
        $(window).bind('resize', function () {
            myChartArea.resize();
        });
    }

    function one_option(param, data) {
        if(!data){
            return;                 //没有数据就return
        }
        var unit=data.unit;         //获取单位
        if (!data.max && !data.min && !data.average) {
            data.max = data.value;      //最大值
            data.min = data.value;         //最小值
            data.average = data.value;      //平均值
        }

        if (data.max) {
            data.max = data.max.map(function (val, i) {
                return [val[0],(val[1] - data.min[i][1]).toFixed(2)];       //对最大值进行变化减去最小值,因为减法的不精确，toFixed舍入
            });
        }
        var option = _.clone(default_option);                   //取公共不变化部分
        option.yAxis.name=data.name;                            //对y轴编号
        option.yAxis.axisLine= {                                //Y轴颜色
                        lineStyle: {
                            color: names_color[data.keyName].color
                        }
                    },
        option.series= [
            {
                showSymbol: false,
                smooth: true,
                name: '最小值',
                type: 'line',
                lineStyle: {normal: {color: '#818d94', opacity: '0'}},
                symbolSize: 6,
                stack: 'tiled',
                data: data.min
            },
            {
                showSymbol: false,
                smooth: true,
                name: '最大值',
                type: 'line',
                lineStyle: {
                    normal: {
                        color: '#818d94',
                        opacity: '0'
                    }
                },
                areaStyle: {
                    normal: {
                        color: '#ccc',
                        opacity: '0.3'
                    }
                },
                symbolSize: 6,
                stack: 'tiled',
                data: data.max
            },
            {
                showSymbol: false,
                smooth: true,
                name: '平均值',
                type: 'line',
                lineStyle: {normal: {color: names_color[param].color || '#818d94'}},
                itemStyle: {normal: {color: names_color[param].color || '#818d94'}},
                symbolSize: 6,
                data: data.average
            }
        ];
        option.tooltip.formatter=function(params){
            var str=data+'<br/>';
            var date = new Date(params[0].value[0]);
            data = date.getFullYear() + '-'
                   + (date.getMonth() + 1) + '-'
                   + date.getDate() + ' '
                   + date.getHours() + ':'
                   + date.getMinutes();

            for(var i=0;i<3;i++){
                var vaule=params[i].value[1];
                if(i==1){
                    vaule=(Number(params[1].value[1])+Number(params[0].value[1])).toFixed(2);       //还原max真实数据
                }
                str += params[i].seriesName+':'+ vaule+unit+'</br>';
            }
            return str;
        };
        myChartArea.setOption(option,true);
    }

    function many_option(datas) {
		var key=0,
            unit=[],
        	option = _.clone(default_option);
        	
        option.series = [];
        option.yAxis=[];
        _.each(datas, function (data) {
            var position='';
            if(key!=0){
                position='right'
            }
            if (!data.average) {
                data.average = data.value;
            }
            option.series.push({
                showSymbol: false,
                smooth: true,
                name: data.name,
                type: 'line',
                lineStyle: {normal: {color: names_color[data.keyName].color}},
                itemStyle: {normal: {color: names_color[data.keyName].color}},
                symbolSize: 6,
                data: data.average,
                yAxisIndex:key
            });
            unit.push(data.unit);
            option.yAxis.push({
                type: 'value',
                name:data.name,
                min:'dataMin',
                axisLine: {
                    lineStyle: {
                        color: names_color[data.keyName].color
                    }
                },
                position:position,
                offset: (key!=0)?50*(key-1):0,
                splitLine:{show:(key!=0)?false:true}
            });

            key++;
        });
        option.tooltip.formatter=function(params){
            var str='';
            for(var i=0;i<key;i++){
                var date = new Date(params[i].value[0]);
                data = date.getFullYear() + '-'
                       + (date.getMonth() + 1) + '-'
                       + date.getDate() + ' '
                       + date.getHours() + ':'
                       + date.getMinutes();
                str += data+'<br/>'
                       + params[i].seriesName+':'+ params[i].value[1]+unit[i]+'</br>';
            }
            return str;
        };
        myChartArea.setOption(option, true);
    }

    function equip_option(datas){
        var key=0,
            unit=[],
            option = _.clone(default_option);
        
        option.yAxis=[];
        option.series = [];
        _.each(datas, function (aldata) {
            var position='';
            if(key!=0){
                position='right'
            }
            var value=aldata.value;
            _.each(value,function(data){
                option.series.push({
                    showSymbol: false,
                    smooth: true,
                    name: aldata.name,
                    type: 'line',
                    lineStyle: {normal: {color: names_color[aldata.keyName].color}},
                    itemStyle: {normal: {color: names_color[aldata.keyName].color}},
                    symbolSize: 6,
                    data: data
                });
                unit.push(aldata.unit);
                option.yAxis.push({
                    type: 'value',
                    name:aldata.name,
                    min:'dataMin',
                    axisLine: {
                        lineStyle: {
                            color: names_color[aldata.keyName].color
                        }
                    },
                    position:position,
                    offset: (key!=0)?50*(key-1):0,
                    splitLine:{show:(key!=0)?false:true}
                });
                key++;
            });
        });
        option.tooltip.formatter=function(params){
            var str='';
            for(var i=0;i<key;i++){
                var date = new Date(params[i].value[0]);
                data = date.getFullYear() + '-'
                       + (date.getMonth() + 1) + '-'
                       + date.getDate() + ' '
                       + date.getHours() + ':'
                       + date.getMinutes();
                str += data+'<br/>'
                       + params[i].seriesName+':'+ params[i].value[1]+unit[i]+'</br>';
            }
            return str;
        };
        myChartArea.setOption(option, true);
    }
};
//微环境监控-end

//仪表盘和雷达图-start
exports.echarts_gauge_radar = function (env_no) {

    var myChartGauge = echarts.init($('.echartsGauge')[0]);
    $('.echartsGauge').css('background','none');
    create_gauge();//创建chart
    get_gauge_data();

    function get_gauge_data(timeL) {

        showLoad(myChartGauge);
        timeL = timeL || $('.chooceTime .ower').attr('data-time');
        if (timeL == 'diy') {
            if (!$('#start_date')[0]) {
                return;
            }
            timeL = $('#start_date').val() + ',' + $('#end_date').val();
            if (timeL == ',') {
                return;
            }
        }
        myChartGauge.setOption({
            series: [{
                data: [{value: 0, name: '达标率'}]
            }]
        });
        $.get(API('/env/environments/cabinet/standard/' + env_no + '/' + timeL), function (data) {
            myChartGauge.hideLoading();
            myChartGauge.setOption({
                series: [{
                    data: [{value: data.rate, name: '达标率'}]
                }]
            });
        }, 'json');
    }

    function create_gauge() {
        var option = {
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            series: [
                {
                    name: '环境',
                    center: ['50%', '55%'],
                    radius: '70%',
                    type: 'gauge',
                    data: [{value: 0, name: '达标率'}],
                    axisTick: {
                        show: false
                    },
                    pointer: {
                        width: 4
                    },
                    axisLine: {
                        lineStyle: {
                            width: 10,
                            color: [[0.6, '#e83428'],[0.8, '#0d6fb8'], [1, '#14ae67']]
                            // color: [[0.2, '#14ae67'], [0.8, '#0d6fb8'], [1, '#e83428']]
                        }
                    },
                    splitLine: {
                        length: 8
                    },
                    detail: {
                        width: 48,
                        height: 17,
                        textStyle: {
                            fontSize: 14
                        },
                        formatter: '{value}%',
                        offsetCenter: [0, '23%']
                    },
                    title: {
                        textStyle: {
                            color: '#9fa6ac',
                            fontSize: 12
                        }
                    }
                }
            ]
        };
        myChartGauge.setOption(option);

    }

    var myChartRadar = window['myChartRadar'] = echarts.init($('.echartsRadar')[0]);
    create_radar();
    get_radar_data();
    function get_radar_data(timeL) {
        showLoad(myChartRadar);
        timeL = timeL || $('.chooceTime .ower').attr('data-time');
        if (timeL == 'diy') {
            if (!$('#start_date')[0]) {
                return;
            }
            timeL = $('#start_date').val() + ',' + $('#end_date').val();
            if (timeL == ',') {
                return;
            }
        }

        $.get(API('/env/environments/cabinet/param_standard/' + env_no + '/' + timeL), function (data) {
            myChartRadar.hideLoading();
            var a = [];
            for (var i in data) {
                a.push(data[i]);
            }

            myChartRadar.setOption({
                series: [{
                    data: [{value: a, name: '参数达标率 : '}]
                }]
            });
        }, 'json');
    }

    function create_radar() {
        var option = {
            tooltip: {
                trigger: 'item'
            },
            radar: [
                {
                    center: ['50%', '50%'],
                    indicator: [
                        {text: '有机污染物', max: 100},
                        {text: '二氧化碳', max: 100},
                        {text: '含硫污染物', max: 100},
                        {text: '无机污染物', max: 100},
                        {text: '温度', max: 100},
                        {text: '湿度', max: 100}
                    ],
                    axisLine: {
                        lineStyle: {
                            width: 2
                        }
                    },
                    radius: 80
                }
            ],
            series: [
                {
                    type: 'radar',
                    areaStyle: {
                        normal: {
                            color: 'green',
                            opacity: '0.3'
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#72828d'
                        }
                    },
                    data: []
                }
            ]
        };
        myChartRadar.setOption(option);
        
        $('.echartsRadar').css('background','none');
    }

    //温湿度稳定性-start
    function get_stable(timeL) {
        timeL = timeL || $('.chooceTime .ower').attr('data-time');
        if (timeL == 'diy') {
            if (!$('#start_date')[0]) {
                return;
            }
            timeL = $('#start_date').val() + ',' + $('#end_date').val();
            if (timeL == ',') {
                return;
            }
        }

        $.get(API('/env/environments/cabinet/stable/' + env_no + '/' + timeL), function (data) {
            var _lineView = $('.diyLine .lineView');
            var _word = $('.diyLine .word');

            _lineView.find('.temperature span').css('width', 10*data.temperature + '%');
            _lineView.find('.humidity span').css('width', 10*data.humidity + '%');

            _word.find('.temperature').html(data.temperature);
            _word.find('.humidity').html(data.humidity);
        }, 'json');
    }

    get_stable();

    //温湿度稳定性-end
    $('.monitor .chooceTime>span').bind('click', function () {
        if($(this).attr('class')=='diy'){
            return;
        }
        var timeL = $(this).attr('data-time');
        get_gauge_data(timeL);
        get_radar_data(timeL);
        get_stable(timeL);
    });
    $('.diy_date button').on('click', function () {
        var timeL='';
        get_gauge_data(timeL);
        get_radar_data(timeL);
        get_stable(timeL);
    });
    $(window).bind('resize', function () {
        // myChartArea.resize();
        if (myChartGauge) {
            myChartGauge.resize();
        }
        if (myChartRadar) {
            myChartRadar.resize();
        }
    });
};

//仪表盘和雷达图-end

$('body').tooltip({key:true});