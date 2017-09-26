//依赖
// @require login.css
// @require vue
// @require jquery
// @require qrcode

if (!window['localStorage']) {
    alert('当前浏览器不能使用本地存储，请更换chrome谷歌浏览器或火狐浏览器等现代浏览器');
}

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

var vm = new Vue({
    el: '#login',
    data: {
        app_name: '',
        app_login: '',
        msg: '',
        user: '',
        pwd: '',
        check_box: 0
    },
    methods: {
        login: login
    }
});

getConfig();

function getConfig() {

    $.get(API('/base/config#nologin'), function (data) {
        if (data['error']) {
            console.error(data);
            return;
        }
        console.log(data);
        window.localStorage.setItem('region_token', data.token);
        vm.$set('app_name', data.app_name);
        vm.$set('app_login', data.app_login);
        document.title = data.app_name;
        if (data['user']) {
            document.body.innerHTML = '';
            window.location.href = __uri('/regional_center');
            return;
        }
        window.localStorage.setItem('region_user_permissions', '');

        jQuery('#QR_code').qrcode({width: 121, height: 121, text: location.origin + location.pathname});

    });
}

function login() {

    if (!vm.user) {
        vm.$set('msg', "请输入用户名!");
        return;
    }
    if (!vm.pwd) {
        vm.$set('msg', "请输入密码!");
        return;
    }
    // if (!vm.check_box) {
    //     vm.$set('msg', "请勾选'我同意该系统保密协议所有规定'");
    //     return;
    // }
    $.post(API('/base/users/login'), {user: vm.user, pwd: vm.pwd}, function (data) {
        console.log(data);
        if (data['error']) {
            vm.$set('msg', data.error);
            return;
        }
        vm.$set('msg', data.msg);
        if (data['is_login']) {
            localStorage.setItem('region_token', data.token);
            localStorage.setItem('region_user_permissions', data.permissions);
            //跳转至区域中心页面
            var active_modules = window.localStorage.getItem('active_modules');
            if(active_modules){
                window.location.href = __uri('/regional_center/#!/'+active_modules);
            }else{
                window.location.href = __uri('/regional_center/#!/detail');
            }
        }
    });
}