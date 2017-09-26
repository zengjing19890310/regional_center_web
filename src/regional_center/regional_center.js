//@require vue
//@require lodash
//@require Sortable
//@require vuedragablefor
//@require vue-router
//@require $
//@require tooltip
//@require echarts
//@require laydate
//@require semantic_ui
//@require semantic_ui.css
//@require css/regional_center.css


require('common/header');
var detail_cp = require('./detail');
var overview_cp = require('./overview');
var compare_cp = require('./compare');
var report_cp = require('./report');

var active_modules = window.localStorage.getItem('active_modules');

var functional_modules =[
    {en_name:'detail',cn_name:'区域详情'},
    {en_name:'overview',cn_name:'各馆概况'},
    {en_name:'compare',cn_name:'对比分析'},
    //{en_name:'report',cn_name:'评估报告'},
];

function Init_size(){
    var Height=$(window).height()-83;
    $('div.app>aside').css('height',Height+'px');
    $('div.app>section').css('height',Height+'px');
}

var regional_center = Vue.extend({
    data:function(){
        return {
            msg: '这里是区域中心的首页',
            modules: functional_modules,
            active_modules: 'detail',
            compare_list: [],
            compare_num:0,
        }
    },
    created:function(){

    },
    ready:function(){
        if(active_modules){
            this.active_modules = active_modules;
        }
        Init_size();
        $(window).resize(function(){
            Init_size();
        });
        $('body').tooltip({key:true});
    },
    methods:{
        resize:function(){

        },
        toggle_modules:function(key){
            this.active_modules = key;
            window.localStorage.setItem('active_modules',this.active_modules);
        },
        collapse_header:function(e){
            if($(e.target).hasClass('laydate_void')){
                //当点击目标为时间控件中的不可交互日期时，不进行任何操作
            }else{
                this.$broadcast('collapse_header');
                this.$broadcast('hide_museum_list');
            }
        },
        refresh:function(active_modules){
            this.active_modules=active_modules;
            router.go(active_modules);
        },
    },
    components:{
        detail:detail_cp.detail,
        overview:overview_cp.overview,
        compare:compare_cp.compare,
        report:report_cp.report
    },
    events:{
        _compare:function(compare_list){
            if(compare_list){
                this.compare_list = compare_list;
                this.$route.params.compare_list = compare_list;
                this.compare_num = compare_list.length;
            }
        }
    }
});

const router = new VueRouter();
router.map({
    '/detail':{
        component:detail_cp.detail
    },
    '/overview':{
        component:overview_cp.overview
    },
    '/compare':{
        component:compare_cp.compare
    },
    '/report':{
        component:report_cp.report
    }
});
router.start(regional_center, '#app');
router.redirect({
    '*':'/'+active_modules
});