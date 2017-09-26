//@require _
//@require nav.css

var header = require('../header');
exports.init = function (env_no, path, callback) {
    path = path || '../';
    var $dl = $('#nav dl');
    $dl.append('<dd><a href="' + path + 'main">' + header.vm.config.museum_name + '</a></dd>');

    $.get(API('/base/envs/navigation/' + env_no), function (data) {

        if (!data || !data['total']) {
            return;
        }
        _.each(data.rows, function (row) {
            $dl.append('<dd><a href="' + path + navs[row.type](row.env_no) + '">' + row.name + '</a></dd>');
        });
        callback && callback($dl);
    }, 'json');

};

var navs = {
    楼栋: function (env_no) {
        return 'main#/floor/' + env_no;
    },
    楼层: function (env_no) {
        return 'floor?env_no=' + env_no;
    },
    展厅: function (env_no) {
        return 'hall?env_no=' + env_no;
    },
    展柜: function (env_no) {
        return 'cabinet?env_no=' + env_no;
    }
};