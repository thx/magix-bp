KISSY.add("app/views/campaigns/standards",function(a,b,c,d,e){return b.extend({tmpl:'<table class="table"> <thead> <tr> <th width="20"></th> <th width="60">计划ID</th> <th class="left">计划名称</th> <th width="90">折扣(%) <i class="iconfont" mx-click="sort({key:\'discount\'})"> {{#sortDesc}}&#320;{{/sortDesc}}{{^sortDesc}}&#322;{{/sortDesc}} </i> </th> <th width="40">类型</th> <th width="70">在线状态</th> </tr> </thead> <tbody> {{#list}} <tr> <td> <label class="checkbox"> <input type="checkbox" class="selectLine" value="{{campaignId}}" /> </label> </td> <td>{{campaignId}}</td> <td>{{title}}</td> <td>{{discount}}</td> <td>{{type}}</td> <td>{{onlineState}}</td> </tr> {{/list}} </tbody> </table>',init:function(){this.observeLocation({params:"sortby,sortkey"})},render:function(){var a=this;c.createRequest(a).fetchAll("Campaigns_List",function(b,c){if(b)a.setHTML(a.id,b.msg);else{var e=c.get("list",[]),f=a.location,g=f.get("sortby"),h=f.get("sortkey");g&&h&&e.sort(function(a,b){var c=a[h],d=b[h];return c=parseInt(c.substring(0,c.length-1),10),d=parseInt(d.substring(0,d.length-1),10),"asc"==g?c-d:d-c});var i=d.to_html(a.tmpl,{list:e,sortDesc:"desc"==g});a.setHTML(a.id,i)}})},"sort<click>":function(a){var b=this.location,c=b.get("sortby");c="desc"==c?"asc":"desc";var d=a.params.key;e.navigate({sortkey:d,sortby:c})}})},{requires:["magix/view","app/models/manager","app/common/mustache","magix/router"]});