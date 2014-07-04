这个阶段将为页面建立简单的布局结构：

![Step 1](http://thx.github.io/magix/assets/img/step-1.png)

## 建立布局

### 修改根 View

我们来修改根视图（app/views/default），将页面拆分成头部、侧边栏、主信息
三个区域。

从简单的表格布局可以直接看出，当前的页面基础布局包含三块：

- 上方头部通栏
- 左侧菜单栏
- 右侧主信息区

相应的系统引入了三个 vframe，作为这三个区块的容器，在父视图`app/views/default`
装载结束之后，Magix 将自动分析出页面中的子 vframe 进行后续处理：

我们通过自定义属性 `mx-view`，为上方头部通栏和左侧菜单栏分别指定将装载到 vframe 中的 view，
分别是 `app/views/header` 和 `app/views/menus`。

在父视图装载结束后，这两个视图将会被装载。而右侧主信息区的 vframe 节点上没有
`mx-view` 属性，在未来的阶段开发者将根据 URL，通过自定义的脚本来控制其内加载哪个 view。

我们为三个 vframe 指定了 id 属性，未来可以通过 id 属性，快速从 VOM 检索到所需的 vframe。

### 引入样式

在步骤零中，我们引入了 [Cube](http://thx.github.io/cube)，它是阿里妈妈前端团队的基础
样式。本步骤中，因为引入了布局，和稍显复杂的侧边导航，我们引入了项目中的样式。因为不是讨论
重点，这里姑且带过，跟从教程走到这里的同学，直接复制样式到相应目录，然后在 `<head>` 中补上：

```html
<link rel="stylesheet" type="text/css" href="src/app/assets/global.css">
```

### 头部与侧边栏

我们制作了静态的 header 和 menus 视图，包含如下文件：

* src/app/views/header.html
* src/app/views/header.js
* src/app/views/menus.html
* src/app/views/menus.js

两个视图的 html 结构暂不详述，它们的 js 文件与 default 视图对应的 js 模块功能一致，即将
视图 html 完整地渲染至 vframe 内。

## 锦囊

### 独立开发 View

Magix 的视图之间具备父子关系，形成了一棵树，称 VOM，(讨论1)。
页面将从根视图开始沿着 VOM 树层次化渲染整个页面。

如果我们强制指定根视图为 VOM 上的某个子节点，页面就会从以这个子视图开始向下渲染。
为了达到这个目的，我们稍稍调整 route 方法即可。

```diff
--- a/app/ini.js
+++ b/app/ini.js
@@ -2,7 +2,7 @@ KISSY.add('app/ini', function(S) {
     return {
         defaultView: 'app/views/default',
+        defaultPath: '/home',
         routes: function(pathname) {
-            return this.defaultView;
+            return pathname.indexOf('app/' === 0) ? pathname : this.defaultView
         }
     };
 });
```

按照之前的代码约定，每个视图都对应一个 app 目录下的模块，当 routes 方法解析 pathname 时，
发现以 `app/` 开头的 pathname 即返回其自身，这样就可以此 pathname 对应的视图为根视图构建
展现。

在本示例中，访问：<http://localhost/magix-tutorial/#!app/views/menus> 即可看到 menus
区块被独立展现。

访问 <http://localhost/magix-tutorial/> 将看到完整的效果