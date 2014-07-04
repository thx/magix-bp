## 使用Model与ModelManager请求数据

在src/app/目录下建立models文件夹，以便放我们项目中的model与manager

建立src/app/models/model.js文件，继承magix/model，并实现sync方法

```js
KISSY.add('app/models/model', function(S, Model, IO) {
    return Model.extend({
        sync: function(callback) {
            var me = this;
            IO({
                url: me.get('url'),
                dataType: 'json',
                success: function(data) {
                    callback(null, {
                        list: data
                    });
                },
                error: function(xhr, msg) {
                    callback(msg);
                }
            });
        }
    });
}, {
    requires: [
        'magix/model',
        'io'
    ]
});
```

建立Manager，并注册我们项目中要用到的一些接口

```js
KISSY.add('app/models/manager', function(S, BaseManager, Model) {
    var Manager = BaseManager.create(Model);
    Manager.registerModels([{
        name: 'Campaings_List',
        url: 'api/list.json'
    }]);
    return Manager;
}, {
    requires: [
        'magix/manager',
        'app/models/model'
    ]
});
```

然后修改src/app/views/campaigns/standards.js的render方法成：

```js
render: function() {
    var me = this;
    Manager.createRequest(me).fetchAll('Campaigns_List', function(e, m) {
        if (e) {
            me.setHTML(me.id,e.msg);
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
            me.setHTML(me.id,html);
        }
    });
}
```

注意对Manager的require

```js
requires: ["magix/view", "app/models/manager", "app/common/mustache", 'magix/router']
```

到此，我们就完成了使用Magix提供的Model与Manager来进行管理接口及异步的请求。

如上述示例中展示的代码，我们对Manager.createRequest(me)做一个说明：

request.fetchX返回的是Request实例，(查看API)。本身带destroy方法，可以在合适的时候销毁请求，同时Magix内部对Request做了特殊处理，当view的render方法被调用时，就会立即销毁托管的Request实例，而不像前面提到的界面渲染前。
