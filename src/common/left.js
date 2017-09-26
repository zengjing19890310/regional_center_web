// @require css/left.css

var vm = new Vue({
    el: '#left_slide',
    data: {
        classKey:true,
    },
    methods: {
        slider:function(num){
            var $slider=$('.slider');
            $slider.stop().animate({'top':num*84-num+'px'});
        },
        fixed:function(){
            this.classKey=!this.classKey;
        },
        showSlider:function(bool){
            if(this.classKey){
                $('#left_slide').stop().animate({left:(bool?0:-66)+'px'},function(){
                    $(this).find('.btn').css('display',bool?'none':'block');
                }); 
           }
        },
    }
});
