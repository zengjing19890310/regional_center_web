//@require $
//@require bootstrap.css
//@require bootstrap
//@require index.css
//@require common/css/font.css
//@require tooltip

function menu_init(env_no) {
    require('./monitor').init(env_no);
    require('./relic').init(env_no);
    require('./net').init(env_no);

    $('body').tooltip({key:true,style:{height:'28px'}});
    events();

}

exports.floor_init = function (env_no, svg_map) {

    require('./map').init(env_no, {
        show_small_env: false,
        show_micro_env: false,
        show_network: true,
        show_relic: false,
        svg_map: svg_map
    });

    menu_init(env_no);
};

exports.hall_init = function (env_no, svg_map) {

    require('./map').init(env_no, {
        svg_map: svg_map
    });
    menu_init(env_no);

};

function events() {
    //点击切换右侧图标
    $('.panel-heading').click(function () {
        $(this).parent().toggleClass('active')
            .siblings('.panel-default').removeClass('active');
    });
}
