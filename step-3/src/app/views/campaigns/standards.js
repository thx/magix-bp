/*
 * author:xinglie.lkf@taobao.com
 */
KISSY.add("app/views/campaigns/standards", function(S, View, IO, Mustache) {
    return View.extend({
        render: function() {
            var me = this;
            IO({
                url: 'api/list.json',
                dataType: 'json',
                success: function(data) {
                    var html = Mustache.to_html(me.tmpl, {
                        list: data
                    });
                    me.setHTML(me.id, html);
                },
                error: function(xhr, msg) {
                    me.setHTML(me.id, msg); //出错时，直接显示错误
                }
            });
        }
    })
}, {
    requires: ["magix/view", "ajax", "app/common/mustache"]
});