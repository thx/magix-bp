/*
 * author:xinglie.lkf@taobao.com
 */
KISSY.add("app/views/home/index", function(S, View) {
     return View.extend({tmpl:"<h2>欢迎来到 Magix Tutorial 首页</h2>",
        render: function() {
            this.setHTML(this.id, this.tmpl);
        }
    })
}, {
    requires: ["magix/view"]
});