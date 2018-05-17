
window._$_tool_ = {
	/**
	 * 判断数据类型是否为json数据类型
	 * @Author   dingyang
	 * @DateTime 2018-04-16
	 * @param    {[type]}   data                 [description]
	 * @return   {Boolean}                       [description]
	 */
    isJson: function (data) {
        return (typeof(data) == "object" && Object.prototype.toString.call(data).toLowerCase() == "[object object]") || false;
    },
    /**
     * 判断数据类型是否为array数据类型
     * @Author   dingyang
     * @DateTime 2018-04-16
     * @param    {[type]}   data                 [description]
     * @return   {Boolean}                       [description]
     */
    isArray: function (data) {
        return (typeof(data) == "object" && Object.prototype.toString.call(data).toLowerCase() == "[object array]") || false;
    },
    getJsonArrLength: function (data) {
        return Object.keys(data).length;
    },
    deepCopy: function (obj) {
        var type = this.isJson(obj) ? {} : [];
        for (var key in obj) {
            if(typeof obj[key]=='object') {
                type[key] =  arguments.callee.call(this, obj[key]);
            } else {
                type[key] = obj[key];
            }
        }
        return type;
    },
    /**
     * 数据比较是否相等
     * @Author   dingyang
     * @DateTime 2018-04-24
     * @param    {[type]}   data1                [description]
     * @param    {[type]}   data2                [description]
     * @return   {[type]}                        [description]
     */
    compare: function (data1, data2) {
        var isJson = (this.isJson(data1) && this.isJson(data2)),
            isArray = (this.isArray(data1) && this.isArray(data2));
        if (isJson || isArray) {
            // 说明data1 || data2都是json_data 或者 array-data
            if (this.getJsonArrLength(data1) !== this.getJsonArrLength(data2)) {
                return false;
            }
            for (var key in data1) {
                var compareResult =  arguments.callee.call(this, data1[key], data2[key]);
                if (!compareResult) {
                    return false;
                }
                else {
                    continue;
                }
            }
            return true;
        }
        else {
            return (data1 === data2);
        }
    },
    /**
     * 打印日志信息
     * @Author   dingyang
     * @DateTime 2018-04-16
     * @param    {[type]}   type                 error warn log三种日志信息类型
     * @param    {[type]}   info                 [description]
     * @return   {[type]}                        [description]
     */
    logInfo: function (type, info) {
        console.log('错误类型：' + (type || 'error'), '错误信息：'+ (info || 'error info'));
    }
};
window._$_ = {
	toolUtil: _$_tool_,

    /**
     * 格式化方法[{id:,parentId:}, {id:,parentId:}] => [{id:,childern:[{}]}]
     * @Author   dingyang
     * @DateTime 2018-05-02
     * @param    {[type]}   config               [description]
     * @return   {[type]}                        [description]
     */
    formatChildren: function (config) {
        return this._formatChildren(config, []);
    },
    _formatChildren: function (config, arr) {
        var jsonArr_data = config.data,
            nodeParentId = config.parentId,
                  nodeId = config.id;
        var results = arr, tmpResult = [];
        for (var i = 0; i < jsonArr_data.length; i++) {
            var tmpData = jsonArr_data[i];
            var tmpNodeParentId = tmpData[nodeParentId],
                      tmpNodeId = tmpData[nodeId];
            if (!tmpNodeParentId) {
                tmpData.children = [];
                results.push(tmpData);
                continue;
            }
            // 查找当前节点的父节点是否位于results结果中
            var queryCurrentNodes = this.queryNodes({
                key: nodeId,
                value: tmpNodeParentId,
                data: results
            });
            if (queryCurrentNodes.length > 1) {
                this.toolUtil.logInfo('error', 'data-format: id repeat');
                return;
            }
            if (queryCurrentNodes.length === 1) {
                // 说明查找到指定父元素节点
                var parentNode = queryCurrentNodes[0];
                tmpData.children = [];
                parentNode.children.push(tmpData);
            } else {
                // 说明没有查找到指定父元素节点
                tmpResult.push(tmpData);
            }
        }
        if (!tmpResult.length) {
            return results;
        }
        config.data = tmpResult;
        return arguments.callee.call(this, config, results);
    },

    
    insertBefore: function (config) {
        return this._insertBeforeOrAfter(config, 'before');
    },

    insertAfter: function (config) {
        return this._insertBeforeOrAfter(config, 'after');
    },
    /**
     * 执行插入数据[深拷贝思想]
     * @Author   dingyang
     * @DateTime 2018-05-17
     * @param    {[type]}   config               [description]
     * @param    {[type]}   type                 描述在查找元素之前插入还是之后插入‘before’|'after'
     * @return   {[type]}                        [description]
     */
    _insertBeforeOrAfter: function (config, type) {
        var json_arr_data = config.data,
                nodeValue = config.value,
                  nodeKey = config.key,
              targetValue = config.target.value, // 插入目标元素value
                targetKey = config.target.key;   // 插入目标元素key

        var isArrayData = this.toolUtil.isArray(json_arr_data),
             isJsonData = this.toolUtil.isJson(json_arr_data);
        // 首先，进行异常逻辑处理(如果不是json也不是array)
        if (!isJsonData && !isArrayData) {
            return json_arr_data;
        }
        var isQueryArray = ((typeof nodeKey) === 'number') ? true : false;

        var results = isArrayData ? [] : {};
        for (var key in json_arr_data) {
            var keyValue = json_arr_data[key];

            if ((nodeKey || (nodeKey === 0)) && nodeValue) {
                var compare = (this.toolUtil.compare(isQueryArray ? key * 1 : key, nodeKey) && this.toolUtil.compare(keyValue, nodeValue));
            }
            else if (nodeKey || (nodeKey === 0)) {
                var compare = this.toolUtil.compare(isQueryArray ? key * 1 : key, nodeKey);
            }
            else if (nodeValue) {
                var compare = this.toolUtil.compare(keyValue, nodeValue);
            }
            if (compare && type === 'before') {
                // 如果命中比对规则
                if (isArrayData) {
                    // 如果数据源是数组，此时需要对新数组进行插入target目标元素
                    results.push(targetValue);
                } else {
                    results[targetKey] = targetValue;
                }
            }
            if (this.toolUtil.isArray(keyValue) || this.toolUtil.isJson(keyValue)) {
                config.data = keyValue;
                if (isArrayData) {
                    results.push(arguments.callee.call(this, config, type));
                } else {
                    results[key] = arguments.callee.call(this, config, type);
                }
            } else {
                if (isArrayData) {
                    results.push(keyValue);
                } else {
                    results[key] = keyValue;
                }
            }
            if (compare && type === 'after') {
                // 如果命中比对规则
                if (isArrayData) {
                    // 如果数据源是数组，此时需要对新数组进行插入target目标元素
                    results.push(targetValue);
                } else {
                    results[targetKey] = targetValue;
                }
            }

        }
        return results;
    },


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
    queryNodes: function (config) {
        var json_arr_data = config.data,
                nodeValue = config.value,
                  nodeKey = config.key;
        var isArrayData = this.toolUtil.isArray(json_arr_data),
             isJsonData = this.toolUtil.isJson(json_arr_data),
                results = [];
        // 首先，进行异常逻辑处理(如果不是json也不是array)
        if (!isJsonData && !isArrayData) {
            return results;
        }
        var isQueryArray = ((typeof nodeKey) === 'number') ? true : false;
        // 其次，如果数据是json格式数据{a:1, b:1} || [a, b]
        for (var key in json_arr_data) {
            var keyValue = json_arr_data[key];
            if (this.toolUtil.isJson(keyValue) || this.toolUtil.isArray(keyValue)) {
                config.data = keyValue;
                results = results.concat(arguments.callee.call(this, config));
            }
            if ((nodeKey || (nodeKey === 0)) && nodeValue) {
                var compare = (this.toolUtil.compare(isQueryArray ? key * 1 : key, nodeKey) && this.toolUtil.compare(keyValue, nodeValue));
            }
            else if (nodeKey || (nodeKey === 0)) {
                var compare = this.toolUtil.compare(isQueryArray ? key * 1 : key, nodeKey);
            }
            else if (nodeValue) {
                var compare = this.toolUtil.compare(keyValue, nodeValue);
            }
            if (compare) {
                results.push(isQueryArray ? keyValue : json_arr_data);
            }
            continue;
        }
        return results;
    },
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
    queryParents: function (config) {
        var json_arr_data = config.data,
                nodeValue = config.value,
                  nodeKey = config.key;
        var isArrayData = this.toolUtil.isArray(json_arr_data),
             isJsonData = this.toolUtil.isJson(json_arr_data),
                results = [];
        // 首先，进行异常逻辑处理(如果不是json也不是array)
        if (!isJsonData && !isArrayData) {
            return results;
        }
        var isQueryArray = ((typeof nodeKey) === 'number') ? true : false;
        // 其次，如果数据是json格式数据{a:1, b:1} || [a, b]
        for (var key in json_arr_data) {
            var keyValue = json_arr_data[key];
            if ((nodeKey || (nodeKey === 0)) && nodeValue) {
                var compare = (this.toolUtil.compare(isQueryArray ? key * 1 : key, nodeKey) && this.toolUtil.compare(keyValue, nodeValue));
            }
            else if (nodeKey || (nodeKey === 0)) {
                var compare = this.toolUtil.compare(isQueryArray ? key * 1 : key, nodeKey);
            }
            else if (nodeValue) {
                var compare = this.toolUtil.compare(keyValue, nodeValue);
            }
            if (compare) {
                results.push(json_arr_data);
                if (isQueryArray) {
                    results.push(keyValue);
                }
                break;
            }
            else if (this.toolUtil.isArray(keyValue) || this.toolUtil.isJson(keyValue)) {
                config.data = keyValue;
                var tmpResults =  arguments.callee.call(this, config);
                if (tmpResults.length) {
                    results = [json_arr_data].concat(tmpResults);
                } else {
                    continue;
                }
            } 
            else {
                continue;
            }
        }
        return results;
    },
    nextSibling: function () {
        
    },
    preSibling: function () {
        
    },
    firstChild: function () {
        
    },
    querySiblings: function (config) {
        this.tmpSiblings = [];
        this._querySiblings(config);
        return this.tmpSiblings;
    },
    _querySiblings: function (config) {
        var json_arr_data = config.data,
                nodeValue = config.value,
                  nodeKey = config.key;
        var isArrayData = this.toolUtil.isArray(json_arr_data),
             isJsonData = this.toolUtil.isJson(json_arr_data),
                results = [],
                subData = []; // 用以存储下一级数据集合
        // 首先，进行异常逻辑处理(如果不是json也不是array)
        if (!isJsonData && !isArrayData) {
            return results;
        }
        var isQueryArray = ((typeof nodeKey) === 'number') ? true : false;
        // 其次，如果数据是json格式数据{a:1, b:1} || [a, b]
        for (var key in json_arr_data) {
            var keyValue = json_arr_data[key];
            results.push(keyValue);
            if ((nodeKey || (nodeKey === 0)) && nodeValue) {
                var compare = (this.toolUtil.compare(isQueryArray ? key * 1 : key, nodeKey) && this.toolUtil.compare(keyValue, nodeValue));
            }
            else if (nodeKey || (nodeKey === 0)) {
                var compare = this.toolUtil.compare(isQueryArray ? key * 1 : key, nodeKey);
            }
            else if (nodeValue) {
                var compare = this.toolUtil.compare(keyValue, nodeValue);
            }
            if (compare) {
                results.pop();
            }
            else if (this.toolUtil.isArray(keyValue) || this.toolUtil.isJson(keyValue)) {
                subData.push(keyValue);
            }
        }
        if ((this.toolUtil.getJsonArrLength(json_arr_data) - 1) === results.length) {
            this.tmpSiblings.push(results);
        }
        if (subData.length) {
            for (var i = 0; i < subData.length; i++) {
                config.data = subData[i];
                arguments.callee.call(this, config);
            }
        }
    }
};







