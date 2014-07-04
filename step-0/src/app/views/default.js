KISSY.add("app/views/default", function(S, View) {
    return View.extend({
        render: function() {
            this.setHTML(this.id, this.tmpl);
        }
    });
}, {
    requires: ['magix/view']
});