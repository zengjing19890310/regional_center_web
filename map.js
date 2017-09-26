var _ = require('underscore');
var path = require('path');
var maps = {};
var alias = {
    mod: '/js/mod.js',
    'jquery,$': '/js/jquery-1.10.2.min.js',
    echarts: '/js/echarts.js',
    dataTool: '/js/dataTool.js',
    angular: '/js/angular/angular.min.js',
    'angular-route': '/js/angular/angular-route.min.js',
    'angular-animate': '/js/angular/angular-animate.min.js',
    qrcode: '/js/jquery.qrcode.min.js',
    mousewheel:'/js/jquery.mousewheel.js',
    laydate: '/js/laydate/laydate.js',
    _: '/js/underscore-min.js',
    vue: '/js/vue.js',
    'vue-router': '/js/vue-router.js',
    bootstrap: '/js/bootstrap-3.3.5-dist/js/bootstrap.js',
    'bootstrap.css': '/js/bootstrap-3.3.5-dist/css/bootstrap.min.css',
    tooltip:'/js/tooltip.js',
    'semantic_ui.css':'/js/Semantic-UI-CSS-master/semantic.css',
    semantic_ui:'/js/Semantic-UI-CSS-master/semantic.js',
    lodash:'/js/lodash.min.js',
    Sortable:'/js/Sortable.min.js',
    vuedragablefor:'/js/vuedragablefor.js'
    //'dragula.css':'/js/dragula-master/dist/dragula.css',
    //dragula:'/js/dragula-master/dist/dragula.js',
};
var alias_min = {
    'echarts': '/js/echarts.min.js',
    dataTool: '/js/dataTool.min.js',
    'vue': '/js/vue.min.js',
    'vue-router': '/js/vue-router.min.js',
};

_.each(alias, function (uri, keys) {
    var key_arr = keys.split(',');
    _.each(key_arr, function (key) {
        maps[key] = {deps: [], uri: uri};
    });
});

exports.set_min = function () {

    _.each(alias_min, function (uri, keys) {
        var key_arr = keys.split(',');
        _.each(key_arr, function (key) {
            maps[key] = {deps: [], uri: uri};
        });

    });

};

exports.add = function (module_id, uri) {
    if (!_.contains(maps[module_id].deps, uri)) {
        maps[module_id].deps.push(uri);
    }
};

exports.init = function (options, file) {
    var fpath = file.path;
    var uri = fpath.replace(path.normalize(options.root), '');
    uri = uri.replace(/\\/g, '/');
    maps[options.module_id] = {deps: [], uri: uri};

};

exports.get = function (modules_id) {
    return maps[modules_id] ? maps[modules_id] : false;
};
exports.getAll = function () {
    return maps;
};
exports.getDepAll = function (modules_id, file) {
    var _maps = _.clone(maps);
    _.each(_maps, function (map, mod_id) {
        if (map.deps.length == 0) {
            return;
        }
        _.each(map.deps, function (deps_mod_id) {
            //console.log(deps_mod_id);
            if (!_maps[deps_mod_id]) {
                console.error(file.path, deps_mod_id + ' not find');
                return;
            }
            _maps[mod_id].deps = _.union(_maps[deps_mod_id]['deps'], _maps[mod_id].deps);
        });
    });
    return _maps[modules_id].deps;
};