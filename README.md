![Step 0](http://thx.github.io/magix/assets/img/step-0.png)

## 准备工作

我们的教程需要放到web server中进行访问，web server请自行准备

本教程在笔者的电脑上访问地址为 http://localhost/magix-tutorial/ 。请注意后续如果提到该网址，请替换为您电脑上的地址

## 初始状态

### 单页

Web App 通常也叫做 Single Page Application，即单页应用，我们还管它叫 One Page One
Application，一个页面一个应用。所以，我们先要把这一个入口页面给创建好：

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Step 0 - Magix BP</title>
  <link rel="stylesheet" type="text/css" href="http://g.tbcdn.cn/thx/cube/1.0.7/cube-min.css">
</head>
<body>
  <script src="http://g.tbcdn.cn/kissy/k/1.4.0/seed-min.js"></script>
  <script src="http://g.tbcdn.cn/thx/magix/1.1/kissy-magix-min.js"></script>
  <script>
  KISSY.config({
      packages: [
          {
              name: 'app',
              path: './src/',//开发阶段我们把放有源码放在src目录中，方便后面的打包上线
              debug: true
          }
      ]
  })
  KISSY.use('magix/magix', function(S, Magix) {
      Magix.start({
          iniFile: 'app/ini',
          execError: function(e) {
            throw e
          }
      })
  })
  </script>
</body>
</html>
```

在项目目录创建 index.html，输入以上内容即可。在上述代码中，我们引入了如下内容：

- 基础样式 [Cube](http://thx.github.io/cube)
- [KISSY 1.4.0 Seed](http://docs.kissyui.com)
- 基于 KISSY 的 [Magix 1.1](http://thx.github.io/magix-api/)

引入后，我们配置了当前项目的包名称与路径：

```js
KISSY.config({
    packages: [
        {
            name: 'app',
            path: './src/',
            debug: true
        }
    ]
})
```

然后，我们告诉 Magix，可以启动了：

```js
KISSY.use('magix/magix', function(S, Magix) {
    Magix.start({
        iniFile: 'app/ini',
        execError: function(e) {
            throw e
        }
    })
})
```

**注意**

为了防止某个视图出错导致整个应用挂掉，压缩版的 magix 会吞掉异常，在线上通过如下方式收集错误：

```js
new Image().src = 'http://track/?msg=' + e.message;
```

我们只是初阶教程，直接把异常抛出来方便调试即可。当然，我们也可以引入未压缩版的 Magix，甚至
直接引入未打包、压缩的 Magix 源码，我们将另作讨论。

### app/ini 配置模块

Magix在启动时会根据是否配置了 iniFile 选项进行决定是否载入 app/ini 模块，进而读取配置信息。配置信息中最重要的信息是路由规则。

**注意**

iniFile是可选项，项目简单时，直接把所有的配置信息放在Magix.start中即可。

该示例中配置了app/ini文件，所以我们需要在项目中建立该文件：

```js
KISSY.add('app/ini', function(S) {
    return {
        defaultView: 'app/views/default',
        routes: function(pathname) {
            return this.defaultView;
        }
    };
});
```

Magix 基于树状层次化的结构构建 View，每个逻辑页面都有且只有一个根 View。所以在 app/ini
模块中，仅需配置每个 pathname 和其根视图之间的对应关系。(讨论1，VOM Vframe View)

根视图往往决定页面的基础布局，多数 app 的基础布局很少改变（如：头、尾、侧边、主区域模式），
所以多数情况下 pathname 对应着相同的视图。

* 本例中，routes 方法定义了任意 pathname，都采用 defaultView
* defaultView 的值是一个视图的模块名，本例中是 `app/views/default`

### 建立 defaultView

在 Magix中，采用模板系统辅助 View 的构建。默认情况下每个视图包含两个同名的 .js 和
.html 文件，前者为视图的模块文件，而后者为模板文件。

app/views/default.js :

```js
KISSY.add("app/views/default", function(S, View) {
  return View.extend({
    render : function() {
      this.setViewHTML(this.template);
    }
  });
}, {
  requires : ['magix/view']
});
```

app/views/default.html :

```html
<h2>Hello Magix!</h2>
```

* 所有视图都需继承 magix/view
* 重写 render 方法，调用 setViewHTML 方法，将模板内容 `this.template` 写入 View
  的容器。关于 View 的生命周期，(讨论2，Viw填空开发，生命周期)

至此，在浏览器的地址中输入  http://localhost/magix-tutorial/ 即可看到本教程开始时的效果