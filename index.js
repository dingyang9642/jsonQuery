var qryResults = _$_.queryNodes({
	key: 'a',
	value: 2,
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
console.log('queryParents查找结果：', qryResults2);

var compareResult = _$_tool_.compare({a: 1, b: [{}]}, {a: 1, b: [{}]});
console.log('compare比对结果：', compareResult);

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
console.log('qrySiblings查找结果：', qrySiblings);


var insertBefore = _$_.insertBefore({
	key: 'a',
	value: 2,
    target: {
        key: 'test',
        value: 'sss'
    },
	data: [1,3,{a:2},{a:2}]
});
console.log('insertBefore结果：', insertBefore);

var insertAfter = _$_.insertAfter({
    key: 'a',
    value: 2,
    target: {
        key: 'test',
        value: 'sss'
    },
    data: [1,3,{a:2},{a:2}]
});
console.log('insertAfter结果：', insertAfter);


var testData = [
    {
        "processType":"MODEL",
        "modelCode":"huaihai_model",
        "ruleType":"",
        "ruleList":[
            {
                "processType":"RULE",
                "modelCode":"",
                "ruleType":"HIT",
                "toList":[
                    {
                        "condition":{
                            "input":"retCode",
                            "op":"UNEQUAL",
                            "value":"0",
                            "resCode":"REJECT"
                        },
                        "toType":"END",
                        "to":{
 
                        }
                    },
                    {
                        "condition":{
                            "input":"retCode",
                            "op":"EQUAL",
                            "value":"0",
                            "resCode":"CONTINUE"
                        },
                        "toType":"CONTINUE",
                        "to":{
 
                        }
                    }
                ]
            },
            {
                "processType":"RULE",
                "modelCode":"",
                "ruleType":"SCORE",
                "toList":[
                    {
                        "condition":{
                            "input":"blackScore",
                            "op":"BETWEEN",
                            "value":[
                                0,
                                49
                            ],
                            "resCode":"REJECT"
                        },
                        "toType":"END",
                        "to":{
 
                        }
                    },
                    {
                        "condition":{
                            "input":"blackScore",
                            "op":"BETWEEN",
                            "value":[
                                50,
                                79
                            ],
                            "resCode":"JUMPTO"
                        },
                        "toType":"JUMPTO",
                        "to":{
                            "processType":"MODEL",
                            "modelCode":"test_model",
                            "ruleType":"",
                            "ruleList":[
                                {
                                    "processType":"RULE",
                                    "modelCode":"",
                                    "ruleType":"HIT",
                                    "toList":[
                                        {
                                            "condition":{
                                                "input":"retCode",
                                                "op":"UNEQUAL",
                                                "value":[0],
                                                "resCode":"REJECT"
                                            },
                                            "toType":"END",
                                            "to":{
 
                                            }
                                        },
                                        {
                                            "condition":{
                                                "input":"retCode",
                                                "op":"EQUAL",
                                                "value":[0],
                                                "resCode":"CONTINUE"
                                            },
                                            "toType":"CONTINUE",
                                            "to":{
 
                                            }
                                        }
                                    ]
                                },
                                {
                                    "processType":"RULE",
                                    "modelCode":"",
                                    "ruleType":"SCORE",
                                    "toList":[
                                        {
                                            "condition":{
                                                "input":"blackScore",
                                                "op":"BETWEEN",
                                                "value":[
                                                    0,
                                                    49
                                                ],
                                                "resCode":"REJECT"
                                            },
                                            "toType":"END",
                                            "to":{
 
                                            }
                                        },
                                        {
                                            "condition":{
                                                "input":"blackScore",
                                                "op":"BETWEEN",
                                                "value":[
                                                    50,
                                                    79
                                                ],
                                                "resCode":"JUMPTO"
                                            },
                                            "toType":"JUMPTO",
                                            "to":{
                                                         // 略
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    }
];















