// @require css/header.css
// @require $
// @require vue

var ajaxOption={
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.error(this, arguments);
    }
}

if(API('')[0]!='/'&&window.localStorage.getItem('region_token')){//跨域

    ajaxOption.headers={
        'access_token':window.localStorage.getItem('region_token'),
    };

}

$.ajaxSetup(ajaxOption);


var vm = exports.vm = new Vue({
    el: '#header',
    data: {
        config: {},
        date: +new Date(),
        app_name: '',
        user: {
            real_name: '默认用户'
        },
        search_history: [],
        search_follow: [],
        search_keyword: ''
    },
    methods: {
        search_set: function (keyword) {
            this.search_keyword = keyword;
        },
        exit: exit
    },
    init: function () {
        // getSearch();
        animate();
    }
});
$.ajax({
    type: "GET",
    url: API('/base/config'),
    dataType: "json",
    async: false,//同步获取
    success: function (data) {
        if (data['error']) {
            console.error(data);
            return;
        }
        if (!data['user']) {
            document.body.innerHTML = '';
            window.location.href = __uri('/login');
        }
        window.localStorage.setItem('region_token', data.token);
        vm.$set('config', data);
        vm.$set('app_name ', data.app_name);
        document.title = data.app_name;
        vm.$set('user', data.user);
    }
});


function getSearch() {

    $.get(API('/base/users/favorite/search'), function (data) {
        if (data['error']) {
            console.error(data.error);
            return;
        }
        vm.$set('search_history ', data['search']['历史搜索']);
        vm.$set('search_follow', data['search']['重点关注']);
    });
}


function exit() {
    $.post(API('/base/users/logout'), function (data) {
        //console.log(data);
        if (data['error']) {
            return;
        }
        window.localStorage.removeItem('region_token');
        window.localStorage.removeItem('users_behavior');
        window.localStorage.removeItem('region_user_permissions');
        if (data['is_exit']) {
            window.location.href = __uri('/login');
        }
    });
}


//定义动画
function animate() {

    $('.user_drag').hover(function () {
        $('.search_menu').hide();
        $('ul.main_menu').slideDown('fast');
    });
    $('.user_box').hover(function () {

    }, function () {
        $('ul.main_menu').hide();
    });

    $('ul.main_menu > li').hover(function () {
        $(this).find('ul').show().end().siblings().find('ul').hide();
    });

    $('.search_drag').hover(function () {
        $('ul.main_menu').hide();
        $('.search_menu').slideDown('fast');
    });

    $('.search').hover(function () {

    }, function () {
        $('.search_menu').hide();
    });
}