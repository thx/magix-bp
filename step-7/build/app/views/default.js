KISSY.add("app/views/default", function(S, View, VOM) {
     return View.extend({tmpl:"<table id=\"main\"> <tr> <td colspan=\"2\"> <vframe mx-view=\"app/views/header\" id=\"magix_vf_header\"></vframe> </td> </tr> <tr> <td id=\"left\"> <vframe mx-view=\"app/views/menus\" id=\"magix_vf_menus\" ></vframe> </td> <td id=\"right\"> <div class=\"inmain\"> <vframe id=\"magix_vf_main\">Main VFrame</vframe> </div> </td> </tr> </table>",
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