在这个阶段我们会添加一些代码，让菜单区块变得可以正常响应用户交互：

![Step 2](http://thx.github.io/magix/assets/img/step-2.png)

## 视图生命周期

展现一个视图，并使其可交互，往往分为三个步骤，如 YUI3 中对 widget 的定义：

1. render ：将 html 结构加入到页面中
2. bind ：绑定交互事件
3. sync ：根据状态数据设置 html 的状态（比如本例，设置 menus 视图中的高亮项）

在 Magix 以及后续将介绍的 Brix 组件系统中，我们更惯用的步骤是：

1. render
2. sync
3. bind

我们推荐使用模板系统，在 render 时即将 HTML 状态维护好，将步骤1与2结合在一起。但无论如何，
这三个步骤所涉及的动作，对于任何视图或组件系统都是不可或缺的。我们仍然需要渲染它、设置好它的
初始状态，给它绑定需要响应的事件。

接下来本例将关注三个任务：

1. render(render+sync) ：菜单渲染，并在渲染之后根据 url 的 pathname，设置高亮菜单项。
2. observeLocation ：这是单页应用特有的方法，当页面的 url 发生变化，页面不会整体销毁，
   页面内的视图需要及时正确地做出响应。
3. events(bind) ：监听菜单点击事件，当点击分组节点时，可以展开或折起其下的二级菜单项。

### render

左侧导航菜单的render方法如下：

```js
render : function() {
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
            if(arrow) {
                arrow.html('&#405');
            }
        }
    }
}
```

视图类 menus 继承自 magix/view，基类初始化时为每一个视图实例写入了若干属性，包括之前用到的
`this.tmpl` 和本例使用的 `this.id`、`this.location`。

this.id 为当前视图所处 vframe 节点的 id，也就是当前视图的根 DOM 节点 id。

this.location 为整个 url 的 hash 部分按照 Magix 约定的规则解析后的结构化对象，主要包含
逻辑页面名称（path）和参数（params）等。

**注意**

1. 在 Magix 中，VOM、View、VFrame 对象的实例都不持有 DOM 节点，仅持有节点 ID，这有助于
   控制单页应用的内存占用。
2. 示例中的图标使用 iconfont 技术，iconfont 的自定义字体库中的每个字都是一个图标，通过
   字符编码来设置图标(如 `&#405`，是向下箭头)。详见:<http://ux.etao.com/fonts>

### observeLocation

observeLocation 方法会在页面 url 发生改变时，并且我们指定的参数发生变化时，view的render方法被再次调用，在本例中我们先采用每次 url path发生变化时
重新渲染整个菜单的方案。


在视图初始化时，通过 observeLocation 指定只关注 path 的变化，只有 path 变化时
render 方法才会被调用。也可以利用这个方法来明确指定仅关注 url 某些参数的变化。
详见：@API。

**思考**

即便是只有 path 变化时触发 render 重新构建 menus
的所有 DOM 的解决方案看起来依然不够好。理想的状况是，仅仅通过 DOM 方法去改变高亮和子菜单的
收起展开状态，但这会引入额外的代码量。

当前我们的 sync 部分，都是从一个 render 之后的固定状态 A 出发，根据 path 设置高亮
到达最终状态 B 或者 C，即：A -> anystate。

如果不重新 render，想从 B 直接变化至 C，sync部分代码必须将状态从 B 还原至 A 状态，再
设置成 C 状态，即：anystate -> A -> anystate.

在针对具备自定义交互模式的组件实现中（即便本例的交互并不太复杂，也既要去除高亮，又可能需要
收起二级菜单并改变箭头方向等等）， anystate -> A 的还原过程需要大量 hardcode，而越过 A
直接做到 anystate -> anystate 的实现会更加复杂。

最终这件事归结为一个代码量与点滴性能消耗之间的选择题。在 Magix 以及后续会介绍 Brix 组件
架构中，我们倾向于通过重构 DOM 的方法来回归状态 A，并尽可能借助模板引擎在渲染之前同步完成
A -> anystate 的过程，同时我们会尝试尽可能的让需要重构区域变小。

而时下流行的基于数据和结构双向绑定组件实现方案，是否必须要具备
anystate( -> A) -> anystate 的能力呢？

### events ：事件处理

在 menus 视图中，我需要在用户点击一级菜单时展开或隐藏二级菜单。我们以 "推广计划"(一级菜单)
-> "标准推广"(二级菜单) 这一菜单组为例

```html
<li class="topnav-list">
    <a href="#" mx-click="toggleSubMenus<prevent>">
        <i class="iconfont">&#402;</i>
        推广计划
    </a>
    <ul class="subnav none">
        <li class="subnav-list">
                <a class="text" href="#!/campaigns/standards">标准推广</a>
            </li>
    </ul>
</li>
```

这个代码片段的第二行需要特别注意：`<a href="#" mx-click="toggleSubMenus<prevent>">`
从字面上就很好理解，我们希望在点击这个 a 标签时做状态切换，但我们用了自定义属性 mx-click，
而非原生的 onclick，也非 KISSY、jQuery 等常推荐的事件绑定方案。

其首要原因依然是出于对单页应用内存占用的考量，我们希望通过这种方式能够在架构层面减少在实际
业务代码中出现系列可能触发内存泄露的代码写法。在这之前我们看 events 的 JS 代码部分：

```js
'toggleSubMenus<click>' : function(e) {
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
```

首先 `toggleSubMenus<click>` 和 init、render 一样将被混入 menus 类的原型链。此方法名
比较特殊，当 menus 类被初始化时会遍历自身方法，将这类事件监听函数代理（委托）由Magix统一添加到document.body节点上。

当点击事件发生时，我们可以通过被点击元素的 `mx-click` 属性值找到对应的处理函数。关于这套
另类事件代理方案详情，以及在内存控制方面的相关研究，请参考：[Maigx中的事件处理](http://thx.github.io/magix/articles/about-delegate-event/)

**注意**

1. 我们自然需要点击 `<i>` 标签包含的箭头时，同样可以展开或收起子菜单，针对常见的类似 `<a>`
   标签内包含图标或图片等的情况，Magix 做了处理，这样就无需为 `<i>` 标签也增加 `mx-click`
   属性。
2. 我们看到 `<prevent>` 标识来告诉事件处理函数，阻止 `<a>` 标签的默认行为。

另外，还值得注意的是，在 Magix 1.1 后续版本中，遵循了最小加载原则，默认是没有加载 KISSY 的
Node 模块的，我们需要自行引入：

```diff
--- a/index.html
+++ b/index.html
@@ -19,7 +19,7 @@
           }
       ]
   })
-  KISSY.use('magix/magix', function(S, Magix) {
+  KISSY.use('magix/magix,node', function(S, Magix) {
       Magix.start({
           iniFile: 'app/ini',
       })
```

## 小结

在这一阶段，我们介绍了一个简单的菜单视图的开发，是 Magix 的核心。当我们后续引入模板系统，
并引入异步的动态数据之后，就是一个完整的单个视图开发方案了。而 Magix 又进一步的通过 VOM
树，将多个视图关联到一起，这样最终形成了完整的 Magix 的视图层设计。

从另一个角度，当一个视图抛开了对 url变化的监听，Magix 的单个视图构建方案又可以看做
一个完整的组件搭建模式，包含初始化、销毁，以及明确的 render\sync\bind 方案。这正式多次
提到的 Brix 组件架构的雏形。

接下来是时候给应用的主区域添加一些内容了。