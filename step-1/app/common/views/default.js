KISSY.add("app/common/views/default", function(S, View) {
    return View.extend({
        render : function() {
            this.setViewHTML(this.template);
        }
    });
}, {
    requires : ['magix/view']
});