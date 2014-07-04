## 打包上线

### 为什么要打包

为了开发方便，我们在开发时使用模板与代码分离的方式，即我们的每个view都有一个view.js和view.html，开发时Magix内部使用xhr获取对应的模板

然而最终我们的js是需要发布到cdn上的，比如我们的应用域名是：<http://zs.taobao.com>，而我们的js是放在<http://g.alicdn.cn/mm/zs/xxx.js>上，这时候如果使用xhr在zs.taobao.com域名下去获取g.alicdn.cn域名下的资源，是跨域的，处理麻烦。再一个一但开发完成，每个view与它对应的html就是固定的，没必要分开存放，然后再动态获取。既然加载js就肯定会加载html，所以合并是最好的选择

### 如何打包

我们使用grunt来做打包工具

首先你要安装nodejs grunt等，略过

在项目中建立package.json

```json
{
    "name": "magix-tutorial",
    "version": "0.1.0",
    "devDependencies": {
        "grunt": "~0.4.1",
        "magix-app-build": ""
    }
}
```

建立Gruntfile.js

```js
module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        magix: {
            build: {
                //magix view 所在的入口文件夹路径
                src: './src/',
                //处理后文件夹的路径
                dest: './build/'
            },
            options: {
                //压缩级别
                compress: 'normal',
                //中文转化unicode
                c2u: false,
                //view对应模板字段的key
                tmplKey: 'template'
            }
        }
    });
    grunt.loadNpmTasks('magix-app-build');
    grunt.registerTask('default', ['magix']);
};
```
第一次先运行 npm install 命令

然后运行grunt命令即可

成功后会在根目录与src平级的地方出现一个build文件夹，此时如果要跑压缩后的文件，只需要修改index.html中app的包配置即可

```diff
KISSY.config({
      packages: [
          {
              name: 'app',
-             path: './src/',
+             path:'./build',
-             debug: true,
+             debug: false
          }
      ]
  })
```

至此就完成了打包，然后发布即可