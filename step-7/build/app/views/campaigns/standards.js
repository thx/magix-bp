/*
 * author:xinglie.lkf@taobao.com
 */
KISSY.add("app/views/campaigns/standards", function(S, View, Manager, Mustache, Router) {
     return View.extend({tmpl:"<table class=\"table\"> <thead> <tr> <th width=\"20\"></th> <th width=\"60\">计划ID</th> <th class=\"left\">计划名称</th> <th width=\"90\">折扣(%) <i class=\"iconfont\" mx-click=\"sort({key:'discount'})\"> {{#sortDesc}}&#320;{{/sortDesc}}{{^sortDesc}}&#322;{{/sortDesc}} </i> </th> <th width=\"40\">类型</th> <th width=\"70\">在线状态</th> </tr> </thead> <tbody> {{#list}} <tr> <td> <label class=\"checkbox\"> <input type=\"checkbox\" class=\"selectLine\" value=\"{{campaignId}}\" /> </label> </td> <td>{{campaignId}}</td> <td>{{title}}</td> <td>{{discount}}</td> <td>{{type}}</td> <td>{{onlineState}}</td> </tr> {{/list}} </tbody> </table>",
        init: function() {
            this.observeLocation({
                params: 'sortby,sortkey'
            });
        },
        render: function() {
            var me = this;
            Manager.createRequest(me).fetchAll('Campaigns_List', function(e, m) {
                if (e) {
                    me.setHTML(me.id, e.msg);
                } else {
                    var list = m.get('list', []);
                    var loc = me.location;
                    var sortby = loc.get('sortby');
                    var sortkey = loc.get('sortkey');
                    if (sortby && sortkey) { //地址栏中存在sortby和sortkey
                        list.sort(function(a, b) { //直接调用数据的sort方法进行排序
                            var aValue = a[sortkey];
                            var bValue = b[sortkey];
                            aValue = parseInt(aValue.substring(0, aValue.length - 1), 10); //因示例中折扣是类似90%这样的字符串，因此去掉%号并转成整数
                            bValue = parseInt(bValue.substring(0, bValue.length - 1), 10);
                            if (sortby == 'asc') { //根据排序要求，进行相应的升序降序排序
                                return aValue - bValue;
                            } else {
                                return bValue - aValue;
                            }
                        });
                    }
                    var html = Mustache.to_html(me.tmpl, {
                        list: list,
                        sortDesc: sortby == 'desc'
                    });
                    me.setHTML(me.id, html);
                }
            });
        },
        'sort<click>': function(e) {
            var loc = this.location;
            var sortby = loc.get('sortby'); // 获取地址栏当前存放的 sortby 参数，如果地址中不存在则值为 ''

            if (sortby == 'desc') {
                sortby = 'asc';
            } else {
                sortby = 'desc';
            }
            var sortkey = e.params.key; // 获取按哪个字段进行排序

            Router.navigate({ // 通过 Router.navigate 改变地址中的参数
                sortkey: sortkey,
                sortby: sortby
            });
        }
    })
}, {
    requires: ["magix/view", "app/models/manager", "app/common/mustache", 'magix/router']
});