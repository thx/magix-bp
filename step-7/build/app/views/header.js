KISSY.add("app/views/header", function(S, View) {
     return View.extend({tmpl:"<div class=\"common-header\"> <a class=\"fl ml15 mt5 lh14\" href=\"#!/home\"> <img src=\"http://gtms04.alicdn.com/tps/i4/T18OGvFX8aXXcwQrfL-368-113.png\" width=\"101\" height=\"31\" /> </a> <div class=\"header-right fr mr15 mt10\"> <a class=\"ml15\" href=\"#!/home\" title=\"消息中心\"><i class=\"iconfont\">&#349;</i></a> <a class=\"ml15\" href=\"#!/home\" title=\"新手指引\"><i class=\"iconfont\">&#360;</i></a> <a class=\"ml15\" href=\"#!/home\" title=\"在线咨询\"><i class=\"iconfont\">&#357;</i></a> </div> </div>",
        render: function() {
            this.setHTML(this.id, this.tmpl);
        }
    });
}, {
    requires: ['magix/view']
});