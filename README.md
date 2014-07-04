开发完成顶部，页脚，菜单后，让我们把右侧区域丰满起来吧，根据左侧的菜单改变右侧的内容

![Step 3](http://thx.github.io/magix/assets/img/step-3.png)

## 主要区域开发

### 1. 确定 pathname

为了方便后续开发，我们先根据菜单内容规划 pathname，因为是单页应用，所以我们规划的都是逻辑
地址：

<table>
  <tr>
    <td>首页</td>
    <td>/home</td>
  </tr>
  <tr>
    <td>推广计划-标准推广</td>
    <td>/campaings/standards</td>
  </tr>
  <tr>
    <td>账户-充值</td>
    <td>/account/recharge</td>
  </tr>
  <tr>
    <td>账户-财务记录</td>
    <td>/account/finance</td>
  </tr>
  <tr>
    <td>账户-操作记录</td>
    <td>/account/operation</td>
  </tr>
  <tr>
    <td>账户-提醒设置</td>
    <td>/account/remind</td>
  </tr>
</table>

`app/views/menus.html` 中链接如下：

```html
<li class="subnav-list">
    <a class="text" href="#!/account/recharge">充值</a>
</li>
```

**注意**

`<a>` 标签中的 href 是 `#!/account/recharge` 类似这样的写法。首页是 `/home`，只有一级，
而其它的是类似 `/account/recharge` 两级的形式，后面在这个地方特殊处理下。

### 2. 在主体区域显示相关的内容

不管是首页还是标准计划列表，我们注意到整体页面的布局并没有改变，所以我们只需要在
app/views/default 中来决定右侧区域如何渲染。

在这一步中，我们为了后续的开发和维护方便，我们根据 **首页** 或 **推广计划** 来建立新的
文件夹，并把与之相关的view放在各自的文件中进行管理，所以这时候文件结构可能是这样的：

```bash
src
 └─app
     │  ini.js
     │
     ├─assets
     │      global.css
     │
     ├─common
     │      mustache.js
     │
     └─views
         │  default.html
         │  default.js
         │  header.html
         │  header.js
         │  menus.html
         │  menus.js
         │
         ├─account
         │      finance.html
         │      finance.js
         │      operation.html
         │      operation.js
         │      recharge.html
         │      recharge.js
         │      remind.html
         │      remind.js
         │
         ├─campaigns
         │      standards.html
         │      standards.js
         │
         └─home
                 index.html
                 index.js

```

1. 在 src/app/views/home 文件夹下建立 index.html 和 index.js
2. 在 src/app/views/campaigns 文件夹下建立 standards.html 和 standards.js
3. 视图的建立及显示 步骤1 和 步骤2 已经介绍过了，所以这里不再重复。

我们先在各自的 html 里写入简单的一句话用做测试，先不书写大量的代码。

接下来我们来做最重要的一块： **根据 pathname 显示相应的 view**

我们的 pathname 是：

- /home
- /campaings/standards

而我们的文件夹路径（KISSY 模块标识）是：

- app/views/home/index
- app/views/campaings/standards

所以我们需要一定的策略把 pathname 转换成 KISSY 的模块标识。

处理后的 default.js 代码长这样：

```js
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
            if (pns[0] == 'index') {
                pns[0] = 'home'; //特殊处理home
                pns[1] = 'index';
            }
            var viewPath = 'app/views/' + pns.join('/');
            var vframe = VOM.get('magix_vf_main');

            vframe.mountView(viewPath);
        }
    });
}, {
    requires: ['magix/view', 'magix/vom']
});
```

此时就可以点击左侧的链接切换主区域了。

### 3.获取异步数据

假设在 **推广计划-标准推广** 下显示一个列表。

首先在项目目录下建议一个 api 目录，我们后续会把所有暂时用的模拟数据放在该目录里。
在 api 目录下建立一个 list.json 做为我们的数据源，里面的内容如下：

```json
[{
    "campaignId": "4956820",
    "title": "明星店铺",
    "type": "1",
    "onlineState": "1",
    "settleState": "1",
    "discount": "100%"
}, {
    "campaignId": "2804049",
    "title": "立如计划立如计划立如计划立如计划立如",
    "type": "0",
    "onlineState": "1",
    "settleState": "1",
    "discount": "249%"
}, {
    "campaignId": "4948049",
    "title": "sid = 131234567890",
    "type": "0",
    "onlineState": "1",
    "settleState": "1",
    "discount": "100%"
}, {
    "campaignId": "4949219",
    "title": "修改campaign-操作日志",
    "type": "0",
    "onlineState": "1",
    "settleState": "1",
    "discount": "1000%"
}, {
    "campaignId": "1000090709",
    "title": "专用Campaign",
    "type": "0",
    "onlineState": "1",
    "settleState": "0",
    "discount": "100%"
}, {
    "campaignId": "1000096773",
    "title": "1",
    "type": "0",
    "onlineState": "1",
    "settleState": "0",
    "discount": "100%"
}, {
    "campaignId": "4949061",
    "title": "曲舞量子数据测试-勿删勿改",
    "type": "0",
    "onlineState": "1",
    "settleState": "1",
    "discount": "0%"
}, {
    "campaignId": "2000065",
    "title": "qqqqqq33",
    "type": "0",
    "onlineState": "1",
    "settleState": "1",
    "discount": "250%"
}, {
    "campaignId": "1000007722",
    "title": "sem-test-quwu",
    "type": "0",
    "onlineState": "1",
    "settleState": "1",
    "discount": "100%"
}, {
    "campaignId": "1000090088",
    "title": "服务化新增全店[勿动]",
    "type": "2",
    "onlineState": "1",
    "settleState": "0",
    "discount": "100%"
}, {
    "campaignId": "1000058968",
    "title": "活动专区",
    "type": "3",
    "onlineState": "1",
    "settleState": "1",
    "discount": "100%"
}, {
    "campaignId": "1000105371",
    "title": "defaulttitle",
    "type": "4",
    "onlineState": "1",
    "settleState": "0",
    "discount": "100%"
}, {
    "campaignId": "1000105590",
    "title": "defaulttitle",
    "type": "4",
    "onlineState": "1",
    "settleState": "0",
    "discount": "100%"
}]
```

修改 app/views/campaings/standards.js 的代码：

```
/*
 * author:xinglie.lkf@taobao.com
 */
KISSY.add("app/views/campaigns/standards", function(S, View, IO) {
    return View.extend({
        render: function() {
            var me = this;
            IO({
                url: 'api/list.json',
                dataType: 'json',
                success: function(data) {
                    me.setHTML(me.id,data.length); //先简单的在界面上把数据的条数打印出来
                },
                error: function(xhr, msg) {
                    me.setHTML(me.id,msg); //出错时，直接显示错误
                }
            });
        }
    })
}, {
    requires: ["magix/view", "ajax"]
});
```

通过以上示例，我们使用 KISSY 的 ajax 取得服务器数据并显示出来多少条数据，接下来我们介绍
使用模板渲染视图。

### 4.使用模板渲染

逻辑与展现分离的好处就不多说了，magix 的视图层本身也是分为 html 与 js 的，所以接下来我们
把刚才取到的数据使用模板来生成最终的 html。

前端模板引擎在这里我们采用 mustache，为了适应 KISSY 模块加载，我们稍微改造了下，可以参考
源码。改造后的 mustache 放在 app/common/mustache

更多 mustache的信息请[参考这里](http://mustache.github.io/)

改造后的 js 写法：

```
/*
 * author:xinglie.lkf@taobao.com
 */
KISSY.add("app/views/campaigns/standards", function(S, View, IO, Mustache) {
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
        }
    })
}, {
    requires: ["magix/view", "ajax", "app/common/mustache"]
});
```

修改 app/campaigns/views/standards.html 如下：

```html
<table class="table">
  <thead>
    <tr>
      <th width="20"></th>
      <th width="60">计划ID</th>
      <th class="left">计划名称</th>
      <th width="90">折扣(%)</th>
      <th width="90">类型</th>
      <th width="90">在线状态</th>
    </tr>
  </thead>
  <tbody>
    {{#list}}
    <tr>
      <td>
        <label class="checkbox">
          <input type="checkbox" class="selectLine" value="{{campaignId}}" />
        </label>
      </td>
      <td>{{campaignId}}</td>
      <td>{{title}}</td>
      <td>{{discount}}</td>
      <td>{{type}}</td>
      <td>{{onlineState}}</td>
    </tr>
    {{/list}}
  </tbody>
</table>
```

这地方我们使用了brix/gallery/tables组件，因此在index.html的head里要把相应的css也加上

```html
<link rel="stylesheet" type="text/css" href="http://a.tbcdn.cn/apps/e/brix/gallery/tables/tables.css">
```

## 小结

在这一阶段，我们介绍了如何根据 path 动态地渲染想要的视图，如何获取后台数据及使用模板
引擎来帮助我们渲染界面。