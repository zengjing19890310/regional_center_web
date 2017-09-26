//@require $
//@require vue
//@require echarts

var vm;

exports.init = function (env_no) {
    vm = exports.vm = new Vue({
        el: '#monitor_box',
        data: {
            searchTxt:'',
            chooce:[],
            env_no: env_no,
            normal_total: 0,
            abnormal_total: 0,
            sensor_total: 1,
            poles_list: [],
            env_sensor_total: 0,
            filter_num:-1,
            all_small:[],
            all_micro:[],
            small_env_sensor_list: [],
            micro_env_sensor_list: [],
            unit:'℃',
            condition:[]
        },
        methods: {
            check_status:function(status){
                return status=='正常'?'green':'red';
            },
            addChooce:function(type){
            	if(this.searchTxt)this.searchTxt='';
                var condition=this.condition,
                    index=this.condition.indexOf(type);

                if (index!=-1) {
                    condition.splice(index,1);
                }else{
                    this.condition.push(type);
                }
                this.filter();
            },
            removeChooce:function(type){
                this.condition.splice(this.condition.indexOf(name),1);
                this.filter();
            },
            filter:function(){
                var small=this.all_small,
                    micro=this.all_micro,
                    condition=this.condition;

                var newSmall=small.filter(function(con){
                    var key=true;
                    if (condition.length==0) {return key;}
                    if(condition.indexOf(con.equip_type)==-1){
                        key=false;
                    }
                    return key;
                });

                var newMicro=micro.filter(function(con){
                    var key=true;
                    if (condition.length==0) {return key;}
                    if(condition.indexOf(con.equip_type)==-1){
                        key=false;
                    }
                    return key;
                });
                this.change(newSmall,newMicro);
            },
            search:function(){
                var small=this.all_small,
                    micro=this.all_micro,
                    searchTxt=this.searchTxt;

                this.condition=[];
                var newSmall=small.filter(function(con){
                    var key=true;
                    if (con.name.search(searchTxt)==-1) {
                        key=false;
                    }
                    return key;
                });

                var newMicro=micro.filter(function(con){
                    var key=true;
                    if (con.name.search(searchTxt)==-1) {
                        key=false;
                    }
                    return key;
                });
                this.change(newSmall,newMicro);
            },
            change:function(newSmall,newMicro){
                this.small_env_sensor_list=newSmall;
                this.micro_env_sensor_list=newMicro;
                var all_len=newSmall.length+newMicro.length;
                if (all_len==this.all_small.length+this.all_micro.length) {
                    this.filter_num=-1;
                }else{
                    this.filter_num=all_len;
                }
            }
        }
    });

    $.get(API('/env/environments/hall_standards/' + env_no), function (data) {
        gauge_chart(data.rate);
    }, 'json');

    $.get(API('/env/environments/hall_params/' + env_no), function (data) {
        if (data.total == 0) {
            return;
        }
        radar_chart(data);
    }, 'json');

    get_poles('temperature');


    $.get(API('/env/environments/equip_status/' + env_no), function (data) {
        vm.$set('normal_total', data['正常'] * 1);
        vm.$set('abnormal_total', data['异常'] * 1);
        vm.$set('sensor_total', vm.normal_total + vm.abnormal_total);
    }, 'json');

    $.get(API('/env/environments/floor_sensors/' + env_no), function (data) {
        vm.$set('all_small',data.rows.small_env);
        vm.$set('all_micro',data.rows.micro_env);
        vm.$set('env_sensor_total', data.total);
        vm.$set('small_env_sensor_list', data.rows.small_env);
        vm.$set('micro_env_sensor_list', data.rows.micro_env);
        //设备事件
        sensor();
    }, 'json');

    animate();

};

function gauge_chart(rate) {
    var value=(rate!='-')?'{value}%':'暂无数据';
    var myChart = echarts.init($('#gauge_chart')[0]);
    var option = {
        tooltip: {
            formatter: "{a} <br/>{b} : {c}%"
        },
        series: [
            {
                name: '环境',
                center: ['50%', '55%'],
                radius: '100%',
                type: 'gauge',
                data: [{value: rate, name: '达标率'}],
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
                    formatter: value,
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
    myChart.setOption(option);
    $('#gauge_chart').css('background','none');
}

function radar_chart(data) {
    var series_data = [], indicator = [];
    var name_list={
        '温度':'温度',
        '硫化污染物':'含硫',
        '无机污染物':'无机',
        '有机污染物':'有机',
        '二氧化碳':'co2',
        '湿度':'湿度'
    }
    _.each(data.rows, function (row) {
        series_data.push(row.rate == '-' ? 100 : row.rate);
        indicator.push({text: name_list[row.name], max: row.max});
    });
    console.log(series_data,'\n',indicator)
    var myChart = echarts.init($('#radar_chart')[0]);
    var option = {
        tooltip: {
            trigger: 'item'
        },
        polar: [
            {
                radius: '70%',
                indicator: indicator
            }
        ],
        calculable: true,
        series: [
            {
                name: '达标率',
                type: 'radar',
                data: [
                    {
                        value: series_data,
                        name: '当前区域:'
                    }
                ],
                symbol: 'circle',
                symbolSize: '6',
                itemStyle: {
                    normal: {
                        color: '#627383'
                    }
                },
                areaStyle: {
                    normal: {
                        color: '#53a06c',
                        opacity: 0.3
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
    $('#radar_chart').css('background','none');
}



function get_poles(param,time) {
    var key=(time)?time:'';
    $.get(API('/env/environments/floor_poles/' + vm.env_no + '/' + param)+'?time='+key, function (data) {
        console.log(API('/env/environments/floor_poles/' + vm.env_no + '/' + param)+'?time='+key)
        if (data == '[]') {
            return;
        }
        if (!data || !data['floor']) {
            return;
        }
        vm.$set('poles_list', data);
        vm.unit=data['floor']['unit'];
    }, 'json');
}

function animate() {

    //点击切换小环境或者设备部分的显示
    var nowKey='temperature',
        time='';
    $('.toggle_box .small_area').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        $('.area_content').slideDown(400).next().slideUp(400);
    });

    $('.toggle_box .equip').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        $('.equip_content').slideDown(400).prev().slideUp(400);
    });
    $('.switching span').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
        nowKey=$(this).attr('data-param');
        get_poles(nowKey,time);
    });
    
    var $timeLine=$('.timeLine'),
        $now_time=$timeLine.find('.now_time'),
        $time_box=$('.time_wrap .time_box');

    (function(){
        var key=true;
        $now_time.click(function(){
            if (key) {
                $(this).addClass('active');
                $timeLine.animate({'height':80});
            }else{
                $(this).removeClass('active');
                $timeLine.animate({'height':22});
            }
            key=!key;
        });
    })();

    $time_box.find('span').click(function(){
        $now_time.find('span:last-child').html($(this).html());
        $(this).addClass('active').siblings().removeClass('active');
        time=$(this).attr('data-time');
        get_poles(nowKey,time);
    });
}






function sensor(){
    var $sensor_form=$('.equip_content form'),
        $sensor_btn=$sensor_form.children();

    $sensor_btn.find('i').each(function(i){
        var width=(i==0)?200:100;
        $(this).click(function(e){
            $(this).addClass('active').parent().siblings().find('.icon').removeClass('active');
            $(this).parent().animate({width: width + "px"}).siblings().animate({width: "35px"});
            $(this).parent().addClass('flow').siblings().removeClass('flow');
            e.stopPropagation();
        })
    });

    $sensor_btn.find('input').click(function(e){
        e.stopPropagation();
    });

    $(document).click(function(){
        $sensor_btn.find('i').removeClass('active').parent().animate({width: "35px"}).removeClass('flow');
    });

    filter($sensor_btn);
}

function filter($sensor_btn){
    var $filter=$sensor_btn.find('.filter'),
        newArr=[];
    $filter.find('.font').click(function(e){
        e.stopPropagation();
    }).hover(function () {
        $(this).find('ul').stop().addClass('hover').css('display', '')
            .animate({'height': $(this).find('li').size() * 23 + 'px'});
    }, function () {
        $(this).find('ul').stop().removeClass('hover').animate({'height': '0px'}, function () {
            $(this).css('display', 'none');
        });
    });
    if(vm.small_env_sensor_list){
        for(var i=0;i<vm.small_env_sensor_list.length;i++){
            fil(vm.small_env_sensor_list[i].equip_type,newArr);
        }
    }
    if(vm.micro_env_sensor_list){
        for(var i=0;i<vm.micro_env_sensor_list.length;i++){
            fil(vm.micro_env_sensor_list[i].equip_type,newArr);
        }
    }
    vm.chooce=newArr;
}
//筛选种类
function fil(num, array) {
    var a = true;
    for (var i = 0; i < array.length; i++) {
        if (array[i] == num) {
            a = false;
        }
    }
    if (a) {
        array.push(num);
    }
}