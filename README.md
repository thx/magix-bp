## 页面状态

![Step 4](http://thx.github.io/magix/assets/img/step-4.png)

### 保存与还原

现在我们要对上一个步骤中的列表进行排序，并记录该列是升序还是降序。要做到页面刷新、通过 URL
直接跳转至当前页等情况下都能还原当前的排序状态，我们需要将相关信息保存在 URL 中。

主要通过 magix/router 的 navigate 方法操作 URL （详见API）。

为了实现需求，首先给第一行的需要排序的列头注册 click 事件（假设我们给折扣进行排序），以便
在鼠标点击时排序：

```diff
--- a/app/views/campaigns/standards.html
+++ b/app/views/campaigns/standards.html
@@ -4,7 +4,7 @@
       <th width="20"></th>
       <th width="60">计划ID</th>
       <th class="left">计划名称</th>
-      <th width="90">折扣(%)</th>
+      <th width="90">折扣(%)<i class="iconfont" mx-click="sort{key:discount}">&#322;</i></th>
       <th width="90">类型</th>
       <th width="90">在线状态</th>
     </tr>
```

**注意**

在上例中我们使用了 iconfont 而非图片来显示排序的箭头，更多 iconfont 信息可
[参考这里](http://iconfont.cn)。`mx-event` 的写法及 `{key:discount}` 的参数传递，
可参考 Magix API 事件部分。

此时的界面如下：


界面显示出来了，但还无法响应排序动作，接下来我们书写事件处理函数 sort 方法。修改
app/campaigns/views/standards.js 增加如下内容：

```diff
--- a/app/views/campaigns/standards.js
+++ b/app/views/campaigns/standards.js
@@ -1,7 +1,7 @@
 /*
  * author:xinglie.lkf@taobao.com
  */
-KISSY.add("app/views/campaigns/standards", function(S, View, IO, Mustache) {
+KISSY.add("app/views/campaigns/standards", function(S, View, IO, Mustache, Router) {
     return View.extend({
         render: function() {
            var me = this;
            IO({
                url: 'api/list.json',
                dataType: 'json',
                success: function(data) {
                    var html = Mustache.to_html(me.tmpl, {
                        list: data
                    });
                    me.setHTML(me.id, html);
                },
                error: function(xhr, msg) {
                    me.setHTML(me.id, msg); //出错时，直接显示错误
                }
            });
        },
+
+        'sort<click>': function(e) {
+            var loc = this.location;
+            var sortby = loc.get('sortby'); // 获取地址栏当前存放的 sortby 参数，如果地址中不存在则值为 ''
+
+            if (sortby == 'desc') {
+                sortby = 'asc';
+            } else {
+                sortby = 'desc';
+            }
+            var sortkey = e.params.key; // 获取按哪个字段进行排序
+
+            Router.navigate({ // 通过 Router.navigate 改变地址中的参数
+                sortkey: sortkey,
+                sortby: sortby
+            });
         }
     })
 }, {
-    requires: ["magix/view", "ajax", "app/common/base/mustache"]
+    requires: ["magix/view", "ajax", "app/common/base/mustache", 'magix/router']
 });
```

此时我们仅仅是把相应的参数放到地址栏中，页面还不能根据地址栏参数排序。我们可以在视图init中增加
observeLocation 来监听地址栏地址的变化。在该方法内我们决定如何调整界面的显示：

```js
this.observeLocation({
    params: 'sortby,sortkey'
});
```

当 sortkey 或 sortby 发生改变后，我们仅仅是再次调用了 render 方法去重新渲染，因此我们需要
改造 render 方法：

```js
render: function() {
    var me = this;
    IO({
        url: 'src/api/list.json',
        dataType: 'json',
        success: function(data) {
            var loc = me.location;
            var sortby = loc.get('sortby');
            var sortkey = loc.get('sortkey');
            if (sortby && sortkey) { //地址栏中存在sortby和sortkey
                data.sort(function(a, b) { //直接调用数据的sort方法进行排序
                    var aValue = a[sortkey];
                    var bValue = b[sortkey];
                    aValue = parseInt(aValue.substring(0, aValue.length - 1), 10); //因示例中折扣是类似90%这样的字符串，因此去掉%号并转成整数
                    bValue = parseInt(bValue.substring(0, bValue.length - 1), 10);
                    if (sortby == 'asc') {//根据排序要求，进行相应的升序降序排序
                        return aValue - bValue;
                    } else {
                        return bValue - aValue;
                    }
                });
            }
            var html = Mustache.to_html(me.tmpl, {
                list: data,
                sortDesc: sortby == 'desc'
            });
            me.setHTML(me.id,html);
        },
        error: function(xhr, msg) {
            me.setHTML(me.id,msg); //出错时，直接显示错误
        }
    });
}
```

此时点击箭头界面即可排序，但我们注意到折扣后面的箭头并未进行改变，而是一直指向上方，所以
接下来要调整箭头，注意前面我们使用 mustache 渲染时，传递了 `sortDesc: sortby == 'desc'`
这个参数，所以在界面上我们根据 sortDesc 进行相应的调整即可。

```html
<th width="90">折扣(%)
  <i class="iconfont" mx-click="sort{key:discount}">
    {{#sortDesc}}&#320;{{/sortDesc}}{{^sortDesc}}&#322;{{/sortDesc}}
  </i>
</th>
```

到这里我们就完成了排序功能，刷新页面、直接跳转等情况时，页面仍可正确响应，包括浏览器的前进、
后退按钮，也都能正常工作。

### url的变化事件

如前面排序那样，我们在 sort 事件处理函数内仅仅是改变了 url 而已，接下来视图的
render 方法被自动调用。

在前面步骤三中我们接触到了 VOM，明白了视图之间是父子嵌套的一颗树，所以 url变化
的事件传播如下图：

![事件传播](http://gtms01.alicdn.com/tps/i1/T1FiC4FkVeXXXvOB2h-460-193.jpg)

由经父视图传递到子视图，父视图可控制具体传给哪个子视图。

考虑前面的例子，当地址栏参数 sortby 或 sortkey 有变化时，仅仅通知右侧区域列表即可，像
header、footer 和菜单无须接收该事件，所以我们改写 app/common/views/default.js 中的
render如下：

```diff
--- a/app/views/default.js
+++ b/app/views/default.js
@@ -7,6 +7,9 @@ KISSY.add("app/views/default", function(S, View, VOM) {
         render: function(e) {
             if (e&&e.changed.isPath()) {
                 this.mountMainFrame();
+            } else if (e&&e.changed.isParam('sortby,sortkey')) {
+                e.to('magix_vf_main');
+                // e.prevent();
             }
         },
         mountMainFrame: function() {
```

调用 e 的 e.to 只向某一个或几个视图传递 url变化 的消息。如果调用
e.prevent() 则所有的子视图都收不到 url变化 的消息。

为什么这里要在父视图上进行 url变化 的处理？主要是为了性能的考虑，避免不必要的消息
传递，当然，不处理我们的程序也没什么问题。

## 小结

在这一阶段，我们学会了通过参数保存页面状态，同时了解了 url变化 的传播过程，
在有必要的时候，可以在父视图上进行相应的控制，以提升整个应用的性能。

