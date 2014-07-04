KISSY.add("app/views/menus", function(S, View) {
    return View.extend({
        render: function() {
            this.setHTML(this.id, this.tmpl);
        }
    });
}, {
    requires: ['magix/view']
});