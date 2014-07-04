## 异步

考虑第3，第4步中的app/views/campaings/standards render中的IO

```js
return View.extend({
    render: function() {
        var me = this;
        IO({
            url: 'list.json',
            dataType: 'json',
            success: function(data) {
                var html = Mustache.to_html(me.tmpl, {
                    list: data
                });
                me.setHTML(me.id,html);
            },
            error: function(xhr, msg) {
                me.setHTML(me.id,msg); //出错时，直接显示错误
            }
        });
    }
})
```

IO是异步的，当success或error回调时，有可能当前view已经被销毁或被重新渲染。所以当我们在success或error中操作界面时，有可能会找不到节点(view已销毁)或把界面渲染错误

比如一个带翻页的列表，当用户点击翻页到第2页，在第2页请求未结束时又点击翻页到第3页，此时有2个异步请求，即请求第2页的一个，请求第3页的一个。

问题在于我们无法确保第2页的请求一定先于第3页的请求先返回，假如第3页的请求先返回，第2页的请求后返回，此时我们去操作界面更新时，虽然每次都能更新界面(DOM节点仍然存在)，但会出现先显示第3页后显示第2页的情况。

这仅是IO异步所带来的问题，我们还要面对setTimeout setInterval KISSY.use等非常多的异步，所有的异步在OPOA项目中均存有问题或隐患，因此这也是单页应用想要程序很健壮变得比较难。

Magix的View提供了wrapAsync(1.1版本后)方法，用于解决所有的这种异步所带来的问题，即你只需要将异步回调函数通过该方法进行包装即可。如：

```diff
return View.extend({
    render: function() {
        var me = this;
        IO({
            url: 'list.json',
            dataType: 'json',
-           success: function(data) {
+           success:me.wrapAsync(function(data) {
                var html = Mustache.to_html(me.tmpl, {
                    list: data
                });
                me.setHTML(me.id,html);
-           },
+           }),
-           error: function(xhr, msg) {
+          error:me.wrapAsync(funcion(xhr,msg) {
                me.setHTML(me.id,msg); //出错时，直接显示错误
-           }
+           })
        });
    }
})
```

即wrapAsync可解所有的异步问题

**与manage的区别**

wrapAsync是包装异步回调的，manage是用于管理资源的。
wrapAsync在适当的时候对包装的方法进行调用，manage在适当的时候调用托管资源的destroy方法

二者在某些地方有相似之处，但无法把二者合并

如上的代码也可以用manage改写：

```diff
return View.extend({
    render: function() {
        var me = this;
-       IO({
+       var xhr=IO({
            url: 'list.json',
            dataType: 'json',
            success: function(data) {
                var html = Mustache.to_html(me.tmpl, {
                    list: data
                });
                me.setHTML(me.id,html);
            },
            error: function(xhr, msg) {
                me.setHTML(me.id,msg); //出错时，直接显示错误
            }
        });
+      me.manage({
+          destroy:function(){
+                 xhr.abort();
+            }
+       });
    }
})
```

使用wrapAsync时，并不会调用xhr的abort方法，而使用manage时，会调用到xhr的abort方法，此时需要特别注意KISSY的JSONP

xhr.abort的调用是在更新界面前才会被调用，如果需要在render方法调用时就abort上次的请求，此时无法使用manage，应监听view的prerender事件自行处理，或使用Magix提供的Model与ModelManager
