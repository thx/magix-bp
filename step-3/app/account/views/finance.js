/*
 * author:xinglie.lkf@taobao.com
 */
KISSY.add('app/account/views/finance', function(S, View) {
    return View.extend({
        render: function() {
            this.setViewHTML(this.template);
        }
    });
}, {
    requires: ['magix/view']
});