//@require css/compare.css

/*tabs 功能模块*/
var tabs = {
    overview:'达标与稳定概况',
    history_overview:'历史达标与稳定概况',
    detail:'环境指标统计详情'
};
var legend_colors=[
    '#04aec7','#f92f79','#6a6cd1'
];
var area_colors=[
    'rgba(4,174,199,.15)','rgba(249,47,121,.15)','rgba(106,108,209,.15)'
];
var tabs_data_detail=[
    {key:'temperature',text:'温度'},
    {key:'humidity',text:'湿度'},
    {key:'light',text:'光照'},
    {key:'uv',text:'紫外'},
    {key:'voc',text:'VOC'}
];
var humidity_tabs_texture=[
    {key:'humidity1',text:'石质、陶器、瓷器'},
    {key:'humidity2',text:'铁质、青铜'},
    {key:'humidity3',text:'纸质、壁画、纺织品、漆木器、其他'},
    {key:'humidity4',text:'混合材质'}
];
var light_tabs_texture =[
    {key:'light1',text:'石质、陶器、瓷器、铁质、青铜'},
    {key:'light2',text:'纸质、壁画、纺织品'},
    {key:'light3',text:'漆木器、其他'},
    {key:'light4',text:'混合材质'}
];
var one_param_bar_option = {
    title:{
        text:'',
        textStyle:{
            color:'#3b404f',
            fontSize:16,
            fontWeight:'normal'
        },
        left:25,
        top:25
    },
    grid:{
        left:100,
        top:105,
        right:100,
        bottom:50
    },
    tooltip:{
        trigger:'axis',
        axisPointer:{
            type:'shadow',
            axis: 'x',
            shadowStyle:{
                opacity:0
            }
        },
        textStyle:{
            color: '#fff',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontFamily: 'sans-serif',
            fontSize: 10
        }
    },
    backgroundColor:'#ffffff',
    legend:{
        show:true,
        itemGap:10,
        itemWidth: 10,
        itemHeight: 10,
        top:60,
        left:25,
        data:[
            {
                name:'',//数据传入
                icon:'circle',
                textStyle:{
                    color:'#50566c',
                    fontSize:12
                }
            },
        ],
        formatter: function (name) {
            if(name.length>=10){
                return echarts.format.truncateText(name, 120, '12px Microsoft Yahei', '…');
            }else{
                return name;
            }
        },
        tooltip: {
            show: true,
            textStyle:{
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontFamily: 'sans-serif',
                fontSize: 10
            }
        }
    },
    color:legend_colors,
    yAxis:{
        type:'category',
        data:[],
        axisLabel :{
            interval:0,
            textStyle:{
                fontSize:14,
                color:'#3b404f'
            }
        },
        splitNumber:4,
        axisTick: {
            show: false,
            alignWithLabel: false,
            interval: 'auto',
            inside: false,
            length: 5,
        },
        axisLine:{
            //show:false
        },
        splitLine:{
            show:false
        }
    },
    xAxis:{
        type:'value',
        //data:[]
        name:'%',
        nameLocation:'end',
        nameGap:15,
        axisLabel:{
            textStyle:{
                fontSize:12,
                color:'#878da1'
            },
        },
        axisLine:{
            //show:false
        },
        axisTick:{
            show:false
        },
        splitLine:{
            show:false,
        }
    },
    series:[]
};
var bar_option={
    tooltip:{
        trigger:'axis',
        textStyle: {
            color: '#fff',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontSize: 12,
        },
        axisPointer:{
            type:'shadow',
            axis: 'x',
            shadowStyle:{
                opacity:0
            }
        }
    },
    color:legend_colors,
    legend:{
        show:false,
        data:[],
    },
    grid:{
        top:30,
        bottom:20,
        left:40,
        right:10,
    },
    xAxis:{
        type:'category',
        data:[],
        axisLabel :{
            interval:0,
            textStyle:{
                fontSize:10,
                color:'#484d5e'
            },
            show:false//取消x轴显示标签显示
        },
        splitNumber:4,
        axisTick: {
            show: false,
            alignWithLabel: false,
            interval: 'auto',
            inside: false,
            length: 5,
        },
        axisLine:{
            show:false
        },
        splitLine:{
            show:false
        }
    },
    yAxis:{
        type:'value',
        //data:[]
        name:'%',
        nameLocation:'end',
        nameGap:10,
        axisLabel:{
            textStyle:{
                fontSize:10,
                color:'#acb0bd'
            },
        },
        axisLine:{
            show:false
        },
        axisTick:{
            show:false
        },
        splitLine:{
            show:true,
            lineStyle:{
                color:'#e7e7e7'
            }
        }
    },
    series:[]
};

var radar_option = {
    title:{
        text:'',
        textStyle:{
            color:'#3b404f',
            fontSize:16,
            fontWeight:'normal'
        },
        left:25,
        top:25
    },
    grid:{
        left:0,
        right:0,
    },
    backgroundColor:'#fff',
    legend:{//图例配置
        show:true,
        itemGap:10,
        itemWidth: 10,
        itemHeight: 10,
        top:60,
        left:25,
        data:[
            {
                name:'',//数据传入
                icon:'circle',
                textStyle:{
                    color:'#50566c',
                    fontSize:12
                }
            },
        ],
        formatter: function (name) {
            if(name.length>=10){
                return echarts.format.truncateText(name, 120, '12px Microsoft Yahei', '…');
            }else{
                return name;
            }
        },
        tooltip: {
            show: true,
            textStyle:{
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontFamily: 'sans-serif',
                fontSize: 10
            }
        }
    },
    tooltip: {
        textStyle:{
            color: '#fff',
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontFamily: 'sans-serif',
                fontSize: 10
        },
        formatter:function(params){
            var result = '';
            result += params.name + '<br/>';
            if(params.data.value&&params.data.indicator){
                $.each(params.data.indicator,function(i,n){
                    result += n.name +':'+ (params.data.value[i]===null?'-':params.data.value[i])+'<br/>';
                });
            }
            return result;
        }
    },
    radar:{
        radius:'55%',
        indicator: [],//数据传入
        center: ['50%', '60%'],
        nameGap:5,
        axisLine:{
            show:true,
            lineStyle:{
                color:'#b2b7c6',
                width:2
            }
        },
        axisLabel:{
            textStyle:{
                color:'#b2b7c6'
            }
        },
        shape:'circle',
        splitLine:{
            lineStyle:{
                color:'#d1d7da',
                type:'dotted'
            }
        },
        splitArea:{
            areaStyle:{
                color:'#ffffff'
            }
        },
        name:{
            formatter:function(value,indicator){
                return value+'(%)';
            }
        },
        splitNumber:5
    },
    series: [
        {
            type: 'radar',
            data : []
        }
    ]
};

var line_option = {
    title:{
        text:'',
        textStyle:{
            fontSize:14,
            color:'#484d5e',
        },
        left:40,
        top:15,
    },
    legend:{
        top:15,
        right:40,
        data:[],
        formatter: function (name) {
            if(name.length>10){
                return echarts.format.truncateText(name, 120, '14px Microsoft Yahei', '…');
            }else{
                return name;
            }
        },
        tooltip: {
            show: true
        },
        textStyle:{
            color:'#878da1',
            fontSize:12
        }
    },
    color:legend_colors,
    xAxis:{
        type:'category',
        data:[],
        axisLine: {
            show:false
        },
        axisTick: {
            show:false,
            alignWithLabel:true,
        },
        axisLabel: {
            show:true,
            interval:0,
        },
    },
    yAxis:{
        type:'value',
        name:'%',
        nameLocation:'end',
        nameGap:5,
        axisLine: {
            show:false
        },
        axisTick: {
            show:false,
            alignWithLabel:true,
        },
        axisLabel: {
            formatter:function(value){
                return value;
            }
        },
        max:'dataMax',
        min:'dataMin',
        scale:true,
    },
    series:[],
    tooltip: {
        trigger:'axis',
        textStyle:{
            color: '#fff',
            fontStyle: 'normal',
            fontWeight: 'normal',
            fontFamily: 'sans-serif',
            fontSize: 10
        },
        formatter:function(params){
            var str = '';
            if(Array.isArray(params)&&params[0]&&params[0].componentType=='series'){//
                $.each(params,function(i,n){
                    str += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+n.color+'"></span>'+ (n.name.length==8?formatter_str_time(n.name): n.name) +':' + (n.value?n.value:'-')+'<br/>';
                })
            }else{
                str += '<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:'+params.color+'"></span>'+params.name+':'+ params.value;
            }
            return str;
        }
    },
};



//初始化折线图配置项
var init_line = function(data,time_type){
    //console.log(data);
    var option_copy = {};
    for(var key in line_option){
        option_copy[key] = line_option[key];
    }
    option_copy.title.text = (data.title=='历史稳定性-湿度（离散系数）'?'历史离散系数-湿度':data.title=='历史稳定性-温度（离散系数）'?'历史离散系数-温度':data.title);
    option_copy.xAxis.data = data.date;//x轴点数
    option_copy.legend.data = data.names;
    option_copy.series=[];

    if(time_type == 'month'){//当时间参数为'本月'
        option_copy.xAxis.axisLabel.formatter = function(value){
            if(value){
                return formatter_str_time(value);
            }
        };
        if(data.date&&data.date.length>=10&&data.date.length<=21){

            option_copy.xAxis.axisLabel.interval = 2;
        }else if(data.date&&data.date.length>=22&&data.date.length<=31){
            option_copy.xAxis.axisLabel.interval = 4;
        }
    }else if(time_type == 'week'){//当时间参数为'本周'
        option_copy.xAxis.axisLabel.formatter = function(value){
            return value;
        };
    }
    if(data.list&&data.list.length!=0){
        $.each(data.list,function(i,n){
            option_copy.series.push({
                type:'line',
                name: n.name,
                data: n.data,
                symbol: 'circle',
                symbolSize: 8,
                markPoint:{
                    symbol:'emptyCircle',
                    symbolSize: 12,
                    label:{
                        normal:{
                            show:false,
                        }
                    },
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                markLine: {
                    data: [
                        {type: 'average', name: '平均数'}
                    ],
                    label:{
                        normal:{
                            formatter:function(params){
                                return params.value;
                            }
                        }
                    }
                }
            })
        });
    }
    console.log(option_copy);
    return option_copy;
};

//初始化柱状图配置项
var init_bars = function(data){
    var option_copy = {};
    for(var key in bar_option){
        option_copy[key] = bar_option[key];
    }
    option_copy.xAxis.data=data.xdata;
    option_copy.legend.data = [];
    option_copy.series = [];
    if(data.data&&data.data.length!=0){
        $.each(data.data,function(i,n){
            option_copy.legend.data.push(n.name);
            option_copy.series.push({
                type:'bar',
                name: n.name,
                data: n.data,
                barWidth:14
            });
        });
    }
    return option_copy;
};

//初始化只有一个参数的水平柱状图
var init_one_param_bar = function(data,name){
    var option_copy = {};
    for(var key in one_param_bar_option){
        option_copy[key] = one_param_bar_option[key];
    }
    option_copy.legend.data = [];
    option_copy.series = [];
    option_copy.title.text=name;
    option_copy.yAxis.data = data.ydata;
    if(data.legend&&data.legend.length!=0){
        $.each(data.legend,function(i,n){
            option_copy.legend.data.push({
                name:n,
                icon:'circle',
                textStyle:{
                    color:'#50566c',
                    fontSize:12
                }
            })
        });
    }
    if(data.xdata&&data.xdata.length!=0){
        $.each(data.xdata,function(i,n){
            option_copy.series.push({
                type:'bar',
                name : n.name,
                barWidth:16,
                data: n.value,
                barGap:'80%'
            })
        });
    }
    return option_copy;
};

//初始化雷达图配置项
var init_radar = function(data,name){
    var option_copy = {};
    for(var key in radar_option){
        option_copy[key] = radar_option[key];
    }
    option_copy.legend.data=[];
    option_copy.series[0].data=[];
    if(data.legend&&data.legend.length!=0){
        $.each(data.legend,function(i,n){
            option_copy.legend.data.push({
                name:n,
                icon:'circle',
                textStyle:{
                    color:'#50566c',
                    fontSize:12
                }
            })
        });
    }
    if(data.data&&data.data.length!=0){
        $.each(data.data,function(i,n){
            option_copy.series[0].data.push({
                value : n.value,
                name : n.name,
                indicator:data.indicator,
                symbol:'circle',
                symbolSize:6,
                areaStyle:{
                    normal:{
                        color:area_colors[i]
                    }
                },
                lineStyle:{
                    normal:{
                        color:legend_colors[i],
                        width:1.2
                    }
                },
                itemStyle:{
                    normal:{
                        color:legend_colors[i]
                    }
                }
            })
        });
    }
    option_copy.radar.indicator = data.indicator;
    option_copy.title.text=name;
    //console.log(option_copy);
    return option_copy;
};

var formatter_str_time = function(time_str){
    if(time_str){
        var year='',
            month='',
            day='';
        if(time_str&&time_str.length!=0){
            //0-3位为年份
            year = time_str.substring(0,4);
            //4-5位为月份
            month = time_str.substring(4,6);
            //6-7位为月份
            day = time_str.substring(6);
        }
        //return year+'年'+month+'月'+day+'日';
        return month+'月'+day+'日';
    }
};

var compare=Vue.extend({
    template:'#compare',
    data:function(){
        return {
            tabs:tabs,
            tab_name:'overview',
            compare_list:[],
            //show_museum_list:false,//写入共用的头部
            overview_bars:{},
            //legend_colors:legend_colors,
            legend_data:[],
            mids:'-1',//博物馆序号字符串，初始默认为-1，不选择任何博物馆，返回空地图
            sel_env:'',
            sel_time:'',
            sel_params:'',
            analysis_compliance:null,
            analysis_compliance_data:null,
            analysis_temperature:null,
            analysis_temperature_data:null,
            analysis_humidity:null,
            analysis_humidity_data:null,
            all_compliance:null,
            all_scatter:null,
            msg:'',
            history_compliance:null,
            history_scatter_temperature:null,
            history_scatter_humidity:null,
            show_lines:true,//默认显示折线图
            is_collapse:true,//标志位明确表格是否展开或者收起
            stack_bar_order:'',//纪录堆叠柱状图表格的排序信息
            stack_bar_data:[],
            stack_bar_max:100,
            stack_bar_min:0,
            tabs_data_detail:tabs_data_detail,//tabs数据
            humidity_tabs_texture:humidity_tabs_texture,//湿度材质tab数据
            light_tabs_texture:light_tabs_texture,//光照材质tab数据
            curr_info_data:{},
            curr_humidity_texture:'石质、陶器、瓷器',//默认湿度分选中材质
            curr_light_texture:'石质、陶器、瓷器、铁质、青铜',//默认光照分材质选中材质
            abnormal_status:false,//异常提示框状态
            curr_param_tab:'',
            bar_num:3,//默认显示温湿度及概况统计
            map_name:'china',//保存区域信息,默认为中国
            search_stack_bar_name:'',
            abnormal_list:[],
            wave_abnormal_list:[],
            btime:'',
            etime:'',
            compare_with_time:false,//是否开启按时间排序标志位
            env_list:{
                cabinet:'展柜',
                hall:'展厅',
                storeroom:'库房'
            },
            legends_status:{//对比页面概况图例状态三个图例的开关
                legend0:true,
                legend1:true,
                legend2:true
            }
        }
    },
    computed:{
        filtered_stack_bar_data:function(){
            var me = this;
            if((me.search_stack_bar_name!='')&&me.stack_bar_data){
                return me.stack_bar_data.filter(function (data) {
                    return data.name.indexOf(me.search_stack_bar_name) !== -1;
                });
            }else{
                setTimeout(function(){
                    me.resize_table(me.is_collapse);
                    me.reload_stack_bar();
                },0);
                return me.stack_bar_data;
            }
        },
        cn_name:function(){
            var str='';
            if(this.small_id=='distance'){
                str='极差';
            }else if(this.small_id=='compliance'){
                str='达标率';
            }else if(this.small_id=='count_abnormal'){
                str='异常值';
            }else if(this.small_id=='average'){
                str='均值';
            }else if(this.small_id=='standard'){
                str='标准差';
            }else if(this.small_id=='wave'){
                str='日波动';
            }else if(this.small_id=='wave_normal'){
                str='剔除异常的日波动';
            }
            return str;
        }
    },
    route:{
        data:function(data){
            if(data.from.params){
                this.compare_list = data.from.params.compare_list;
                this.$route.params.compare_list = this.compare_list;
            }
        }
    },
    watch:{
        analysis_compliance_data:function(){

        },
        analysis_temperature_data:function(){

        },
        analysis_humidity_data:function(){

        },
        compare_list:{
            handler:function(){//监听执行多次,不可靠

            },
            deep:true,
            immediately:true
        }
    },
    created:function(){
        //console.log(laydate.now(-2));//获取前天的日期字符串
        //console.log(laydate.now(-1));//获取昨天的日期字符串
    },
    ready:function(){
        var me = this;
        var WIDTH = document.body.clientWidth;
        $('.fixed_top').css('width',WIDTH-200+'px');
        calc_size();
        $(window).resize(function(){
            var content_width = document.body.clientWidth;
            $('.fixed_top').css('width',content_width-200+'px');
            if(me.$el){
                calc_size();
                setTimeout(function(){
                    me.charts_resize();
                },0);
            }
        });
        //初始化全部图表组件
        this.init_container();
        this.get_position_map_data();
        if(!this.compare_list||this.compare_list.length==0){
            this.init_tips();
            this.legend_data=[];
            // this.no_museum_charts();
            //当没有博物馆被选中时
            this.msg='您还未选中任何博物馆,请点击页面上方的"+"号添加所须对比的博物馆';
            this.show_lines=false;
            $('#compare_dimmer').dimmer('show');
            return;
        }
        this.reload_page();
    },
    methods:{
        no_museum_charts:function(){//重置所有图表,如果没有博物馆的时候,调用这个方法
            var me = this;
            if(this.tab_name=='overview'){
                if(this.analysis_compliance){
                    this.analysis_compliance.clear();
                    this.analysis_compliance.setOption({
                        series:[],
                        title:{
                            text:'暂无数据',
                            left:'center',
                            top:'middle',
                            textStyle:{
                                fontWeight:'normal',
                                fontSize:14,
                                color:'#51576d'
                            }
                        },
                        backgroundColor:'#ffffff'
                    },true);
                    setTimeout(function(){
                        me.analysis_compliance.resize();
                    },0);
                }
                if(this.analysis_temperature){
                    this.analysis_temperature.clear();
                    this.analysis_temperature.setOption({
                        series:[],
                        title:{
                            text:'暂无数据',
                            left:'center',
                            top:'middle',
                            textStyle:{
                                fontWeight:'normal',
                                fontSize:14,
                                color:'#51576d'
                            }
                        },
                        backgroundColor:'#ffffff'
                    },true);
                    setTimeout(function(){
                        me.analysis_temperature.resize();
                    },0);
                }
                if(this.analysis_humidity){
                    this.analysis_humidity.clear();
                    this.analysis_humidity.setOption({
                        series:[],
                        title:{
                            text:'暂无数据',
                            left:'center',
                            top:'middle',
                            textStyle:{
                                fontWeight:'normal',
                                fontSize:14,
                                color:'#51576d'
                            }
                        },
                        backgroundColor:'#ffffff'
                    },true);
                    setTimeout(function(){
                        me.analysis_humidity.resize();
                    },0);
                }
                if(this.all_compliance){
                    this.all_compliance.clear();
                    this.all_compliance.setOption({
                        series:[],
                        title:{
                            text:'暂无数据',
                            left:'center',
                            top:'middle',
                            textStyle:{
                                fontWeight:'normal',
                                fontSize:14,
                                color:'#51576d'
                            }
                        },
                        backgroundColor:'#ffffff',
                        color:legend_colors,
                        legend:{
                            data:this.compare_list
                        },
                    },true);
                    setTimeout(function(){
                        me.all_compliance.resize();
                    },0);
                }
                if(this.all_scatter){
                    this.all_scatter.clear();
                    this.all_scatter.setOption({
                        series:[],
                        title:{
                            text:'暂无数据',
                            left:'center',
                            top:'middle',
                            textStyle:{
                                fontWeight:'normal',
                                fontSize:14,
                                color:'#51576d'
                            }
                        },
                        backgroundColor:'#ffffff',
                        color:legend_colors,
                        legend:{
                            data:this.compare_list
                        },
                    },true);
                    setTimeout(function(){
                        me.all_scatter.resize();
                    },0);
                }
            }
            if(this.tab_name=='history_overview'){
                if(this.history_compliance){
                    this.history_compliance.clear();
                    this.history_compliance.setOption({
                        series:[],
                        title:{
                            text:'暂无数据',
                            left:'center',
                            top:'middle',
                            textStyle:{
                                fontWeight:'normal',
                                fontSize:14,
                                color:'#51576d'
                            }
                        },
                        backgroundColor:'#ffffff'
                    },true);
                    setTimeout(function(){
                        me.history_compliance.resize();
                    },0);
                }
                if(this.history_scatter_temperature){
                    this.history_scatter_temperature.clear();
                    this.history_scatter_temperature.setOption({
                        series:[],
                        title:{
                            text:'暂无数据',
                            left:'center',
                            top:'middle',
                            textStyle:{
                                fontWeight:'normal',
                                fontSize:14,
                                color:'#51576d'
                            }
                        },
                        backgroundColor:'#ffffff'
                    },true);
                    setTimeout(function(){
                        me.history_scatter_temperature.resize();
                    },0);
                }
                if(this.history_scatter_humidity){
                    this.history_scatter_humidity.clear();
                    this.history_scatter_humidity.setOption({
                        series:[],
                        title:{
                            text:'暂无数据',
                            left:'center',
                            top:'middle',
                            textStyle:{
                                fontWeight:'normal',
                                fontSize:14,
                                color:'#51576d'
                            }
                        },
                        backgroundColor:'#ffffff'
                    },true);
                    setTimeout(function(){
                        me.history_scatter_humidity.resize();
                    },0);
                }
            }
            if(this.tab_name=='detail'){

            }
            this.$broadcast('no_museum_map',this.map_name);
        },
        show_abnormal:function(e,data,type){
            this.abnormal_list =[];
            this.wave_abnormal_list=[];
            if(this.abnormal_timer){
                clearTimeout(this.abnormal_timer);
                this.abnormal_timer = null;
                this.abnormal_status = true;
            }
            var _top=e.clientY-320,_left,_width=230,page_width=$(document).width();
            if((e.clientX+_width)>=(page_width-20)){//弹窗右侧超出页面边界
                _left = page_width+$('section').scrollLeft()-_width-230-20;
            }else{
                _left = e.clientX+$('section').scrollLeft()-230;
            }
            //分材质的时候
            if($(e.target).hasClass('count_abnormal')){
                this.abnormal_status = true;
                $('#abnormal_info').removeClass('loaded').css({'top':_top+$('section').scrollTop()+20+'px','left': _left+'px'});
                this.get_abnormal_data(data);
            }else if($(e.target).find('b.status').length!=0){
                this.abnormal_status = true;
                $('#abnormal_info').removeClass('loaded').css({'top':_top+$('section').scrollTop()+20+'px','left': _left+'px'});
                //请求异常数据
                if(type=='wave'){
                    this.get_wave_data(data,0);
                }else if(type=='wave_normal'){
                    this.get_wave_data(data,1);
                }
            }else{
                this.abnormal_status = false;
            }
        },
        get_abnormal_data:function(data){
            this.abnormal_list = data.value_abnormal;
            $('#abnormal_info').addClass('loaded');
        },
        get_wave_data:function(data,type){//波动异常数据等待完善
            if(type==0){
                this.wave_abnormal_list = data.wave_abnormal;
            }else if(type==1){
                this.wave_abnormal_list = data.wave_abnormal2;
            }
            $('#abnormal_info').addClass('loaded');
        },
        in_abnormal:function(){
            var me = this;
            if(this.abnormal_timer){
                clearTimeout(this.abnormal_timer);
                me.abnormal_timer = null;
                me.abnormal_status = true;
            }
        },
        hide_abnormal:function(){
            var me = this;
            this.abnormal_timer = setTimeout(function(){
                me.abnormal_status = false;
                me.abnormal_timer = null;
                me.abnormal_list = [];
                me.wave_abnormal_list = [];
            },200);
        },
        choose_texture:function(texture){
            var me =this;
            if(this.curr_param_tab=='humidity'){
                this.curr_humidity_texture = texture;
            }else if(this.curr_param_tab=='light'){
                this.curr_light_texture = texture;
            }
            this.curr_page_data = this.get_curr_data(this.param_details_data[this.curr_param_tab]);
            this.set_curr_data(this.curr_page_data);
            me.$broadcast('init_thumbnail',me.tab_name,me.curr_page_data.table,me.curr_page_data.unit);
            this.is_collapse = true;
            this.resize_table(this.is_collapse);
        },
        show_legend:function(key,date){
            if(date){
                $('div.wrapper[data-date='+date+'] div.symbol>div').show();
            }else{
                $('div.wrapper[data-key='+key+'] div.symbol>div').show();
            }
        },
        hide_legend:function(key,date){
            if(date){
                $('div.wrapper[data-date='+date+'] div.symbol>div').hide();
            }else{
                $('div.wrapper[data-key='+key+'] div.symbol>div').hide();
            }
        },
        table_collapse:function() {//点击表格展开事件
            this.is_collapse = !this.is_collapse;
            this.resize_table(this.is_collapse);
        },
        resize_table:function(mark){
            this.reload_stack_bar();
            if(mark){
                $('div.museum_table.detail>div.table>div.tr>div').css('width','25%');
            }else{
                if(this.curr_param_tab=='temperature'||this.curr_param_tab=='humidity'){
                    $('div.museum_table.detail>div.table>div.tr>div').css('width','8%');
                    $('div.museum_table.detail>div.table>div.tr>div.wave').css('width','13%');
                    $('div.museum_table.detail>div.table>div.tr>div.m_name,div.museum_table.detail>div.table>div.tr>div.m_data').css('width','15%');
                }else{
                    $('div.museum_table.detail>div.table>div.tr>div').css('width','13%');
                    $('div.museum_table.detail>div.table>div.tr>div.m_name,div.museum_table.detail>div.table>div.tr>div.m_data').css('width','25%');
                }
            }
        },
        calc_bar_container_size:function(num) {//计算柱状图容器尺寸,个数受到顶部params的影响
            //var MAIN_HEIGHT = $('#app section').height();
            //var ch = MAIN_HEIGHT - 70 - 83;
            //$('.left>div.wrapper>div').css('height', (ch - (num-1)*10)/num + 'px');
        },
        load_stack_bar:function(){//加载堆叠柱状图
            this.$broadcast('load_stack_bar');
        },
        reset_stack_bar:function(){//重置堆叠柱状图
            this.$broadcast('reset_stack_bar');
        },
        reload_stack_bar:function(){
            this.reset_stack_bar();
            this.load_stack_bar();
        },
        sort_stack_bar:function(key,order){//排序
            var me = this;
            this.stack_bar_order = key+order;
            if(key=='wave'){//波动值按波动最大值排序
                this.stack_bar_data.sort(function(a,b){//没有值默认为-1
                    if(order=='asc'){
                        return (a['wave_max']?a['wave_max'].value:-1) - (b['wave_max']?b['wave_max'].value:-1);
                    }else{
                        return (b['wave_max']?b['wave_max'].value:-1) - (a['wave_max']?a['wave_max'].value:-1);
                    }
                });
            }else if(key=='wave_normal') {//剔除异常的波动值按最大值排序
                this.stack_bar_data.sort(function(a,b){//没有值默认为-1
                    if(order=='asc'){
                        return (a['wave_max2']?a['wave_max2'].value:-1) - (b['wave_max2']?b['wave_max2'].value:-1);
                    }else{
                        return (b['wave_max2']?b['wave_max2'].value:-1) - (a['wave_max2']?a['wave_max2'].value:-1);
                    }
                });
            }else{//常规数值按值排序
                this.stack_bar_data.sort(function(a,b){
                    if(order=='asc'){
                        return (a[key]||-1)-(b[key]||-1);
                    }else{
                        return (b[key]||-1)-(a[key]||-1);
                    }
                });
            }
            setTimeout(function(){
                me.reload_stack_bar();
            },0);
        },
        search_museum_detail:function(){

        },
        hide_compare_dimmer:function(){
            $('#compare_dimmer').dimmer('hide');
        },
        charts_resize:function(){//重绘echarts
            if(this.tab_name=='overview'){
                if(this.analysis_compliance){
                    this.analysis_compliance.resize();
                }
                if(this.analysis_temperature){
                    this.analysis_temperature.resize();
                }
                if(this.analysis_humidity){
                    this.analysis_humidity.resize();
                }
                if(this.all_compliance){
                    this.all_compliance.resize();
                }
                if(this.all_scatter){
                    this.all_scatter.resize();
                }
            }
            if(this.tab_name=='history_overview'){
                if(this.history_compliance){
                    this.history_compliance.resize();
                }
                if(this.history_scatter_temperature){
                    this.history_scatter_temperature.resize();
                }
                if(this.history_scatter_humidity){
                    this.history_scatter_humidity.resize();
                }
            }
            if(this.tab_name=='detail'){

            }
        },
        init_tips:function(){
            if(this.tab_name=='overview'){
                $('#all_scatter_tips').popup({
                    html:'<ul class="tips"><li>该数值越小说明监测数据越稳定;</li><li>一般来说离散系数大于15%则可认定为数据不正常,请重点关注;</li><li>计算公式为:离散系数=（标准差/平均值）× 100%;</li><li>湿度离散系数是按材质分类计算求平均数所得,若数值较大则可能是该博物馆的环境未关联文物.</li></ul>',
                    position:'left center',
                });
            }else if(this.tab_name=='history_overview'){

            }else if(this.tab_name=='detail'){
                $('#abnormal_help').popup({
                    html:'<p>异常值为离群值，<br/>与达标与否无关。</p>',
                    position:'left center',
                });
                $('#wave_help').popup({
                    html:'<p>剔除异常值</p>',
                    position:'left center',
                });
            }
        },
        reload_page:function(){
            var me = this;
            this.init_tips();
            if(!this.compare_list||this.compare_list.length==0){
                this.legend_data=[];
                this.no_museum_charts();
                //当没有博物馆被选中时
                this.msg='您还未选中任何博物馆,请点击页面上方的"+"号添加所须对比的博物馆';
                this.show_lines=false;
                $('#compare_dimmer').dimmer('show');
                if(this.tab_name=='detail'){
                    this.stack_bar_data=[];
                }
                return;
            }
            var museum_arr = [];
            $.each(this.compare_list,function(i,n){
                museum_arr.push(n.mid);
            });
            this.mids = museum_arr.join(',');
            if(this.tab_name=='overview'){
                this.init_overview();
            }
            if(this.tab_name=='history_overview'){
                this.init_history_overview();
            }
            if(this.tab_name=='detail'){
                this.init_detail();
            }
            this.get_position_map_data();
            setTimeout(function(){
                me.charts_resize();
            },0);
        },
        init_overview:function(btime,etime){
            this.get_legend_data(btime,etime);
            this.get_compliance_data(btime,etime);
            this.get_temperature_data(btime,etime);
            this.get_humidity_data(btime,etime);
            this.get_radar_compliance_data(btime,etime);
            this.get_radar_scatter_data(btime,etime);
        },
        init_history_overview:function(btime,etime){
            this.get_history_compliance_data(btime,etime);
            this.get_history_scatter_temperature_data(btime,etime);
            this.get_history_scatter_humidity_data(btime,etime);
        },
        compare_with_time_reload_page:function(btime,etime){
            this.btime = formatter_time(btime);
            this.etime = formatter_time(etime);
            if(!this.compare_with_time){
                return;
            }
            var museum_arr = [],
                me = this;
            $.each(this.compare_list,function(i,n){
                museum_arr.push(n.mid);
            });
            this.mids = museum_arr.join(',');
            if(this.tab_name=='overview'){
                this.init_overview(this.btime,this.etime);
            }
            if(this.tab_name=='history_overview'){
                this.init_history_overview(this.btime,this.etime);
            }
            if(this.tab_name=='detail'){
                this.init_detail(this.btime,this.etime);
            }
            this.get_position_map_data(this.btime,this.etime);
            setTimeout(function(){
                me.charts_resize();
            },0);
        },
        get_curr_data:function(data){//判断材质，并取得当前参数当前材质下的数据
            var result='',me = this;
            me.curr_param_unit=data.unit;//获取当前参数的单位
            if(data){
                if(me.sel_env!='hall') {
                    //只有当环境选择为非展厅，并且参数为湿度和光照时，区分材质
                    if (me.curr_param_tab == 'humidity') {
                        if (data.data&&data.data.length != 0) {
                            $.each(data.data, function (i, n) {
                                if (me.curr_humidity_texture == n.texture) {
                                    me.stack_bar_max = n.right;
                                    me.stack_bar_min = n.left;
                                    result = n.list;
                                }
                            });
                        }
                    }else if(me.curr_param_tab=='light'){
                        if (data.data&&data.data.length != 0) {
                            $.each(data.data, function (i, n) {
                                if (me.curr_light_texture == n.texture) {
                                    me.stack_bar_max = n.right;
                                    me.stack_bar_min = n.left;
                                    result = n.list;
                                }
                            });
                        }
                    }else{
                        me.stack_bar_max = data.right;
                        me.stack_bar_min = data.left;
                        result = data.list;
                    }
                }else{
                    me.stack_bar_max = data.right;
                    me.stack_bar_min = data.left;
                    result = data.list;
                }
            }
            return result;
        },
        set_curr_data:function(data){
            var me = this;
            me.stack_bar_data = data;
        },
        init_detail:function(btime,etime){
            this.is_collapse = true;
            this.$broadcast('check_bubble_tabs','',this.tab_name);
            this.resize_table(this.is_collapse);
            this.get_param_details_data(btime,etime);
        },
        get_param_details_data:function(btime,etime){
            var me = this;
            this.stack_bar_data=[];
            if(this.compare_with_time&&btime&&etime){
                $.get(API('/base/analysis/details/data_by_time?env_type='+this.sel_env+'&btime='+btime+'&etime='+etime+'&env_param='+(this.sel_params.join(','))+'&mid='+this.mids),function(data){
                    if(data.error){
                        me.curr_page_data=[];
                        return;
                    }
                    me.param_details_data = data;
                    me.curr_page_data = me.get_curr_data(me.param_details_data[me.curr_param_tab]);
                    me.set_curr_data(me.curr_page_data);
                });
            }else{
                $.get(API('/base/analysis/details/data?env_type='+this.sel_env+'&definite_time='+this.sel_time+'&env_param='+(this.sel_params.join(','))+'&mids='+this.mids),function(data){
                    if(data.error){
                        return;
                    }
                    me.param_details_data = data;
                    me.curr_page_data = me.get_curr_data(me.param_details_data[me.curr_param_tab]);
                    me.set_curr_data(me.curr_page_data);
                });
            }
        },
        toggle_tabs:function(key){
            this.tab_name = key;
            if(this.compare_with_time){
                this.compare_with_time_reload_page(this.btime,this.etime);
            }else{
                this.reload_page();
            }
        },
        un_sel_museum:function(item){
            this.compare_list.$remove(item);
            this.$dispatch('_compare',this.compare_list);
            this.reload_page();
        },
        init_container:function(){
            var me = this;
            me.history_compliance = echarts.init(document.getElementById('history_compliance'));
            me.history_scatter_temperature = echarts.init(document.getElementById('history_scatter_temperature'));
            me.history_scatter_humidity = echarts.init(document.getElementById('history_scatter_humidity'));
            me.analysis_compliance=echarts.init(document.getElementById('analysis_compliance'));
            me.analysis_temperature=echarts.init(document.getElementById('analysis_temperature'));
            me.analysis_humidity=echarts.init(document.getElementById('analysis_humidity'));
            me.all_compliance = echarts.init(document.getElementById('all_compliance'));
            me.all_scatter = echarts.init(document.getElementById('all_scatter'));
        },
        get_history_compliance_data:function(btime,etime){//按时间对比无意义
            var me = this;
            if(this.compare_with_time&&btime&&etime){
                return;
            }else{
                $.get(API('/base/analysis/history/compliance?env_type='+this.sel_env+'&definite_time='+this.sel_time+'&env_param='+(this.sel_params.join(','))+'&mids='+this.mids),function(data){
                    if(data.error){
                        me.show_lines = false;
                        return;
                    }
                    me.show_lines = true;
                    me.history_compliance.clear();
                    me.history_compliance.setOption(init_line(data,me.sel_time),true);
                    setTimeout(function(){
                        me.history_compliance.resize();
                    },0);
                });
            }
        },
        get_history_scatter_temperature_data:function(btime,etime){//按时间对比无意义
            var me = this;
            if(this.compare_with_time&&btime&&etime){
                return;
            }else{
                $.get(API('/base/analysis/history/scatter_temperature?env_type='+this.sel_env+'&definite_time='+this.sel_time+'&env_param='+(this.sel_params.join(','))+'&mids='+this.mids),function(data){
                    if(data.error){
                        me.show_lines = false;
                        return;
                    }
                    me.history_scatter_temperature.clear();
                    me.history_scatter_temperature.setOption(init_line(data,me.sel_time),true);
                    setTimeout(function(){
                        me.history_scatter_temperature.resize();
                    },0);
                });
            }
        },
        get_history_scatter_humidity_data:function(btime,etime){//按时间对比无意义
            var me = this;
            if(this.compare_with_time&&btime&&etime){
                return;
            }else{
                $.get(API('/base/analysis/history/scatter_humidity?env_type='+this.sel_env+'&definite_time='+this.sel_time+'&env_param='+(this.sel_params.join(','))+'&mids='+this.mids),function(data){
                    if(data.error){
                        me.show_lines = false;
                        return;
                    }
                    me.history_scatter_humidity.clear();
                    me.history_scatter_humidity.setOption(init_line(data,me.sel_time),true);
                    setTimeout(function(){
                        me.history_scatter_humidity.resize();
                    },0);
                });
            }
        },
        get_position_map_data:function(btime,etime){
            var me = this;
            if(this.compare_with_time&&btime&&etime){
                $.get(API('/base/area/situation/map_by_time?env_type='+this.sel_env+'&btime='+btime+'&etime='+etime+'&env_param='+(this.sel_params.join(','))+'&mid='+this.mids),function(data){
                    if(data.error){
                        return;
                    }
                    if(data.map_name){
                        me.map_name = data.map_name;
                    }
                    if(data.data){
                        me.$broadcast('init_map_chart','compare',data);//整个对比模块公用一个地图组件
                    }else{
                        me.$broadcast('no_museum_map',me.map_name);
                    }
                });
            }else{
                $.get(API('/base/area/situation/map?env_type='+this.sel_env+'&definite_time='+this.sel_time+'&env_param='+(this.sel_params.join(','))+'&mids='+this.mids),function(data){
                    if(data.error){
                        return;
                    }
                    if(data.map_name){
                        me.map_name = data.map_name;
                    }
                    if(data.data){
                        me.$broadcast('init_map_chart','compare',data);//整个对比模块公用一个地图组件
                    }else{
                        me.$broadcast('no_museum_map',me.map_name);
                    }
                });
            }
        },
        get_legend_data:function(btime,etime){
            var me = this;
            if(this.compare_with_time&&btime&&etime){
                $.get(API('/base/analysis/analysis_counts?&btime='+btime+'&etime='+etime+'&env_type='+this.sel_env+'&mids='+this.mids),function(data){
                    if(data.error){
                        return;
                    }
                    me.legend_data = data;
                });
            }else{
                $.get(API('/base/area/analysis_counts?env_type='+this.sel_env+'&mids='+this.mids),function(data){
                    if(data.error){
                        return;
                    }
                    me.legend_data = data;
                });
            }
        },
        get_compliance_data:function(btime,etime){
            var me = this;
            if(this.compare_with_time&&btime&&etime){
                $.get(API('/base/analysis/analysis_compliance?env_type='+this.sel_env+'&btime='+btime+'&etime='+etime+'&env_param='+(this.sel_params.join(','))+'&mids='+this.mids),function(data){
                    if(data.error){
                        return;
                    }
                    me.analysis_compliance_data = data;
                    me.analysis_compliance.clear();
                    //调用一个初始化柱状图的方法
                    me.analysis_compliance.setOption(init_bars(data),true);
                });
            }else{
                //console.log(this.sel_params);
                $.get(API('/base/area/analysis_compliance?env_type='+this.sel_env+'&definite_time='+this.sel_time+'&env_param='+(this.sel_params.join(','))+'&mids='+this.mids),function(data){
                    if(data.error){
                        return;
                    }
                    me.analysis_compliance_data = data;
                    me.analysis_compliance.clear();
                    //调用一个初始化柱状图的方法
                    me.analysis_compliance.setOption(init_bars(data),true);
                });
            }
        },
        get_temperature_data:function(btime,etime){
            var me = this;
            if(this.compare_with_time&&btime&&etime){
                $.get(API('/base/analysis/analysis_temperature?env_type='+this.sel_env+'&btime='+btime+'&etime='+etime+'&env_param='+(this.sel_params.join(','))+'&mids='+this.mids),function(data){
                    if(data.error){
                        return;
                    }
                    me.analysis_temperature_data = data;
                    me.analysis_temperature.clear();
                    //初始化稳定性统计概况温度
                    me.analysis_temperature.setOption(init_bars(data),true);
                });
            }else{
                $.get(API('/base/area/analysis_temperature?env_type='+this.sel_env+'&definite_time='+this.sel_time+'&env_param='+(this.sel_params.join(','))+'&mids='+this.mids),function(data){
                    if(data.error){
                        return;
                    }
                    me.analysis_temperature_data = data;
                    me.analysis_temperature.clear();
                    //初始化稳定性统计概况温度
                    me.analysis_temperature.setOption(init_bars(data),true);
                });
            }
        },
        get_humidity_data:function(btime,etime){
            var me = this;
            if(this.compare_with_time&&btime&&etime){
                $.get(API('/base/analysis/analysis_humidity?env_type='+this.sel_env+'&btime='+btime+'&etime='+etime+'&env_param='+(this.sel_params.join(','))+'&mids='+this.mids),function(data){
                    if(data.error){
                        return;
                    }
                    me.analysis_humidity_data = data;
                    me.analysis_humidity.clear();
                    //初始化稳定性统计概况湿度
                    me.analysis_humidity.setOption(init_bars(data),true);
                });
            }else{
                $.get(API('/base/area/analysis_humidity?env_type='+this.sel_env+'&definite_time='+this.sel_time+'&env_param='+(this.sel_params.join(','))+'&mids='+this.mids),function(data){
                    if(data.error){
                        return;
                    }
                    me.analysis_humidity_data = data;
                    me.analysis_humidity.clear();
                    //初始化稳定性统计概况湿度
                    me.analysis_humidity.setOption(init_bars(data),true);
                });
            }
        },
        get_radar_compliance_data:function(btime,etime){
            var me = this;
            if(this.compare_with_time&&btime&&etime){
                $.get(API('/base/analysis/all_compliance?env_type='+this.sel_env+'&btime='+btime+'&etime='+etime+'&env_param='+(this.sel_params.join(','))+'&mids='+this.mids),function(data){
                    //console.log(data);
                    if(data.error){
                        return;
                    }
                    if(me.sel_params.length>1){
                        me.all_compliance.clear();
                        me.all_compliance.setOption(init_radar(data,'各环境指标达标率统计'),true);
                    }else{
                        me.all_compliance.clear();
                        me.all_compliance.setOption(init_one_param_bar(data,'各环境指标达标率统计'),true);
                    }
                });
            }else{
                $.get(API('/base/area/all_compliance?env_type='+this.sel_env+'&definite_time='+this.sel_time+'&env_param='+(this.sel_params.join(','))+'&mids='+this.mids),function(data){
                    //console.log(data);
                    if(data.error){
                        return;
                    }
                    if(me.sel_params.length>1){
                        me.all_compliance.clear();
                        me.all_compliance.setOption(init_radar(data,'各环境指标达标率统计'),true);
                    }else{
                        me.all_compliance.clear();
                        me.all_compliance.setOption(init_one_param_bar(data,'各环境指标达标率统计'),true);
                    }
                });
            }
        },
        get_radar_scatter_data:function(btime,etime){
            var me = this;
            if(this.compare_with_time&&btime&&etime){
                $.get(API('/base/analysis/all_scatter?env_type='+this.sel_env+'&btime='+btime+'&etime='+etime+'&env_param='+(this.sel_params.join(','))+'&mids='+this.mids),function(data){
                    //console.log(data);
                    if(data.error){
                        return;
                    }
                    if(me.sel_params.length>1){
                        me.all_scatter.clear();
                        me.all_scatter.setOption(init_radar(data,'各环境指标离散系数统计'),true);
                    }else{
                        me.all_scatter.clear();
                        me.all_scatter.setOption(init_one_param_bar(data,'各环境指标离散系数统计'),true);
                    }
                });
            }else{
                $.get(API('/base/area/all_scatter?env_type='+this.sel_env+'&definite_time='+this.sel_time+'&env_param='+(this.sel_params.join(','))+'&mids='+this.mids),function(data){
                    //console.log(data);
                    if(data.error){
                        return;
                    }
                    if(me.sel_params.length>1){
                        me.all_scatter.clear();
                        me.all_scatter.setOption(init_radar(data,'各环境指标离散系数统计'),true);
                    }else{
                        me.all_scatter.clear();
                        me.all_scatter.setOption(init_one_param_bar(data,'各环境指标离散系数统计'),true);
                    }
                });
            }
        },
        toggle_legends:function(legend,index){
            this.legends_status['legend'+index] = !this.legends_status['legend'+index];
            this.analysis_compliance.dispatchAction({
                type:'legendToggleSelect',
                name:legend
            });
            this.analysis_temperature.dispatchAction({
                type:'legendToggleSelect',
                name:legend
            });
            this.analysis_humidity.dispatchAction({
                type:'legendToggleSelect',
                name:legend
            });
            //analysis_compliance,analysis_temperature,analysis_humidity
        }
    },
    events:{
        change_condition:function(sel_env,sel_time,sel_params,compare_with_time){
            this.sel_env = sel_env;
            this.sel_time = sel_time;
            this.sel_params = sel_params;
            if(sel_time!='week'&&sel_time!='month'&&this.tab_name=='history_overview'){//当选中的时间不是本周及本月,并且tab位于历史标签
                this.tab_name='overview';//跳转回默认标签并隐藏历史标签
            }
            if(compare_with_time){//选中按时间对比
                this.compare_with_time = compare_with_time;
                if(this.tab_name=='history_overview'){
                    this.tab_name = 'overview';
                }
            }
            //重新调用数据获取方法compare_with_time
            if(this.compare_with_time){
                this.compare_with_time_reload_page(this.btime,this.etime);
            }else{
                this.reload_page();
            }
        },
        reduce_params:function(key){
            var me = this;
            /*
             *当删除一个参数时:
             *  检查泡泡标签,删除参数是否是当前参数,如果是,则选择第一个默认参数
             *  当删除的参数是温度或者湿度时,分标签检查饼图容器,是否要减少饼图个数
             *  雷达图需要重载参数
             */
            if(this.compare_with_time){
                this.compare_with_time_reload_page(this.btime,this.etime);
            }else{
                this.reload_page();
            }
            this.$broadcast('check_bubble_tabs',key,this.tab_name);
            if(key=='temperature'||key=='humidity'){
                //this.bar_num--;//柱状图图形个数减少
                ////重新计算容器高度
                //this.calc_bar_container_size(this.bar_num);
                setTimeout(function(){
                    me.charts_resize();
                },0);
            }
        },
        un_sel_museum:function(item){
            this.un_sel_museum(item);
        },
        only_one_param:function(){
            this.msg='请确保最少选择一种环境参数';
            this.$nextTick(function(){
                $('#compare_dimmer').dimmer('show');
            });
        },
        too_much_num:function(){
            this.msg='最多可以选择 3 家博物馆进行对比';
            this.$nextTick(function(){
                $('#compare_dimmer').dimmer('show');
            });
        },
        one_can_compare_with_time:function(){
            this.msg='您只能选择1个博物馆进行时间维度的对比';
            this.$nextTick(function(){
                $('#compare_dimmer').dimmer('show');
            });
        },
        the_same_time_error:function(){
            this.msg='不能选择相同的日期进行对比';
            this.$nextTick(function(){
                $('#compare_dimmer').dimmer('show');
            });
        },
        init_page:function(sel_env,sel_time,sel_params){
            this.sel_env = sel_env;
            this.sel_time = sel_time;
            this.sel_params = sel_params;
        },
        reload_page:function(){
            //对比博物馆变化时,重载数据
            this.$dispatch('_compare',this.compare_list);
            if(this.compare_with_time){
                this.compare_with_time_reload_page(this.btime,this.etime);
            }else{
                this.reload_page();
            }
        },
        change_compare_list:function(){
            if(this.compare_list&&this.compare_list.length<=3){
                this.$emit('reload_page');
            }else{
                this.$emit('too_much_num');
            }
        },
        init_bubble_tab:function(key){
            if(key=='temperature'){
                this.curr_param_tab=key;
            }
        },
        change_bubble_tab:function(key){
            var me = this;
            if(this.tab_name=='detail'){
                this.curr_param_tab = key;
                this.is_collapse = true;
                this.resize_table(this.is_collapse);
                if(this.param_details_data){
                    this.curr_page_data = this.get_curr_data(this.param_details_data[this.curr_param_tab]);
                    this.set_curr_data(this.curr_page_data);
                }
            }
        },
        toggle_compare_type:function(compare_with_time,btime,etime,sel_env,sel_time,sel_params){
            this.compare_with_time = compare_with_time;
            if(compare_with_time){
                //console.log('单博物馆,按时间对比');
                this.compare_with_time_reload_page(btime,etime);
            }else{
                this.sel_env=sel_env;
                this.sel_time=sel_time;
                this.sel_params=sel_params;
                //console.log('多博物馆对比');
                this.reload_page();
            }
        },
    }
});
function calc_size(){
    const MAIN_HEIGHT = $('#app section').height();
    //var ch = MAIN_HEIGHT - 70 - 83;
    //$('div.area_container').css('min-height',ch+'px');
    //$('div.overview_container').css('min-height',ch+'px');
    //$('div.detail_container').css('min-height',ch+'px');
}

var formatter_time = function(time_str){
    return time_str.split('-').join('');
};
exports.compare = compare;
