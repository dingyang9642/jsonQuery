# jsonQuery.js

### 版本更新记录
1.0.6 说明文档修改

### 使用说明
commonJs使用：import _$_ from 'jsonqueryjs/json'
amd/cmd使用： define(['jsonqueryjs/json'], function(_$_) {} );
script引用：<script src='node_modules/jsonqueryjs/json.js'></script>

### 对象数据查询相关方法
<ul>
    <li><a href="#data-query-nodes" target="_self">queryNodes：节点查询</a></li>
    <li><a href="#data-query-parents" target="_self">queryParents：父节点查询</a></li>
    <li><a href="#data-query-siblings" target="_self">querySiblings：兄弟节点查询</a></li>
</ul>

### 对象数据操作相关方法
<ul>
    <li><a href="#data-format-insert" target="_self">insertBefore|insertAfter：节点插入</a></li>
    <li><a href="#data-format-delete" target="_self">delete：节点删除</a></li>
    <li><a href="#data-format-siblings" target="_self">deleteSiblings：相关兄弟节点删除</a></li>
    <li><a href="#data-format-replace" target="_self">replace：节点替换</a></li>
    <li><a href="#data-format-format" target="_self">formatChildren：数据格式化-父子关系</a></li>
</ul>

### 其他工具方法
<ul>
    <li><a href="#data-tool-json" target="_self">isJson：json对象判断</a></li>
    <li><a href="#data-tool-array" target="_self">isArray：array对象判断</a></li>
    <li><a href="#data-tool-length" target="_self">getJsonArrLength：获取对象长度</a></li>
    <li><a href="#data-tool-copy" target="_self">deepCopy：对象深度拷贝</a></li>
    <li><a href="#data-tool-compare" target="_self">compare：两组数据比较，对象不进行地址比较</a></li>
    <li><a href="#data-tool-contain" target="_self">isContain：判断对象中是否包含指定元素</a></li>
    <li><a href="#data-tool-log" target="_self">logInfo：日志信息控制台输出</a></li>
</ul>




## 对象数据查询相关方法

<a name="data-query-nodes"></a>
### \_$\_.queryNodes(config)
```
/**
 * 从对象数据中查找符合条件的节点对象集合
 * @Author   dingyang
 * @example 示例
 * var result = queryNodes({data: [1,2,{a:2}], key: null, value: 2}); 此处有两处符合条件，返回[[1,2],{a:2}]
 * var result = queryNodes({data: [1,2,2], key: null, value: 2});     此处有两处符合条件，返回[[1,2,2],[1,2,2]]
 * var result = queryNodes({data: [1,2,{a:2}], key: 1, value: 2});    只有一处符合条件，返回[[1,2,{a:2}]]
 * var result = queryNodes({data: {a:2,b:3}, key: null, value: 2});   返回[{a:2,b:3}]
 * var result = queryNodes({data: {a:2,b:3}, key: 'a', value: 2});    返回[{a:2,b:3}]
 * @DateTime 2018-04-24
 * @param    {Object}                         config         配置项
 * @param    {string}                         config.data    配置项-数据源                          
 * @param    {(number|string|null|undefined)} config.key     配置项-key
 * @param    {void}                           config.value   配置项-value
 * @return   {array}                          符合条件的节点对象集合
 */
```
<a name="data-query-parents"></a>
### \_$\_.queryParents(config)
```
/**
 * 查找父节点对象集合（注：查找到则中止后续查找）
 * @Author   dingyang
 * @example 示例
 * var result = queryParents({data: [1,2,{a:2}], key: null, value: 2}); 数组中第二个2符合条件，直接返回[[1,2,{a:2}], 2]
 * var result = queryParents({data: [1,2,{a:3}], key: 'a', value: 3});  返回[[1,2,{a:3}], {a:3}]
 * var result = queryParents({data: {id:1,children:[{id:5}]}, key: 'id', value: 5}); 返回[{id:1,children:[{id:5}]}, [{id:5}], {id:5}]]
 * @DateTime 2018-04-24
 * @param    {Object}                         config         配置项
 * @param    {string}                         config.data    配置项-数据源                          
 * @param    {(number|string|null|undefined)} config.key     配置项-key
 * @param    {void}                           config.value   配置项-value
 * @return   {array}                          符合条件的节点对象集合
 */
```
<a name="data-query-siblings"></a>
### \_$\_.querySiblings(config)  |  _$_.querySiblings2(config)
```
/**
 * 查找兄弟节点对象集合
 * @Author   dingyang
 * @example 严格模式【严格同一级匹配】
 * var result = querySiblings({data: [1,2,{a:2}], key: null, value: 2}); 
 * 解释：数组中第2项符合查找条件，则其兄弟节点为[1,{a:2}]; 对象{a:2}也是符合查找条件，则其兄弟节点为空[](因为对象只有a:2这一项)；综合上述，返回[[1,{a:2}], []]
 * @example 包含模式【对象包含查找条件模式】
 * var result = querySiblings2({data: [1,2,{a:2}], key: null, value: 2}); 
 * 解释：数组中第2项符合查找条件，因为此时是兼容模式，则应查找其父节点对象的兄弟节点，因为其父对象为根节点，此处暂时做不操作处理（注意：）；另外，对象{a:2}也符合条件，则对应兄弟节点为[1,2];综合以上，返回[[1,2]]
 * @DateTime 2018-04-24
 * @param    {Object}                         config         配置项
 * @param    {string}                         config.data    配置项-数据源                          
 * @param    {(number|string|null|undefined)} config.key     配置项-key
 * @param    {void}                           config.value   配置项-value
 * @param    {string}                         modeType       配置模式（提供两种模式'strict'|'contain'）
 * @return   {array}                          符合条件的节点对象集合
 */
```


## 对象数据操作相关方法

<a name="data-format-insert"></a>
### \_$\_.insertBefore(config)  |  \_$\_.insertBefore2(config) | \_$\_.insertAfter(config)  |  \_$\_.insertAfter2(config)
```
/**
 * 执行目标对象的前置插入或者后置插入
 * @Author   dingyang
 * @example 严格模式【严格同一级匹配】
 * var result = insertBefore({data: [1,2,{a:2}], key: null, value: 2, target: {key: 'b', value: '3'}}); 
 * 解释：数组中第2项符合查找条件，则在其前面插入节点"3"（注：此时数组时，会忽略target中的key值），对象{a:2}也同样符合条件，此在其父对象添加target目标元素，结果为{b:3,a:2};综合以上，则返回[1,'3',2,{b:'3',a:2}]
 * @example 包含模式【对象包含查找条件模式】
 * var result = insertBefore2({data: [1,2,{a:2}], key: null, value: 2, target: {key: 'b', value: '3'}}); 
 * 解释：数组中第2项符合查找条件，因为此时是兼容模式，则应查找其父节点对象的兄弟节点，因为其父对象为根节点，此处暂时做不操作处理（注意：）；另外，对象{a:2}也符合条件，则在其前面插入“2”;综合以上，返回[1,2,‘3’,{a:2}]]
 * @DateTime 2018-04-24
 * @param    {Object}                         config         配置项
 * @param    {string}                         config.data    配置项-数据源                          
 * @param    {(number|string|null|undefined)} config.key     配置项-key
 * @param    {void}                           config.value   配置项-value
 * @param    {object}                         config.target  配置项-target
 * @param    {(number|string|null|undefined)} target.key     配置项target-key
 * @param    {void}                           target.value   配置项target-value
 * @param    {string}                         modeType       配置模式（提供两种模式'strict'|'contain'）
 * @return   {object}                         返回新的对象集合
 */
```

<a name="data-format-delete"></a>
### \_$\_.delete(config)  |  \_$\_.delete2(config)
```
/**
 * 节点对象删除
 * @Author   dingyang
 * @example 严格模式【严格同一级匹配】
 * var result = delete({data: [1,{a:2},[2]], key: null, value: 2});  返回 [1,{},[]]
 * @example 包含模式【对象包含查找条件模式】
 * var result = delete({data: [1,{a:2},[2]], key: null, value: 2}); 返回 [1]
 * 解释：数组中第2项{a;2},第3项[2]符合查找条件，因为此时是兼容模式,所以返回[1]
 * @DateTime 2018-04-24
 * @param    {Object}                         config         配置项
 * @param    {string}                         config.data    配置项-数据源                          
 * @param    {(number|string|null|undefined)} config.key     配置项-key
 * @param    {void}                           config.value   配置项-value
 * @param    {string}                         modeType       配置模式（提供两种模式'strict'|'contain'）
 * @return   {object}                         返回新的对象集合
 */
```

<a name="data-format-siblings"></a>
### \_$\_.deleteAllSiblings(config) | \_$\_.deleteAllSiblings2(config) | \_$\_.deleteBeforeSiblings(config) | \_$\_.deleteBeforeSiblings2(config) | \_$\_.deleteAfterSiblings(config) | \_$\_.deleteAfterSiblings2(config)
```
/**
 * 删除兄弟节点
 * @Author   dingyang
 * @example 严格模式【严格同一级匹配】
 * var result = deleteAllSiblings({data: [1,2,3], key: null, value: 2});  返回 [2]
 * var result = deleteBeforeSiblings({data: [1,2,3], key: null, value: 2});  返回 [2,3]
 * var result = deleteAfterSiblings({data: [1,2,3], key: null, value: 2});  返回 [1,2]
 * 包含模式【对象包含查找条件模式】同之前匹配模式
 * @DateTime 2018-04-24
 * @param    {Object}                         config         配置项
 * @param    {string}                         config.data    配置项-数据源                          
 * @param    {(number|string|null|undefined)} config.key     配置项-key
 * @param    {void}                           config.value   配置项-value
 * @param    {string}                         modeType       配置模式（提供两种模式'strict'|'contain'）
 * @param    {string}                         rule           删除规则（提供三种模式'before'|'after'|'all'）
 * @return   {object}                         返回新的对象集合
 */
```

<a name="data-format-replace"></a>
### \_$\_.replace(config) | \_$\_.replace2(config)
```
/**
 * 指定位置节点替换
 * @Author   dingyang
 * @example 严格模式【严格同一级匹配】
 * var result = replace({data: [1,{a:2}], key: null, value: 2, target: {key: 'b', value: '3'}}); 
 * 解释：数组中{a:2}符合条件，所以返回[1,{b:3}]
 * @example 包含模式【对象包含查找条件模式】
 * var result = replace2({data: [1,{a:2}], key: null, value: 2, target: {key: 'b', value: '3'}}); 
 * 解释：包含模式下返回[1,3] 此时因为是在数组中执行replace,所以会忽略target中的key
 * @DateTime 2018-04-24
 * @param    {Object}                         config         配置项
 * @param    {string}                         config.data    配置项-数据源                          
 * @param    {(number|string|null|undefined)} config.key     配置项-key
 * @param    {void}                           config.value   配置项-value
 * @param    {object}                         config.target  配置项-target
 * @param    {(number|string|null|undefined)} target.key     配置项target-key
 * @param    {void}                           target.value   配置项target-value
 * @param    {string}                         modeType       配置模式（提供两种模式'strict'|'contain'）
 * @return   {object}                         返回新的对象集合
 */
```

<a name="data-format-format"></a>
### \_$\_.formatChildren(config)
```
/**
 * 格式化方法[{id:,parentId:}, {id:,parentId:}] => [{id:,childern:[{}]}]
 * @Author   dingyang
 * @example 示例
 * var result = formatChildren({data: [{id:1,parentId:null}, {id:2,parentId:1}], parentId: 'parentId', id: 'id'});
 * 返回数据为[{id:1,parentId:null,children:[{id:2,parentId:1,children:[]}]}]
 * @DateTime 2018-04-24
 * @param    {Object}                           config          配置项
 * @param    {string}                           config.data     配置项-数据源                          
 * @param    {(number|string)}                  config.parentId 配置项-key
 * @param    {(number|string)}                  config.id       配置项-value
 * @return   {object}                           格式化之后的数据格式
 */
```



## 基本工具方法

<a name="data-tool-json"></a>
### \_$\_.toolUtil.isJson(data)
```
/**
 * 判断数据类型是否为json数据类型
 * @Author   dingyang
 * @DateTime 2018-04-16
 * @param    {void}   data                   数据源
 * @return   {boolean}                       如果是json,返回true,否则返回false
 */
```

<a name="data-tool-array"></a>
### \_$\_.toolUtil.isArray(data)
```
/**
 * 判断数据类型是否为array数据类型
 * @Author   dingyang
 * @DateTime 2018-04-16
 * @param    {void}   data                 数据源
 * @return   {boolean}                     如果是array,返回true,否则返回false
 */
```

<a name="data-tool-length"></a>
### \_$\_.toolUtil.getJsonArrLength(data)
```
/**
 * 返回array||json键长度（个数）
 * @Author   dingyang
 * @DateTime 2018-05-21
 * @param    {object}   data               数据源
 * @return   {number}                      长度
 */
```

<a name="data-tool-copy"></a>
### \_$\_.toolUtil.deepCopy(obj)
```
/**
 * 对象深度拷贝【原始数据不产生变化】
 * @Author   dingyang
 * @DateTime 2018-05-21
 * @param    {object}   obj                  数据目标拷贝对象arrary||json
 * @return   {object}                        拷贝后数据
 */
```

<a name="data-tool-compare"></a>
### \_$\_.toolUtil.compare(data1, data2)
```
/**
 * 数据比较是否相等【此处不进行引用类型地址比较】
 * @Author   dingyang
 * @DateTime 2018-04-24
 * @param    {object}   data1                数据源之一
 * @param    {object}   data2                数据源之一
 * @return   {boolean}                       如果相等，返回true,否则返回false
 */
```

<a name="data-tool-contain"></a>
### \_$\_.toolUtil.isContain(config)
```
/**
 * 判断指定key或者value是否位于对象中]
 * @Author   dingyang
 * @example 几种条件的示例设置
 * var result = isContain({data: [1,2], key: null, value: 2});     如果data数据源是数组，则key代表下标（int类型）返回true
 * var result = isContain({data: [1,2], key: 1, value: 2});        返回true
 * var result = isContain({data: [1,2], key: 0, value: 2});        返回false
 * var result = isContain({data: {a:1, b:2}, key: b, value: 2});   如果data数据源是json，则key代表键值（string类型）返回false
 * var result = isContain({data: {a:1, b:2}, key: null, value: 2});返回true
 * @DateTime 2018-05-17
 * @param    {Object}                         config         配置项
 * @param    {string}                         config.data    配置项-数据源                          
 * @param    {(number|string|null|undefined)} config.key     配置项-key
 * @param    {void}                           config.value   配置项-value
 * @return   {boolean}                                       如果命中条件，返回true，否则返回false
 */
```

<a name="data-tool-log"></a>
### \_$\_.toolUtil_.logInfo(type, info)
```
/**
 * 打印日志信息
 * @Author   dingyang
 * @DateTime 2018-04-16
 * @param    {string}   type                 error warn log三种日志信息类型
 * @param    {string}   info                 日志信息
 * @return   {void}                          无
 */
```


