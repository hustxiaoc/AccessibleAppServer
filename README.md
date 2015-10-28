## 本地开发调试

执行下列代码来迁出项目：
  
```
$ git clone git@github.com:hustxiaoc/AccessibleAppServer.git
$ cd AccessibleAppServer

```

下载依赖包：

```
$ npm install
```

创建环境变量配置文件env.json
```
{
    "LC_APP_ID":"<your LC_APP_ID>",
    "LC_APP_KEY":"<your LC_APP_KEY>",
    "LC_APP_MASTER_KEY":"<your LC_APP_MASTER_KEY>"
}
```

启动项目：

```
gulp start
```


恭喜你，启动成功！使用 [http://localhost:3000/](http://localhost:3000/) 体验项目。

## 部署到 LeanEngine

首先确认已经安装 [命令行工具](https://leancloud.cn/docs/cloud_code_commandline.html)。

部署到测试环境：

```
$ avoscloud deploy
```

部署到生产环境：

```
$ avoscloud publish
```

