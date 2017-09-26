//@require css/detail.css
var tabs_data_overview=[
    {key:'standard_scatter',text:'达标率'},
    {key:'temperature_scatter',text:'温度离散系数'},
    {key:'humidity_scatter',text:'湿度离散系数'}
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
var detail=Vue.extend({
    template:'#detail',
    data:function(){
        return {
            env_type:'',
            definite_time:'',
            env_param:'',
            tab_name:'area',
            tabs:tabs,
            map_chart:{},
            map_data:{},
            pie_compliance_data:{},
            pie_scatter_temperature_data:{},
            pie_scatter_humidity_data:{},
            pie_num:3,//默认最少显示一个饼图
            bar_data:[],
            bar_avg:'',
            bar_max:'',
            bar_min:0,
            stack_bar_data:[],
            stack_bar_max:100,
            stack_bar_min:0,
            param_details_data:{},
            search_bar_name:'',
            search_stack_bar_name:'',
            statistics_show:false,
            statistics_show_msg:'展开',
            bar_order:'',//数据bar排序
            distance_order:'',//数据distance排序
            tabs_data_overview:tabs_data_overview,//tabs数据
            tabs_data_detail:tabs_data_detail,//tabs数据
            humidity_tabs_texture:humidity_tabs_texture,//湿度材质tab数据
            light_tabs_texture:light_tabs_texture,//光照材质tab数据
            is_collapse:true,//标志位明确表格是否展开或者收起
            curr_param_tab:'',//记录泡泡页签告知的当前指标参数标签页
            curr_param_unit:'',//存储当前标签对应的单位信息
            curr_type_tab:'',//纪录泡泡页签告知的当前页面
            stack_bar_order:'',//纪录堆叠柱状图表格的排序信息
            thumbnail_timer:null,//缩略图定时器
            thumbnail_data:{},//缩略图数据
            normal_chart:false,//保存大图容器
            curr_normal_data:{},//保存当前大图数据
            curr_normal_option:{},//保存当前大图配置选项
            statistic_info:{},//地图提示信息
            sel_env:{},
            sel_time:{},
            sel_params:[],
            statistics_info_data:{},
            curr_info_data:{},
            curr_humidity_texture:'石质、陶器、瓷器',//默认湿度分选中材质
            curr_light_texture:'石质、陶器、瓷器、铁质、青铜',//默认光照分材质选中材质
            thumbnail_list:[],//保存
            abnormal_status:false,//异常提示框状态
            small_id:'',//保存缩略图小图ID
            normal_default:{
                legend:{
                    show:false,
                    top:0,
                    left:0,
                    data:[]
                },
                grid: {
                    top: 90,
                    left: '5%',
                    right: '5%',
                    bottom: 120,
                    containLabel: true
                },
                tooltip:{
                    trigger: 'item',
                    //axisPointer : {
                    //    type : 'shadow',
                    //},
                    formatter: function (params) {
                        var result = '';
                        if(params.data.base_value) {//有这个值,说明是堆叠柱状图,seriesIndex为偶数时为base
                            if (params.seriesIndex % 2 != 0) {
                                result = params.data.cn_name + '<br/>' + params.data.name + ':<br/> 最小值:' + params.data.base_value + '<br/> 最大值:' + (parseFloat(params.data.base_value) + parseFloat(params.data.value)).toFixed(2);
                            }
                        }else{
                            result = params.data.cn_name + '<br/>'+ params.data.name + ':'+params.data.value;
                        }
                        return result;
                    }
                },
                xAxis : {
                    type : 'category',
                    data : [],
                    axisLine:{
                        show:false
                    },
                    splitLine:{
                        show:false
                    },
                    axisTick:{
                        show:false,
                        alignWithLabel:true
                    },
                    axisLabel:{
                        rotate:35,
                        textStyle:{
                            color:'#9a9faf',
                            fontStyle: 'normal',
                            fontWeight: 'normal',
                            fontFamily: 'sans-serif',
                            fontSize: 10,
                        }
                    }
                },
                yAxis : {
                    type : 'value',
                    axisLine:{
                        show:false
                    },
                    splitLine:{
                        show:true,
                        lineStyle:{
                            color:'#e7e7e7'
                        }
                    },
                    axisTick:{
                        show:false
                    },
                    axisLabel:{
                        textStyle:{
                            color:'#878da1',
                            fontStyle: 'normal',
                            fontWeight: 'normal',
                            fontFamily: 'sans-serif',
                            fontSize: 14,
                        }
                    }
                },
                series : []
            },
            show_normal_status:false,//标志大图是否显示
            no_data_message:'',//空数据提示
            curr_page_data:'',//获取当前选中参数的数据值
            abnormal_timer:'',//异常提示框消失定时器
            abnormal_list:[],//异常值信息
            wave_abnormal_list:[],//波动值异常信息
            compare_list:[],
            msg:''//保存异常提示信息
        }
    },
    watch:{
        compare_list:function(val){
            this.$route.params.compare_list=val;
        },
        //filtered_stack_bar_data:function(data){
        //    if(data&&data.length!=0){//如果筛选结果不为空
        //        this.$broadcast('change_legend_status',data);//告知小图需要关闭部分图例
        //    }
        //}
    },
    route:{
        data:function(data){
            if(data.from.params){
                this.compare_list = data.from.params.compare_list;
            }
        }
    },
    ready:function(){
        var me = this;
        calc_size();
        this.calc_pie_container_size(this.pie_num);
        $(window).resize(function(){
            if(me.tab_name=='area'){
                me.calc_pie_container_size(me.pie_num);
                me.$nextTick(function(){
                    me.$broadcast('resize_pie');
                });
            }
            calc_size();
        });
        this.reload_page();
    },
    computed:{
        filtered_bar_data:function(){
            var me = this;
            if((me.search_bar_name!='')&&me.bar_data){
                return me.bar_data.filter(function (data) {
                    return data.name.indexOf(me.search_bar_name) !== -1;
                });
            }else{
                this.reload_bar();
                return me.bar_data;
            }
        },
        filtered_stack_bar_data:function(){
            var me = this;
            if((me.search_stack_bar_name!='')&&me.stack_bar_data){
                this.resize_table(this.is_collapse);
                return me.stack_bar_data.filter(function (data) {
                    return data.museum.indexOf(me.search_stack_bar_name) !== -1;
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
                str='平均数';
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
    methods:{
        show_abnormal:function(e,depid,type){
            this.abnormal_list =[];
            this.wave_abnormal_list=[];
            if(this.abnormal_timer){
                clearTimeout(this.abnormal_timer);
                this.abnormal_timer = null;
            }
            var _top=e.clientY-265,_left,_width=230,page_width=$(document).width();
            if((e.clientX+_width)>=(page_width-20)){//弹窗右侧超出页面边界
                _left = page_width+$('section').scrollLeft()-_width-235-20;
            }else{
                _left = e.clientX+$('section').scrollLeft()-235;
            }
            if($(e.target).hasClass('count_abnormal')){
                this.abnormal_status = true;
                $('#abnormal_info').removeClass('loaded').css({'top':_top+$('section').scrollTop()+20+'px','left': _left+'px'});
                this.get_abnormal_data(depid);
            }else if($(e.target).find('b.status').length!=0){
                this.abnormal_status = true;
                $('#abnormal_info').removeClass('loaded').css({'top':_top+$('section').scrollTop()+20+'px','left': _left+'px'});
                //请求异常数据
                if(type=='wave'){
                    this.get_wave_data(depid,0);
                }else if(type=='wave_normal'){
                    this.get_wave_data(depid,1);
                }
            }else{
                this.abnormal_status = false;
            }
        },
        get_abnormal_data:function(depid){
            var me = this;
            $.get(API('/base/area/abnormal?depid='+depid),function(data){
                if(data&&data.data&&data.data.length!=0){
                    me.abnormal_list = data;
                    $('#abnormal_info').addClass('loaded');
                }else{
                    setTimeout(function(){
                        me.abnormal_status = false;
                    },0);
                }
            });
        },
        get_wave_data:function(depid,type){//波动异常数据等待完善
            var me = this;
            $.get(API('/base/area/wave_abnormal?depid='+depid+'&type='+type),function(data){
                if(data&&data.data&&data.data.length!=0){
                    me.wave_abnormal_list = data;
                    $('#abnormal_info').addClass('loaded');
                }else{
                    setTimeout(function(){
                        me.abnormal_status = false;
                    },0);
                }
            });
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
        show_legend:function(key){
            $('div.wrapper[data-key='+key+'] div.symbol>div').show();
        },
        hide_legend:function(key){
            $('div.wrapper[data-key='+key+'] div.symbol>div').hide();
        },
        table_collapse:function() {//点击表格展开事件
            this.is_collapse = !this.is_collapse;
            this.resize_table(this.is_collapse);
            this.resize_overview_charts();
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
        calc_pie_container_size:function(num) {//计算饼图容器尺寸
            var MAIN_HEIGHT = $('#app section').height();
            var ch = MAIN_HEIGHT - 70 - 83;
            $('.left>div.wrapper>div').css('height', (ch - (num-1)*10)/num + 'px');
        },
        init_overview_bar_chart:function(chart,option_obj){//初始化柱状图
            chart.clear();
            chart.setOption(option_obj);
        },
        search_museum_overview:function(){

        },
        search_museum_detail:function(){
            this.resize_table(this.is_collapse);
            if(this.filtered_stack_bar_data){//如果筛选结果不为空
                this.$broadcast('change_legend_status',this.filtered_stack_bar_data);//告知小图需要关闭部分图例
            }
        },
        slide_toggle_statistics_info:function(){
            this.statistics_show = !this.statistics_show;
            if(this.statistics_show){
                this.statistics_show_msg = '收起';
                /*展开时初次初始化提示泡泡*/
                if(this.curr_type_tab=='standard_scatter'){
                    $('#type_help').popup({
                        title:'达标率提示信息',
                        html:'<div style="min-width:200px">每个环境类型每次数据统计所选环境参数均达到标准则记为一次数据达标，达标率为数据达标次数占所选时间段内所选环境类型的数据统计次数之和的比例。</div>',
                        position:'right center',
                    });
                }else {
                    if(this.curr_type_tab=='temperature_scatter'){
                        $('#type_help').popup({
                            html: '<ul class="tips"><li>此处显示的是与其他博物馆差距极大的博物馆名称;</li><li>离散系数越小说明监测数据越稳定;</li><li>一般来说离散系数大于15%则可认定为数据不正常，请重点关注;</li><li>计算公式为：离散系数=（标准差/平均值）× 100%.</li></ul>',
                            position:'right center',
                        });
                    }else if(this.curr_type_tab=='humidity_scatter'){
                        $('#type_help').popup({
                            html: '<ul class="tips"><li>此处显示的是与其他博物馆差距极大的博物馆名称;</li><li>离散系数越小说明监测数据越稳定;</li><li>一般来说离散系数大于15%则可认定为数据不正常，请重点关注;</li><li>计算公式为：离散系数=（标准差/平均值）× 100%.</li><li>湿度离散系数是按材质分类计算求平均数所得，若数值较大则考虑是该博物馆的环境未关联文物.</li></ul>',
                            position:'right center',
                        });
                    }
                }
            }else{
                this.statistics_show_msg = '展开';
            }
        },
        sort_data_bar:function(type){
            var me = this;
            me.bar_order=type;
            me.distance_order='';
            this.bar_data.sort(function(a,b){
                if(type=='asc'){
                    return (a.data||-1) - (b.data||-1);
                }else if(type=='desc'){
                    return (b.data||-1) - (a.data||-1);
                }
            });
            setTimeout(function(){
                me.reload_bar();
            },0);
        },
        sort_data_distance:function(type){
            var me = this;
            me.distance_order=type;
            me.bar_order='';
            this.bar_data.sort(function(a,b){//不存在距离值，即无数据，按照-1处理
                if(type=='asc'){
                    return (a.distance!==undefined?Math.abs(a.distance):-1) - (b.distance!==undefined?Math.abs(b.distance):-1);
                }else if(type=='desc'){
                    return (b.distance!==undefined?Math.abs(b.distance):-1) - (a.distance!==undefined?Math.abs(a.distance):-1);
                }
            });
            setTimeout(function(){
                me.reload_bar();
            },0);
        },
        reload_bar:function(){
            this.reset_bar();
            this.load_bar();
        },
        sort_stack_bar:function(key,order){
            var me = this;
            this.stack_bar_order = key+order;
            if(key=='wave_normal'||key=='wave'){//波动值按波动最大值排序
                this.stack_bar_data.sort(function(a,b){//没有值默认为-1
                    if(order=='asc'){
                        return (a[key]?a[key][1].data:-1) - (b[key]?b[key][1].data:-1);
                    }else{
                        return (b[key]?b[key][1].data:-1) - (a[key]?a[key][1].data:-1);
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
        reload_stack_bar:function(){
            this.reset_stack_bar();
            this.load_stack_bar();
        },
        load_bar:function(){//加载柱状图
            this.$broadcast('load_bar');
        },
        reset_bar:function(){//重置柱状图
            this.$broadcast('reset_bar');
        },
        load_stack_bar:function(){//加载堆叠柱状图
            this.$broadcast('load_stack_bar');
        },
        reset_stack_bar:function(){//重置堆叠柱状图
            this.$broadcast('reset_stack_bar');
        },
        resize_overview_charts:function(){
            //发送尺寸重置事件给子组件
            this.$broadcast('resize_overview_charts');
        },
        show_normal:function(small_id){
            var me = this;
            if(me.thumbnail_timer){
                clearTimeout(me.thumbnail_timer);
                me.thumbnail_timer=null;
            }
            me.show_normal_status = true;
            me.normal_chart = echarts.init(document.getElementById('common_container'));
            me.small_id = small_id;
            this.load_normal(small_id);
        },
        load_normal:function(small_id){
            var me = this;
            if(me.curr_page_data&&me.curr_page_data.table&&me.curr_page_data.table['y'+small_id]){
                /*在缩略图初始化时，已完成异步请求数据*/
                me.curr_normal_data = me.curr_page_data.table['y'+small_id];
                var xdata = me.curr_page_data.table.xdata;
                me.curr_normal_option = init_normal(me.normal_default,me.curr_normal_data,xdata,small_id,me.cn_name,me.curr_param_unit);
                //结束加载
                $('#common_container').addClass('loaded');
                me.normal_chart.clear();
                /*初始化大图*/
                me.normal_chart.setOption(me.curr_normal_option,true);
                var options = this.normal_chart.getOption(),
                    legends = options.legend[0].data;
                if (legends) {
                    $.each(legends, function (i, n) {//关闭所有图例
                        me.normal_chart.dispatchAction({
                            type: 'legendUnSelect',
                            name: n
                        })
                    });
                    if (me.filtered_stack_bar_data) {
                        $.each(me.filtered_stack_bar_data, function (i, n) {
                            if (legends.indexOf(n.museum) != -1) {
                                me.normal_chart.dispatchAction({
                                    type: 'legendSelect',
                                    name: n.museum
                                })
                            }
                        });
                    }
                }
            }else{
                me.show_normal_status = false;//当没有数据时,不显示大图
            }
        },
        enter_normal:function(){
            var me = this;
            if(me.thumbnail_timer){
                clearTimeout(me.thumbnail_timer);
                me.thumbnail_timer=null;
            }
            me.show_normal_status = true;
        },
        hide_normal:function(){
            var me = this;
            if(me.thumbnail_timer){
                clearTimeout(me.thumbnail_timer);
                me.thumbnail_timer=null;
            }
            me.thumbnail_timer = setTimeout(function(){
                me.show_normal_status = false;
                me.normal_chart.clear();
                me.normal_chart.setOption({
                    series:[]
                },true);
                //重新开始加载
                $('#common_container').removeClass('loaded');
            },200);
        },
        get_map_data:function(){
            var me = this;
            $.get(API('/base/area/situation/map?env_type='+this.sel_env+'&definite_time='+this.sel_time+'&env_param='+this.sel_params.join(',')),function(data){
                if(data.error){
                    return;
                }
                me.$broadcast('init_map_chart',me.tab_name,data);
            });
        },
        get_statistic_data:function(){
            var me = this;
            $.get(API('/base/area/situation/statistic?env_type='+this.sel_env+'&definite_time='+this.sel_time+'&env_param='+this.sel_params.join(',')),function(data){
                if(data.error){
                    return;
                }
                me.statistic_info = data;
            });
        },
        get_pie_data:function(){
            var me = this;
            $.get(API('/base/area/situation/pie_compliance?env_type='+this.sel_env+'&definite_time='+this.sel_time+'&env_param='+this.sel_params.join(',')),function(data){
                $('div.area_container div.left').css('background','#fff');
                if(data.error) {
                    me.$broadcast('cancle_pie_chart','pie_compliance');
                    return;
                }
                me.pie_compliance_data = data;
                me.$broadcast('init_pie_chart',data,'pie_compliance');
            });
            $.get(API('/base/area/situation/pie_scatter_temperature?env_type='+this.sel_env+'&definite_time='+this.sel_time+'&env_param='+this.sel_params.join(',')),function(data){
                $('div.area_container div.left').css('background','#fff');
                if(data.error) {
                    me.$broadcast('cancle_pie_chart','pie_scatter_temperature');
                    return;
                }
                me.pie_scatter_temperature_data = data;
                me.$broadcast('init_pie_chart',data,'pie_scatter_temperature');
            });
            $.get(API('/base/area/situation/pie_scatter_humidity?env_type='+this.sel_env+'&definite_time='+this.sel_time+'&env_param='+this.sel_params.join(',')),function(data){
                $('div.area_container div.left').css('background','#fff');
                if(data.error) {
                    me.$broadcast('cancle_pie_chart','pie_scatter_humidity');
                    return;
                }
                me.pie_scatter_humidity_data = data;
                me.$broadcast('init_pie_chart',data,'pie_scatter_humidity');
            });
        },
        get_general_all_data:function(){
            var me = this;
            $.get(API('/base/area/general_all?env_type='+this.sel_env+'&definite_time='+this.sel_time+'&env_param='+this.sel_params.join(',')),function(data){
                if(data.error){
                    return;
                }
                me.statistics_info_data = data;
                me.curr_info_data = me.statistics_info_data[me.curr_type_tab];
                if(me.curr_info_data){
                    me.bar_data = me.curr_info_data.museum;
                    me.bar_avg = me.curr_info_data.average;
                    me.bar_max = me.curr_info_data.max;
                }
            });
        },
        get_curr_data:function(data){//判断材质，并取得当前参数当前材质下的数据
            var result='',me = this;
            if(data){
                if(me.sel_env!='hall') {
                    //只有当环境选择为非展厅，并且参数为湿度和光照时，区分材质
                    if (me.curr_param_tab == 'humidity') {
                        if (data.length != 0) {
                            $.each(data, function (i, n) {
                                if (me.curr_humidity_texture == n.texture) {
                                    result = n.data;
                                }
                            });
                        }
                    }else if(me.curr_param_tab=='light'){
                        if (data.length != 0) {
                            $.each(data, function (i, n) {
                                if (me.curr_light_texture == n.texture) {
                                    result = n.data;
                                }
                            });
                        }
                    }else{
                        result = data;
                    }
                }else{
                    result = data;
                }
            }
            return result;
        },
        set_curr_data:function(data){
            var me = this;
            me.curr_param_unit=data.unit;
            me.stack_bar_data = data.list;
            me.stack_bar_max = data.right;
            me.stack_bar_min = data.left;
        },
        get_param_details_data:function(){
            var me = this;
            $.get(API('/base/area/param_details?env_type='+this.sel_env+'&definite_time='+this.sel_time+'&env_param='+this.sel_params.join(',')),function(data){
                if(data.error){
                    return;
                }
                me.param_details_data = data;
                me.curr_page_data = me.get_curr_data(me.param_details_data[me.curr_param_tab]);
                me.set_curr_data(me.curr_page_data);
                if(me.curr_page_data.table&&me.curr_page_data.table.length!=0){
                    me.$broadcast('init_thumbnail',me.tab_name,me.curr_page_data.table,me.curr_page_data.unit);
                }else{
                    me.$broadcast('cancel_thumbnail');
                }
            });
        },
        toggle_tabs:function(key){
            this.tab_name = key;
            this.reload_page();
        },
        reload_page:function(){
            var me = this;
            this.init_tips();
            if(this.tab_name=='area'){
                this.get_map_data();
                this.get_statistic_data();
                this.get_pie_data();
                this.$broadcast('resize_pie');
            }else if(this.tab_name=='overview'){
                this.get_general_all_data();
                this.$broadcast('check_bubble_tabs','',this.tab_name);
            }else if(this.tab_name=='detail'){
                this.resize_overview_charts();
                this.is_collapse = true;
                this.resize_table(this.is_collapse);
                this.get_param_details_data();
                this.$broadcast('check_bubble_tabs','',this.tab_name);
            }
        },
        check_params:function(sel_params){
            var pie_num = 1;
            if(sel_params.indexOf('temperature')!=-1){
                pie_num++;
            }
            if(sel_params.indexOf('humidity')!=-1){
                pie_num++;
            }
            return pie_num;
        },
        hide_detail_dimmer:function(){
            $('#detail_dimmer').dimmer('hide');
        },
        init_tips:function(){//初始化图表上的说明文字
            if(this.tab_name=='area'){
                $('#pie_scatter_temperature_tips').popup({
                    html:'<ul class="tips"><li>该数值越小说明监测数据越稳定;</li><li>一般来说离散系数大于15%则可认定为数据不正常,请重点关注;</li><li>计算公式为:离散系数=（标准差/平均值）× 100%.</li></ul>',
                    position:'right center',
                });
                $('#pie_scatter_humidity_tips').popup({
                    html:'<ul class="tips"><li>该数值越小说明监测数据越稳定;</li><li>一般来说离散系数大于15%则可认定为数据不正常,请重点关注;</li><li>计算公式为:离散系数=（标准差/平均值）× 100%;</li><li>湿度离散系数是按材质分类计算求平均数所得,若数值较大则可能是该博物馆的环境未关联文物.</li></ul>',
                    position:'right center',
                });
            }else if(this.tab_name=='overview'){

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
        }
    },
    events:{
        change_bubble_tab:function(key){
            var me = this;
            if(this.tab_name=='detail'){

                this.curr_param_tab = key;
                this.is_collapse = true;
                this.resize_table(this.is_collapse);
                if(this.param_details_data){
                    this.curr_page_data = this.get_curr_data(this.param_details_data[this.curr_param_tab]);
                    this.set_curr_data(this.curr_page_data);
                    me.$broadcast('init_thumbnail',me.tab_name,me.curr_page_data.table,me.curr_page_data.unit);
                }
            }else if(this.tab_name=='overview'){
                this.curr_type_tab = key;
                this.curr_info_data = this.statistics_info_data[this.curr_type_tab];
                if(this.curr_info_data){
                    this.bar_data = this.curr_info_data.museum;
                    this.bar_avg = this.curr_info_data.average;
                    this.bar_max = this.curr_info_data.max;
                }
                /*添加泡泡事件*/
                if(this.curr_type_tab=='standard_scatter'){
                    $('#type_help').popup({
                        title:'达标率提示信息',
                        html:'<div style="min-width:200px">每个环境类型每次数据统计所选环境参数均达到标准则记为一次数据达标，达标率为数据达标次数占所选时间段内所选环境类型的数据统计次数之和的比例。</div>',
                        position:'right center',
                    });
                }else {
                    if(this.curr_type_tab=='temperature_scatter'){
                        $('#type_help').popup({
                            html: '<ul class="tips"><li>此处显示的是与其他博物馆差距极大的博物馆名称;</li><li>离散系数越小说明监测数据越稳定;</li><li>一般来说离散系数大于15%则可认定为数据不正常，请重点关注;</li><li>计算公式为：离散系数=（标准差/平均值）× 100%.</li></ul>',
                            position:'right center',
                        });
                    }else if(this.curr_type_tab=='humidity_scatter'){
                        $('#type_help').popup({
                            html: '<ul class="tips"><li>此处显示的是与其他博物馆差距极大的博物馆名称;</li><li>离散系数越小说明监测数据越稳定;</li><li>一般来说离散系数大于15%则可认定为数据不正常，请重点关注;</li><li>计算公式为：离散系数=（标准差/平均值）× 100%.</li><li>湿度离散系数是按材质分类计算求平均数所得，若数值较大则考虑是该博物馆的环境未关联文物.</li></ul>',
                            position:'right center',
                        });
                    }
                }
            }
        },
        init_bubble_tab:function(key){
            if(key=='temperature'){
                this.curr_param_tab=key;
            }else if(key=='standard_scatter'){
                this.curr_type_tab=key;
            }
        },
        change_condition:function(sel_env,sel_time,sel_params){
            //根据所选择的条件参数,生成泡泡tab
            this.sel_env = sel_env;
            this.sel_time = sel_time;
            this.sel_params = sel_params;
            this.pie_num = this.check_params(sel_params);
            this.calc_pie_container_size(this.pie_num);
            this.$broadcast('pie_loading');//饼图加载图形展现
            //重新调用数据获取方法
            this.reload_page();
        },
        init_page:function(sel_env,sel_time,sel_params){//头部准备就绪触发此事件
            this.sel_env = sel_env;
            this.sel_time = sel_time;
            this.sel_params = sel_params;
            this.pie_num = this.check_params(sel_params);
            this.calc_pie_container_size(this.pie_num);
        },
        show_normal:function(small_id){
            this.show_normal(small_id);
        },
        hide_normal:function(small_id){
            this.hide_normal(small_id);
        },
        collapse_header:function(){
            return true;
        },
        reduce_params:function(key){
        /*
         *当删除一个参数时:
         *
         *  检查泡泡标签,删除参数是否是当前参数,如果是,则选择第一个默认参数
         *  当删除的参数是温度或者湿度时,分标签检查饼图容器,是否要减少饼图个数
         *
         */
            //this.
            this.$broadcast('check_bubble_tabs',key,this.tab_name);
            if(key=='temperature'||key=='humidity'){
                this.pie_num--;//饼图图形个数减少
                //重新计算容器高度
                this.calc_pie_container_size(this.pie_num);
                this.$broadcast('resize_pie');
            }
            this.reload_page();
        },
        only_one_param:function() {
            this.msg = '请确保最少选择一种环境参数';
            this.$nextTick(function () {
                $('#detail_dimmer').dimmer('show');
            });
        }
    }
});
exports.detail = detail;
function calc_size(){
    const MAIN_HEIGHT = $('#app section').height();
    var ch = MAIN_HEIGHT - 70 - 83;
    $('div.area_container').css('min-height',ch+'px');
    $('div.overview_container').css('min-height',ch+'px');
    $('div.detail_container').css('min-height',ch+'px');
}
/*tabs 功能模块*/
var tabs = {
    area:'环境监控态势图',
    overview:'达标与稳定概况',
    detail:'环境指标统计详情'
};
var init_normal = function(option,data,xdata,small_id,cn_name,unit){
    //拷贝配置对象副本空对象
    var option_copy={};
    for(var key in option){
        option_copy[key] = option[key];
    }
    if(xdata&&xdata.length!=0){
        option_copy.series = [];
        $.each(xdata,function(i,n){//添加基础
            if(data.add&&data.base){//如果是堆叠柱状图
                option_copy.series.push({
                    name:n,
                    type: 'bar',
                    stack:  n,
                    itemStyle: {
                        normal: {
                            barBorderColor: 'rgba(0,0,0,0)',
                            color: 'rgba(0,0,0,0)'
                        },
                        emphasis: {
                            barBorderColor: 'rgba(0,0,0,0)',
                            color: 'rgba(0,0,0,0)'
                        }
                    },
                    data: [{
                        name:n,
                        value:data.base[i]
                    }],
                    barMaxWidth:30,
                    label:{
                        normal:{
                            show:true,
                            position:'bottom',
                            formatter:function(params){
                                if(params.name.length>5){
                                    return params.name.slice(0,5)+'...' ;
                                }else{
                                    return params.name;
                                }
                            },
                            textStyle:{
                                color:'#aab2cc'
                            }
                        }
                    },
                    barGap:'200%',
                    silent:true
                });
                option_copy.series.push({
                    name: n,
                    type: 'bar',
                    stack: n,
                    itemStyle: {
                        normal: {
                            color: '#aab2cc'
                        },
                        emphasis:{
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            shadowBlur: 10,
                        }
                    },
                    data: [{
                        name:n,
                        value:data.add[i],
                        base_value:data.base[i],//基础值
                        cn_name:cn_name
                    }],
                    barMaxWidth:30,
                    barGap:'200%'
                });
            }else{//普通柱状图
                option_copy.series.push({
                    name: n,
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: '#aab2cc'
                        },
                        emphasis:{
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                            shadowBlur: 10,
                        }
                    },
                    label:{
                        normal:{
                            show:true,
                            position:'bottom',
                            formatter:function(params){
                                if(params.seriesName.length>5){
                                    return params.seriesName.slice(0,5)+'...' ;
                                }else{
                                    return params.seriesName;
                                }
                            },
                        }
                    },
                    data: [{
                        name:n,
                        value:data[i],
                        cn_name:cn_name
                    }],
                    barMaxWidth:30,
                    barGap:'200%'
                });
            }
        });
    }
    option_copy.title={
        text: cn_name,
        left:'center',
        top:20
    };
    option_copy.legend.data = xdata;
    if(small_id=='compliance'){//达标率单位为%
        option_copy.yAxis.name = '%';
    }else if(small_id=='count_abnormal'){//异常值单位为个
        option_copy.yAxis.name = '个';
    }else{
        option_copy.yAxis.name = unit;
    }

    if(small_id=='wave'||small_id=='wave_normal'){
        option_copy.yAxis.scale=true;
    }else{
        option_copy.yAxis.scale=false;
    }
    //console.log(option_copy);
    return option_copy;
};