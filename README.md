# Magix BP Tutorial

## 概览

本应用通过构建 BP 管理后台，带着开发者领略使用 Magix 构建 Web 应用的过程。

## 要求

### Git

比较方便的 Git 学习资料：

- [gitref](http://gitref.org/zh)

### Node.js

人人都爱 Node.js

### 本地 Web 服务

本应用是伪 Web 应用，XHR 请求的都是本地的静态文件，因此要把本应用跑起来，只需要起一个静态
HTTP 服务即可。可以直接将本仓库克隆到你的 Apache、nginx Web Root，也可以使用类似
[anywhere](https://github.com/JacksonTian/anywhere) 这样的小工具：

```bash
$ npm install -g anywhere
$ cd /path/to/magix-bp
$ anywhere
```

还可以换个端口：

```bash
$ anywhere 9527
```

如果你用的是 Mac，或者说如果你的电脑上有 Ruby，还可以将此命令丢到 .bashrc 或者 .zshrc：

```bash
function serve {
  port="${1:-3000}"
  ruby -r webrick -e "s = WEBrick::HTTPServer.new(:Port => $port, :DocumentRoot => Dir.pwd); trap('INT') { s.shutdown }; s.start"
}
```

然后就可以这么用了：

```bash
$ serve
$ serve 9527
```

## Commits

你可以使用 `git checkout step-?` 命令跳到任意步骤。

### Step 0

初始状态，即 [magix-seed](https://github.com/thx/magix-seed)

