/*
 * author:xinglie.lkf@taobao.com
 */
KISSY.add("app/campaigns/views/standards", function(S, View, IO, Mustache, Router) {
    return View.extend({
        render: function() {
            var me = this;
            IO({
                url: 'api/list.json',
                dataType: 'json',
                success: function(data) {
                    var loc = me.location;
                    var sortby = loc.get('sortby');
                    var sortkey = loc.get('sortkey');
                    if (sortby && sortkey) { //地址栏中存在sortby和sortkey
                        data.sort(function(a, b) { //直接调用数据的sort方法进行排序
                            var aValue = a[sortkey];
                            var bValue = b[sortkey];
                            aValue = parseInt(aValue.substring(0, aValue.length - 1), 10); //因示例中折扣是类似90%这样的字符串，因此去掉%号并转成整数
                            bValue = parseInt(bValue.substring(0, bValue.length - 1), 10);
                            if (sortby == 'asc') {//根据排序要求，进行相应的升序降序排序
                                return aValue - bValue;
                            } else {
                                return bValue - aValue;
                            }
                        });
                    }
                    var html = Mustache.to_html(me.template, {
                        list: data,
                        sortDesc: sortby == 'desc'
                    });
                    me.setViewHTML(html);
                },
                error: function(xhr, msg) {
                    me.setViewHTML(msg); //出错时，直接显示错误
                }
            });
        },

        locationChange: function(e) {
            if (e.changed.isParam('sortby,sortkey')) {
                this.render();
            }
        },

        'sort<click>': function(e) {
            var loc = this.location;
            var sortby = loc.get('sortby'); // 获取地址栏当前存放的 sortby 参数，如果地址中不存在则值为 undefined

            if (sortby == 'desc') {
                sortby = 'asc';
            } else {
                sortby = 'desc';
            }
            var sortkey = e.params.key; // 获取按哪个字段进行排序

            Router.navigate({ // 通过 Router.navigate 改变地址中的参数
                sortkey: sortkey,
                sortby: sortby
            });
        }
    })
}, {
    requires: ["magix/view", "ajax", "app/common/base/mustache", 'magix/router']
});