KISSY.add("app/views/menus",function(a,b){return b.extend({tmpl:'<div class="common-left pb15"> <ul class="topnav"> <li class="topnav-list"> <a class="text" href="#!/home">首页</a> </li> <li class="topnav-list"> <a href="#" mx-click="toggleSubMenus<prevent>"> <i class="iconfont">&#402;</i> 推广计划 </a> <ul class="subnav none"> <li class="subnav-list"><a class="text" href="#!/campaigns/standards">标准推广</a></li> </ul> </li> <li class="topnav-list"> <a href="#" mx-click="toggleSubMenus<prevent>"> <i class="iconfont">&#402;</i> 账户 </a> <ul class="subnav none"> <li class="subnav-list"><a class="text" href="#!/account/recharge">充值</a></li> <li class="subnav-list"><a class="text" href="#!/account/finance">财务记录</a></li> <li class="subnav-list"><a class="text" href="#!/account/operation">操作记录</a></li> <li class="subnav-list"><a class="text" href="#!/account/remind">提醒设置</a></li> </ul> </li> </ul> <div class="service mt15 pt15 ml15 pl5"> <h3 class="f18 gray">客服支持</h3> <ul class="service-list mt15"> <li>热线 0XXX-XXXXXX</li> <li>帮助中心</li> <li>培训中心</li> </ul> </div> </div>',init:function(){this.observeLocation({pathname:!0})},render:function(){this.setHTML(this.id,this.tmpl);var b=this.location.path,c=a.one("#"+this.id).one('a[href="#!'+b+'"]');if(c){c.addClass("hover");var d=c.parent(".topnav-list"),e=d.one("ul");if(e){e.removeClass("none");var f=d.one("i");f&&f.html("&#405")}}},"toggleSubMenus<click>":function(b){var c=a.one("#"+b.targetId);"I"==c[0].tagName&&(c=c.parent());var d=c.next("ul"),e=c.one("i");d.hasClass("none")?(d.removeClass("none"),e.html("&#405")):(d.addClass("none"),e.html("&#402"))}})},{requires:["magix/view"]});