var data = {
	a: '1',
	b: [{
		a: 3,
		b: {
			b: '2', 
			c: '3'
		}
	}],
	c: {
		b: '2',
		a: {
			a: ['1','5']
		},
		e: [222, {a: 2}, '3', '5', {c:7}]
	}
};

// 查找当前节点+删除
// var findResults = jsonQuery(data).target('"b"="2"').find().val();

// 查找兄弟节点
// var findResults = jsonQuery(data).target('1="3"').siblings('strict', 'all').val();

// 查找父节点
// var findResults = jsonQuery(data).target('1="3"').parents().val();

// 查找指定标志父节点
// var findResults = jsonQuery(data).target('2="3"').closest({key: 3, value: '5'}).val();

// 元素替换
// var findResults = jsonQuery(data).target('1="3","c"="3"').replace({key: 'test', value: 'ignore'}, 'strict').val();

// 元素插入
// var findResults = jsonQuery(data).target('1="3","c"="3"').insert({key: 'test', value: 22222}, 'strict', 'before').val();

// 兄弟节点元素删除
var findResults = jsonQuery(data).target('2="3","c"="3"').deleteSiblings('strict', 'beforeAll').val();


console.log('findResults查找结果：', findResults);


console.log(jsonQuery.tool);


