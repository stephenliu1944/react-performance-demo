# react-performance-demo
本项目用于测试React在上千元素下的页面渲染性能, 且服务端通过websocket持续增加渲染数据.

## 项目依赖
react: v15.4.2  
react-dom: v15.4.2  
socket.io: v2.1.1  
socket.io-client: v2.1.1  
uuid: v3.3.2  
core-js: v2.5.7
babel: v6.x.x
webpack: v2.x.x

## 优化方案
1. shouldComponentUpdate
2. key
3. PureComponent
4. Stateless functional component
5. 函数节流
6. 增加数据或滚动滚动条时, 检查行元素是否在可视区域内, 如果不在将其隐藏, 以此减轻浏览器负担.  

## 测试结果
在Chrome和IE9下都可流程运行.

## 改进方案
1. 使用不可变数据 immutable.js.
2. 进一步减少渲染的节点数目.
...

## 安装教程
下载项目后在根目录执行
```  
npm install
```

## 使用说明
进入bin目录, window下执行test.bat, linux下执行test.sh.  
浏览器输入: http://localhost:8080  
devServer服务端口默认为8080.  
webSocket服务端口默认为3000.  
如遇端口冲突, 可以在package.json中配置:  
```
"devServer": {
  "port": 8080
},
"webSocket": {
  "port": 3000
}
```

## Perf测试
在浏览器控制台输入如下代码, 即可查看整体性能(index.jsx中已经执行Perf.start()).
```
Perf.stop();
Perf.printWasted(Perf.getLastMeasurements());
Perf.start();
```