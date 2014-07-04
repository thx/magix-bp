KISSY.add("app/views/default", function(S, View, VOM) {
    return View.extend({
        init: function() {
            this.observeLocation({
                path: true
            });
        },
        render: function(e) {
            if (!e) {
                this.setHTML(this.id, this.tmpl);
            }
            this.mountMainFrame();
        },
        mountMainFrame: function() {
            var path = this.location.path;
            var pns = path.split('/');
            pns.shift();
            if (pns[0] == 'home') {
                pns.push('index'); //特殊处理home
            }
            var viewPath = 'app/views/' + pns.join('/');
            var vframe = VOM.get('magix_vf_main');

            vframe.mountView(viewPath);
        }
    });
}, {
    requires: ['magix/view', 'magix/vom']
});