# jsonQuery
json数据查找+格式化

###1、children数据格式化
```
/**
 * 格式化方法[{id:,parentId:}, {id:,parentId:}] => [{id:,childern:[{}]}]
 * @Author   dingyang
 * @DateTime 2018-05-02
 * @param    {[type]}   config               [description]
 * @return   {[type]}                        [description]
 */
var formatChildrenResult = _$_.formatChildren({
	id: 'id',
	parentId: 'parentId',
	data: [{
        id: '11',
        parentId: '1',
        value: '北京'
	}, {
        id: '12',
        parentId: '1',
        value: '上海'
	}]
});
```

###2、数据插入
```
/**
 * 执行数据插入
 * @Author   dingyang
 * @DateTime 2018-05-17
 * @param    {[type]}   config               相关配置，见demo
 * @return   {[type]}                        [description]
 */
var insertBefore = _$_.insertBefore({
	key: 'a',
	value: 2,
    target: {
        key: 'test',
        value: 'sss'
    },
	data: [1,3,{a:2},{a:2}]
});
var insertAfter = _$_.insertAfter({
    key: 'a',
    value: 2,
    target: {
        key: 'test',
        value: 'sss'
    },
    data: [1,3,{a:2},{a:2}]
});
``` 
###3、查询节点
```
/**
 * 从json|array数据中查找符合条件[nodeId===nodeValue]的节点
 * @Author   dingyang
 * @DateTime 2018-04-24
 * @param[必选]    {json}            config            查找配置项
 * @param[必选]    {string|number}   key               需要查找的数据的key
 * @param[可选]    {void}            value             查找key对应查找的value值
 * @param[必选]    {object}          data              查找数据源，可以是json,也可以是array
 * @return        {[type]}                        [description]
 */
var qryResults = _$_.queryNodes({
	key: 'a',
	value: 2,
    data: {
		a: 2,
		b: {a: 2}
	}
});
```
###4、查询父节点
```
/**
 * 根据jsonArray查找某一节点的父级关系
 * @Author   dingyang
 * @DateTime 2018-04-17
 * @param[必选]    {json}            config            查找配置项
 * @param[必选]    {string|number}   key               需要查找的数据的key
 * @param[可选]    {void}            value             查找key对应查找的value值
 * @param[必选]    {object}          data              查找数据源，可以是json,也可以是array
 * @return   {[type]}                        [description]
 */
var qryResults2 = _$_.queryParents({
	key: 'id',
	value: 3,
	data: 
	   [{
		    id: 1,
		    children: [{
		    	id: 2
		    }, {
		    	id: 3
		    }]
		}, {
	        id: 11,
	        children: [{
	    	    id: 22
	        }, {
	    	    id: 33,
	    	    children: [{
	    		    id: 66
	    	    }]
	        }]
	    }]
});
```
###5、查询兄弟节点
```
/**
 * 兄弟元素查找
 * @Author   dingyang
 * @DateTime 2018-05-17
 * @param    {[type]}   config               [description]
 * @return   {[type]}                        [description]
 */
var qrySiblings = _$_.querySiblings({
	key: 'id',
	value: 2,
	data: 
	   [{
		    id: 1,
		    children: [{
		    	id: 2
		    }, {
		    	id: 3,
		    	name: 'test'
		    }, {
		    	id: 4,
		    	name: 'test2'
		    }]
		}, {
	        id: 11,
	        children: [{
	    	    id: 2,
	    	    name: 'sss'
	        }, {
	    	    id: 33,
	    	    children: [{
	    		    id: 66
	    	    }]
	        }]
	    }]
});
```