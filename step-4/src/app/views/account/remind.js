/*
 * author:xinglie.lkf@taobao.com
 */
KISSY.add('app/views/account/remind', function(S, View) {
    return View.extend({
        render: function() {
            this.setHTML(this.id, this.tmpl);
        }
    });
}, {
    requires: ['magix/view']
});