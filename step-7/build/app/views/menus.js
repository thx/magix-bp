KISSY.add("app/views/menus", function(S, View) {
     return View.extend({tmpl:"<div class=\"common-left pb15\"> <ul class=\"topnav\"> <li class=\"topnav-list\"> <a class=\"text\" href=\"#!/home\">首页</a> </li> <li class=\"topnav-list\"> <a href=\"#\" mx-click=\"toggleSubMenus<prevent>\"> <i class=\"iconfont\">&#402;</i> 推广计划 </a> <ul class=\"subnav none\"> <li class=\"subnav-list\"><a class=\"text\" href=\"#!/campaigns/standards\">标准推广</a></li> </ul> </li> <li class=\"topnav-list\"> <a href=\"#\" mx-click=\"toggleSubMenus<prevent>\"> <i class=\"iconfont\">&#402;</i> 账户 </a> <ul class=\"subnav none\"> <li class=\"subnav-list\"><a class=\"text\" href=\"#!/account/recharge\">充值</a></li> <li class=\"subnav-list\"><a class=\"text\" href=\"#!/account/finance\">财务记录</a></li> <li class=\"subnav-list\"><a class=\"text\" href=\"#!/account/operation\">操作记录</a></li> <li class=\"subnav-list\"><a class=\"text\" href=\"#!/account/remind\">提醒设置</a></li> </ul> </li> </ul> <div class=\"service mt15 pt15 ml15 pl5\"> <h3 class=\"f18 gray\">客服支持</h3> <ul class=\"service-list mt15\"> <li>热线 0XXX-XXXXXX</li> <li>帮助中心</li> <li>培训中心</li> </ul> </div> </div>",
        init: function() {
            this.observeLocation({
                pathname: true
            });
        },

        render: function() {
            this.setHTML(this.id, this.tmpl);

            // 获取 pathname，this.location 由视图的基类传入
            // pathname 为 #! 之后，下一个 ? 之前（如果有）的部分
            var pn = this.location.path;

            // this.id 为当前视图所在 vframe 的 id
            // 在 vframe 内寻找是否有目标为 "#!" + pathname 的链接，如果找到了设置高亮。
            var link = S.one("#" + this.id).one('a[href="#!' + pn + '"]');

            if (link) {
                link.addClass('hover');

                // 如果菜单项为二级菜单，展现其所在 ul，并设置正确的父级菜单之前的箭头方向。
                var topNav = link.parent('.topnav-list');
                var ul = topNav.one('ul');

                if (ul) {
                    ul.removeClass('none');
                    var arrow = topNav.one('i');
                    if (arrow) {
                        arrow.html('&#405');
                    }
                }
            }
        },

        'toggleSubMenus<click>': function(e) {
            // 获取被点击的标签 A
            var target = S.one('#' + e.targetId);

            if (target[0].tagName == "I") {
                target = target.parent();
            }
            // 改变 A 的兄弟节点 ul 和 A 的子节点 arrow 的状态
            var ul = target.next("ul");
            var arrow = target.one("i");

            if (ul.hasClass("none")) {
                ul.removeClass("none");
                arrow.html("&#405");
            } else {
                ul.addClass("none");
                arrow.html("&#402");
            }
        }
    });
}, {
    requires: ['magix/view']
});