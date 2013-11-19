/*
 * author:xinglie.lkf@taobao.com
 */
KISSY.add("app/campaigns/views/standards", function(S, View, IO, Mustache) {
    return View.extend({
        render: function() {
            var me = this;
            IO({
                url: 'api/list.json',
                dataType: 'json',
                success: function(data) {
                    var html = Mustache.to_html(me.template, {
                        list: data
                    });
                    me.setViewHTML(html);
                },
                error: function(xhr, msg) {
                    me.setViewHTML(msg); //出错时，直接显示错误
                }
            });
        }
    })
}, {
    requires: ["magix/view", "ajax", "app/common/base/mustache"]
});