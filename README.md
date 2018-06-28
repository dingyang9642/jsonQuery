# jsonQuery.js

### 版本更新记录
2.0.0  整体设计模式进行更改<br>
2.0.1  添加formatIndex方法，为数组添加广度／深度索引值<br>
2.0.2  closest方法返回值类型更改 arr->object 

### 使用说明
commonJs使用：import jsonQuery from 'jsonqueryjs/jsonQuery'<br>
amd/cmd使用： define(['jsonqueryjs/jsonQuery'], function(jsonQuery) {} );<br>
script引用：\<script src='node_modules/jsonqueryjs/jsonQuery.js'\>\<\/script\>

### 数据初始化（后续操作前提）
<ul>
    <li><a href="#data-explain" target="_self">基本概念描述</a></li>
    <li><a href="#data-bind" target="_self">jsonQuery：数据源绑定</a></li>
    <li><a href="#data-target" target="_self">target：目标源设定</a></li>
</ul>


### 对象数据查询相关方法
<ul>
    <li><a href="#data-query-find" target="_self">find：节点查询</a></li>
    <li><a href="#data-query-parents" target="_self">parents：父节点查询</a></li>
    <li><a href="#data-query-closest" target="_self">closest：查找最近的复合指定条件的祖先元素</a></li>
    <li><a href="#data-query-siblings" target="_self">siblings：兄弟节点查询</a></li>
</ul>

### 对象数据操作相关方法
<ul>
    <li><a href="#data-format-insert" target="_self">insert：节点插入</a></li>
    <li><a href="#data-format-delete" target="_self">delete：节点删除</a></li>
    <li><a href="#data-format-siblings" target="_self">deleteSiblings：相关兄弟节点删除</a></li>
    <li><a href="#data-format-replace" target="_self">replace：节点替换</a></li>
</ul>

### 其他工具方法
<ul>
    <li><a href="#data-tool-json" target="_self">isJson：json对象判断</a></li>
    <li><a href="#data-tool-array" target="_self">isArray：array对象判断</a></li>
    <li><a href="#data-tool-isinarray" target="_self">isInArray：判断是否位于数组中</a></li>
    <li><a href="#data-tool-length" target="_self">getJsonArrLength：获取对象长度</a></li>
    <li><a href="#data-tool-copy" target="_self">deepCopy：对象深度拷贝</a></li>
    <li><a href="#data-tool-formatindex" target="_self">formatIndex：为数组添加广度／深度索引值</a></li>
    <li><a href="#data-tool-compare" target="_self">compare：两组数据比较，对象不进行地址比较</a></li>
    <li><a href="#data-tool-log" target="_self">logInfo：日志信息控制台输出</a></li>
</ul>

## 基本概念描述
<a name="data-explain"></a>
```
rule(规则)，此处规则分为3类
规则一："'a'='1'"
       "'a'='1'" = (key="a" & value="1")  a和1都被标记为字符串，此时解释为查询规则为

规则二："'a'=1" ／ "0=1"
       "'a'=1" = (key='a' & value=1)
       "0=1"   = (key=0 & value=1) 此时说明是针对数组下标为0值为1的查询条件   

规则三："=1" ／ "'a'="
       "=1" = (key= & value=1) 此时会忽略key值判断，不论是数组还是json对象，只要value=1都被认定为符合条件


modeType(匹配模式)，此处分为2类

模式一：'contain'（常用）
      包含模式 如数据{"a":3}，如果rule='"a"=3'，则认为查找的对象为{"a":3}，通过后续api,你会更好的理解
模式二：'strict'
      严格匹配模式

```

## 数据初始化

<a name="data-bind"></a>
### jsonQuery(data)
```
描述：数据源绑定
实例：
     var data = {a: 1, b: {a: 10, b: 11, c: 12, d: 13}};
     var jsonInstance = jsonQuery(data);
```

<a name="data-target"></a>
### target(rule)
```
描述：目标源设定
实例：
     var data = {a: 1, b: {a: 10, b: 11, c: 12, d: 13}};
     var jsonInstance = jsonQuery(data).target('"c"=12');
```


## 对象数据查询相关方法

<a name="data-query-find"></a>
### find()
```
描述：节点查询
实例：
     var data = {a: 1, b: {a: 10, b: 11, c: 12, d: 13}};
     var result = jsonQuery(data).target('"c"=12').find().val();
     console.log(result) => 结果：{a: 10, b: 11, c: 12, d: 13}
```

<a name="data-query-parents"></a>
### parents()
```
描述：父节点查询
实例：
     var data = {a: 1, b: {a: 10, b: 11, c: 12, d: 13}};
     var result = jsonQuery(data).target('"c"=12').parents().val();
     console.log(result) => 结果：[{a: 1, b: {a: 10, b: 11, c: 12, d: 13}, {a: 10, b: 11, c: 12, d: 13}]
```

<a name="data-query-closest"></a>
### closest(options)
```
描述：查找最近的复合指定条件的祖先元素
参数：options = {key: 'testKey', value: 'testValue'} > 即为查找祖先元素中存在条件（a:1） 的父元素
实例：
     var data = {a: 1, b: {a: 10, b: 11, c: 12, d: 13}};
     ---实例一---
     var result = jsonQuery(data).target('"c"=12').closest({key: 'a', value: 1}).val();
     console.log(result) => 结果：{a: 1, b: {a: 10, b: 11, c: 12, d: 13}}
     ---实例二---
     var result = jsonQuery(data).target('"c"=12').closest({key: 'a', value: 10}).val();
     console.log(result) => 结果：{a: 10, b: 11, c: 12, d: 13}
```

<a name="data-query-siblings"></a>
### siblings([modeType], [queryType])
```
描述：兄弟节点查询
参数：modeType 'strict' | 'contain' 两种查找匹配模式选择
     queryType 'all' | 'before' | 'after' | 'beforeAll' | 'afterAll' 兄弟节点查找的类型
实例：
     var data = {a: 1, b: {a: 10, b: 11, c: 12, d: 13}};
     ---实例一---
     var result = jsonQuery(data).target('"c"=12').siblings('strict', 'all').val();
     console.log(result) => 结果：[10, 11, 13]
     ---实例二---
     var result = jsonQuery(data).target('"c"=12').siblings('strict', 'before').val();
     console.log(result) => 结果：[11]
     ---实例三---
     var result = jsonQuery(data).target('"c"=12').siblings('strict', 'beforeAll').val();
     console.log(result) => 结果：[10, 11]
     ---实例四---
     var result = jsonQuery(data).target('"c"=12').siblings('contain', 'all').val();
     console.log(result) => 结果：[1]
```



## 对象数据操作相关方法

<a name="data-format-insert"></a>
### insert(options, [modeType], [insertType])
```
描述：节点插入
参数：options = {key: 'testKey', value: 'testValue'} > 即插入的目标数据
     modeType 'strict' | 'contain' 两种查找匹配模式选择
     insertType 'before' | 'after' 插入的节点位置
实例：
     var data = {a: 1, b: {a: 10, b: 11, c: 12, d: 13}};
     ---实例一---
     var result = jsonQuery(data).target('"c"=12').insert({key: 'testKey', value: 'testValue'}, 'strict', 'before').val();
     console.log(result) => 结果：{a: 1, b: {a: 10, b: 11, testKey: 'testValue', c: 12, d: 13}}
     ---实例二---
     var result = jsonQuery(data).target('"c"=12').insert({key: 'testKey', value: 'testValue'}, 'contain', 'before').val();
     console.log(result) => 结果：{a: 1, testKey: 'testValue', b: {a: 10, b: 11, c: 12, d: 13}}
```

<a name="data-format-delete"></a>
### delete([modeType])
```
描述：节点删除
参数：modeType 'strict' | 'contain' 两种查找匹配模式选择
实例：
     var data = {a: 1, b: {a: 10, b: 11, c: 12, d: 13}};
     ---实例一---
     var result = jsonQuery(data).target('"c"=12').delete('strict').val();
     console.log(result) => 结果：{a: 1, b: {a: 10, b: 11, d: 13}}
     ---实例二---
     var result = jsonQuery(data).target('"c"=12').delete('contain').val();
     console.log(result) => 结果：{a: 1}
```

<a name="data-format-siblings"></a>
### deleteSiblings([modeType], [deleteType])
```
描述：相关兄弟节点删除
参数：modeType 'strict' | 'contain' 两种查找匹配模式选择
     deleteType 'all' | 'beforeAll' | 'afterAll' 删除指定位置的兄弟节点
实例：
     var data = {a: 1, b: {a: 10, b: 11, c: 12, d: 13}};
     ---实例一---
     var result = jsonQuery(data).target('"c"=12').deleteSiblings('strict', 'beforeAll').val();
     console.log(result) => 结果：{a: 1, b: {c: 12, d: 13}}
     ---实例二---
     var result = jsonQuery(data).target('"c"=12').deleteSiblings('contain', 'beforeAll').val();
     console.log(result) => 结果：{b: {a: 10, b: 11, c: 12, d: 13}}
```

<a name="data-format-replace"></a>
### replace(options, [modeType])
```
描述：节点替换
参数：options = {key: 'testKey', value: 'testValue'} > 即插入的目标数据
     modeType 'strict' | 'contain' 两种查找匹配模式选择
实例：
     var data = {a: 1, b: {a: 10, b: 11, c: 12, d: 13}};
     ---实例一---
     var result = jsonQuery(data).target('"c"=12').replace({key: 'testKey', value: 'testValue'}, 'strict').val();
     console.log(result) => 结果：{a: 1, b: {a: 10, b: 11, testKey: 'testValue', d: 13}}
     ---实例二---
     var result = jsonQuery(data).target('"c"=12').replace({key: 'testKey', value: 'testValue'}, 'contain').val();
     console.log(result) => 结果：{a: 1, testKey: 'testValue'}
```


## 其他工具方法
<a name="data-tool-json"></a>
### isJson(data)
```
描述：json对象判断
实例：
    var result = jsonQuery.toolUtil.isJson({a: 1});
    console.log(result) => 结果：true
```

<a name="data-tool-array"></a>
### isArray(data)
```
描述：array对象判断
实例：
    var result = jsonQuery.toolUtil.isArray([1]);
    console.log(result) => 结果：true
```

<a name="data-tool-isinarray"></a>
### isInArray(arr, target)
```
描述：判断是否位于数组中
实例：
    var result = jsonQuery.toolUtil.isInArray([1], 1);
    console.log(result) => 结果：true  
```


<a name="data-tool-length"></a>
### getJsonArrLength(data)
```
描述：获取对象长度
实例：
    var result = jsonQuery.toolUtil.getJsonArrLength([1]);
    console.log(result) => 1  
```

<a name="data-tool-copy"></a>
### deepCopy(data)
```
描述：对象深度拷贝
实例：
    var result = jsonQuery.toolUtil.deepCopy([1, {a: 1}]);
    console.log(result) => 结果：[1, {a: 1}]  
```

<a name="data-tool-formatindex"></a>
### formatIndex(options, yIndex)
```
描述：为数组添加广度／深度索引值
参数：options = {data: [a:1], xKey: 'xKey', yKey: 'yKey' }
     options.data: 格式化数据
     options.xKey: 广度索引key值
     options.yKey: 深度索引key值
     yIndex: 深度起始索引，一般为0，固定为0
实例：
     var result = jsonQuery.toolUtil.formatIndex({data: [{a: 'a', childs: [{a: 'a'}]}]}, 0);
     console.log(result) => [{a: 'a', xIndex: 0, yIndex: 0, childs: [{a: 'a', xIndex: 0, yIndex: 1}]}]
    
```


<a name="data-tool-compare"></a>
### compare(data1, data2)
```
描述：两组数据比较，对象不进行地址比较
实例：
    var result = jsonQuery.toolUtil.compare([1, {a: 1}], [1, {a: 1}]);
    console.log(result) => 结果：true  
```

<a name="data-tool-log"></a>
### logInfo(type, info)
```
描述：日志信息控制台输出
实例：
    jsonQuery.toolUtil.logInfo('error', 'msg error');
```






