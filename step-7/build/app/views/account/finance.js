/*
 * author:xinglie.lkf@taobao.com
 */
KISSY.add('app/views/account/finance', function(S, View) {
     return View.extend({tmpl:"magix view content",
        render: function() {
            this.setHTML(this.id, this.tmpl);
        }
    });
}, {
    requires: ['magix/view']
});