KISSY.add("app/common/views/default", function(S, View, VOM) {
    return View.extend({
        render : function() {
            this.setViewHTML(this.template);
            this.mountMainFrame();
        },
        locationChange: function(e) {
            if (e.changed.isPathname()) {
                this.mountMainFrame();
            }
        },
        mountMainFrame: function() {
            var pathname = this.location.pathname;
            var pns = pathname.split('/');
            pns.shift();
            var folder = pns.shift() || 'home';
            var view = pns.join('/') || 'index';
            var viewPath = 'app/' + folder + '/views/' + view;
            var vframe = VOM.get('magix_vf_main');

            vframe.mountView(viewPath);
        }
    });
}, {
    requires : ['magix/view', 'magix/vom']
});