//@require css/overview.css

var dom = null;
var overview=Vue.extend({
    template:'#overview',
    data:function(){
        return {
            mid_list: [],
            museum: false,
            compare_list:[],//保存对比数据关键字
            ready_count:0,//保存就绪组件个数
            behavior_compare_list:[],//保存用户行为习惯数组排序
        }
    },
    watch:{
        compare_list:function(val){
            this.$route.params.compare_list=val;
        },
        museum:function(val){
            //console.log('数组变化:');
            //$.each(val,function(i,n){
            //    console.log(n.mid);
            //});
        }
    },
    route:{
        data:function(data){
            if(data.from.params){
                this.compare_list = data.from.params.compare_list;
            }
        }
    },
    created:function(){//此处应该读取用户习惯纪录的博物馆顺序
        var me = this;
        this.get_museum_data();
    },
    ready:function(){
        var me = this;
        var from = null;
        var index;
        var WIDTH = document.body.clientWidth;
        $('.fixed_top').css('width',WIDTH-200+'px');
        //进入这个页面时请求一次雷达图数据
        //var drake = dragula([document.getElementById('museum_container')],{
        //    moves: function (el, container, handle) {
        //        return handle.classList.contains('drag_move');
        //    }
        //});
        //drake.on('drag', function(element, source) {
        //    index = [].indexOf.call(element.parentNode.children, element);
        //    from = index;
        //});
        //drake.on('drop', function(element, target, source, sibling) {
        //    index = [].indexOf.call(element.parentNode.children, element);
        //    me.museum.splice(index, 0, me.museum.splice(from, 1)[0])
        //});
    },
    computed:{

    },
    methods:{
        init_radar_chart:function(data){
            this.$broadcast('init_radar_chart',data);
        },
        init_mid_list:function(data){
            var mid_list = JSON.parse(localStorage.getItem('mid_list')),
                me = this;
            if(mid_list){
                //console.log('读取到本地存储');
                this.mid_list = mid_list;
            }else if(data){
                this.mid_list = [];
                data.forEach(function(value,index){
                    me.mid_list.push(value.mid);
                })
            }
            //console.log(this.mid_list);
        },
        hide_overview_dimmer:function(){
            $('#overview_dimmer').dimmer('hide');
        },
        get_museum_data:function(){
            var me = this;
            $.get(API('/base/museum/generality'), function (data) {
                if(typeof data == 'string'){
                    return;
                }
                me.museum = data;
                me.init_mid_list(data);
            });
        },
        go_top:function(mid){
            var me = this;
            //console.log(mid);
            this.$nextTick(function(){
                if(me.mid_list&&me.mid_list.length!=0){
                    me.mid_list.forEach(function(value,index){
                        if(value == mid){
                            me.mid_list.splice(0, 0, me.mid_list.splice(index, 1)[0]);
                        }
                    });
                }
                //console.log(me.mid_list);
                localStorage.setItem('mid_list',JSON.stringify(me.mid_list));
            });
            //this.$nextTick(function(){
            //    if(me.museum&&me.museum.length!=0){
            //        $.each(me.museum,function(i,n){
            //            if(n&&(mid== n.mid)){
            //                //var add = n;
            //                //me.museum.$remove(n);
            //                me.museum.splice(0, 0, me.museum.splice(i, 1)[0]);
            //            }
            //        });
            //    }
            //});
            //console.log(me.museum);
        },
        join_compare:function(mid,museum_name){
            var me=this;
            if(!this.compare_list){
                this.compare_list=[];
            }
            if(this.compare_list.length<3){
                me.compare_list.push({
                    mid:mid,
                    museum_name:museum_name
                });
                me.$broadcast('sel_compare',mid);
            }else{
                $('#overview_dimmer').dimmer('show');
            }
            this.$dispatch('_compare',this.compare_list);
        },
        un_compare:function(mid,museum_name){
            var me = this;
            if(this.compare_list&&this.compare_list.length!=0){
                $.each(this.compare_list,function(i,n){
                    if(mid == n.mid){
                        me.compare_list.$remove(n);
                        me.$broadcast('un_sel_compare',mid);
                        return false;
                    }
                });
            }
            this.$dispatch('_compare',this.compare_list);
        },
    },
    events:{
        go_top:function(mid){
            this.go_top(mid);
        },
        join_compare:function(mid,museum_name){
            this.join_compare(mid,museum_name);
        },
        un_compare:function(mid,museum_name){
            this.un_compare(mid,museum_name);
        },
        ready_radar_chart:function(mid){
            var me = this;
            if(this.museum){
                this.museum.forEach(function(value,index){
                    if(value.mid == mid){
                        me.init_radar_chart(value);
                    }
                });
            }
        }
    }
});

exports.overview = overview;