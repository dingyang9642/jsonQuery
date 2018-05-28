var qryResults = _$_.queryNodes({
	key: 'a',
	value: 2,
	rule: '"a"=2',
    data: {
		a: '1',
		b: [{
			a: 2,
			b: {
				b:'2', 
				c: '3'
			},
			c: '2'
		}],
		c: {
			a: '1',
			b: '2',
			d: {
				a: '1'
			},
			e: [{a: 2}]
		}
	}
});
console.log('queryNodes查找结果：', qryResults);

var qryResults2 = _$_.queryParents({data: {id:1,children:[{id:5}]}, key: 'id', value: 5});
console.log('queryParents查找结果：', qryResults2);

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
	},{
        id: '111',
        parentId: '11',
        value: '海淀区'
	}, {
        id: '1',
        parentId: null,
        value: '中国'
	}, 
	{
        id: '21',
        parentId: '2',
        value: '纽约'
	}, {
        id: '22',
        parentId: '2',
        value: '休斯顿'
	},{
        id: '211',
        parentId: '21',
        value: '布鲁克林'
	}, {
        id: '2',
        parentId: null,
        value: '美国'
	}]
});
console.log('formatChildren结果：', formatChildrenResult);

var qrySiblings = _$_.querySiblings2({
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
console.log('qrySiblings查找结果：', qrySiblings);


var insertBefore = _$_.insertBefore2({data: [1,2,{a:2}], key: null, value: 2, target: {key: 'b', value: '3'}});
console.log('insertBefore结果：', insertBefore);

var insertAfter = _$_.insertAfter2({
	key: 'a',
	value: 2,
    target: {
        key: 'test',
        value: 'sss'
    },
	data: [{a:2}]
});
console.log('insertAfter结果：', insertAfter);

var deleteNodes = _$_.delete2({
    key: null,
    value: 2,
    data: [1, 3, 3, {a:4, b:{c:2}}, {a:2}]
});
console.log('deleteNodes结果：', deleteNodes);

var deleteAfterSiblings = _$_.deleteAfterSiblings({
    key: null,
    value: 3,
    data: [1, 2, {a:3, b:4, c:5}, 0, 3, {a:4, b:{c:2}}, {a:2}]
});
console.log('deleteAfterSiblings结果：', deleteAfterSiblings);

var deleteBeforeSiblings = _$_.deleteBeforeSiblings({
    key: null,
    value: 3,
    data: [1, 2, {a:3, b:4, c:5}, 0, 3, {a:4, b:{c:2}}, {a:2}]
});
console.log('deleteBeforeSiblings结果：', deleteBeforeSiblings);
var deleteAllSiblings = _$_.deleteAllSiblings({
    key: null,
    value: 4,
    data: [1, 2, {a:3, b:4, c:5}, 0, 1, {a:4, b:{c:2}}, {a:2}]
});
console.log('deleteAllSiblings结果：', deleteAllSiblings);

var replace = _$_.replace2({
    key: 'a',
    value: 4,
    target: {
    	key: null,
    	value: {s:4}
    },
    data: [1, 2, {a:3, b:4, c:5}, 0, 1, {a:4, b:{a:4}}, {a:2}]
});
console.log('replace结果：', replace);

