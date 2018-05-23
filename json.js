(function(global) {
    var _$_tool_ = {

    	/**
    	 * 判断数据类型是否为json数据类型
    	 * @Author   dingyang
    	 * @DateTime 2018-04-16
    	 * @param    {void}   data                   数据源
    	 * @return   {boolean}                       如果是json,返回true,否则返回false
    	 */
        isJson: function (data) {
            return (typeof(data) == "object" && Object.prototype.toString.call(data).toLowerCase() == "[object object]") || false;
        },
        /**
         * 判断数据类型是否为array数据类型
         * @Author   dingyang
         * @DateTime 2018-04-16
         * @param    {void}   data                 数据源
         * @return   {boolean}                     如果是array,返回true,否则返回false
         */
        isArray: function (data) {
            return (typeof(data) == "object" && Object.prototype.toString.call(data).toLowerCase() == "[object array]") || false;
        },

        /**
         * 返回array||json键长度（个数）
         * @Author   dingyang
         * @DateTime 2018-05-21
         * @param    {object}   data               数据源
         * @return   {number}                      长度
         */
        getJsonArrLength: function (data) {
            var isJson = this.isJson(data),
                isArray = this.isArray(data);
            if (!isJson && !isArray) {
                return 0;
            }
            return Object.keys(data).length;
        },

        /**
         * 对象深度拷贝【原始数据不产生变化】
         * @Author   dingyang
         * @DateTime 2018-05-21
         * @param    {object}   obj                  数据目标拷贝对象arrary||json
         * @return   {object}                        拷贝后数据
         */
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
         * 数据比较是否相等【此处不进行引用类型地址比较】
         * @Author   dingyang
         * @DateTime 2018-04-24
         * @param    {object}   data1                数据源之一
         * @param    {object}   data2                数据源之一
         * @return   {boolean}                       如果相等，返回true,否则返回false
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
        isContain: function (config) {
            var json_arr_data = config.data,
                    nodeValue = config.value,
                      nodeKey = config.key;
            var isArrayData = this.isArray(json_arr_data),
                 isJsonData = this.isJson(json_arr_data);
            if (!isArrayData && !isJsonData) {
                return false;
            }
            var isQueryArray = ((typeof nodeKey) === 'number') ? true : false;
            for (var key in json_arr_data) {
                var compare = false;
                var keyValue = json_arr_data[key];
                if ((nodeKey || (nodeKey === 0)) && nodeValue) {
                    compare = (this.compare(isQueryArray ? key * 1 : key, nodeKey) && this.compare(keyValue, nodeValue));
                }
                else if (nodeKey || (nodeKey === 0)) {
                    compare = this.compare(isQueryArray ? key * 1 : key, nodeKey);
                }
                else if (nodeValue) {
                    compare = this.compare(keyValue, nodeValue);
                }
                if (compare) return true;
            }
            return false;
        },

        /**
         * 打印日志信息
         * @Author   dingyang
         * @DateTime 2018-04-16
         * @param    {string}   type                 error warn log三种日志信息类型
         * @param    {string}   info                 日志信息
         * @return   {void}                          无
         */
        logInfo: function (type, info) {
            console.log('错误类型：' + (type || 'error'), '错误信息：'+ (info || 'error info'));
        }
    };
    var _$_ = {
    	toolUtil: _$_tool_,
        // 判断模式
        MODE_TYPE: {
           STRICT: 'strict',
           CONTAIN: 'contain'
        },
        _filterCompare: function (modeType, key, keyValue, nodeKey, nodeValue) {
            var compare =  false;
            var isQueryArray = ((typeof nodeKey) === 'number') ? true : false;
            if(modeType === this.MODE_TYPE.CONTAIN) {
                if ((nodeKey || (nodeKey === 0)) || nodeValue) {
                    compare = this.toolUtil.isContain({
                        key: nodeKey,
                        value: nodeValue,
                        data: keyValue
                    });
                }
                return compare;
            }
            if (modeType === this.MODE_TYPE.STRICT) {
                if ((nodeKey || (nodeKey === 0)) && nodeValue) {
                    compare = (this.toolUtil.compare(isQueryArray ? key * 1 : key, nodeKey) && this.toolUtil.compare(keyValue, nodeValue));
                }
                else if (nodeKey || (nodeKey === 0)) {
                    compare = this.toolUtil.compare(isQueryArray ? key * 1 : key, nodeKey);
                }
                else if (nodeValue) {
                    compare = this.toolUtil.compare(keyValue, nodeValue);
                }
                return compare;           
            }
            return compare;
        },

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
            return this._insertBeforeOrAfter(config, 'before', this.MODE_TYPE.STRICT);
        },

        insertAfter: function (config) {
            return this._insertBeforeOrAfter(config, 'after', this.MODE_TYPE.STRICT);
        },
        insertBefore2: function (config) {
            return this._insertBeforeOrAfter(config, 'before', this.MODE_TYPE.CONTAIN);
        },

        insertAfter2: function (config) {
            return this._insertBeforeOrAfter(config, 'after', this.MODE_TYPE.CONTAIN);
        },

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
        _insertBeforeOrAfter: function (config, type, modeType) {
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
                var compare = this._filterCompare(modeType, key, keyValue, nodeKey, nodeValue);
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
                        results.push(arguments.callee.call(this, config, type, modeType));
                    } else {
                        results[key] = arguments.callee.call(this, config, type, modeType);
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

        delete: function (config) {
            var compare = this._filterCompare(this.MODE_TYPE.STRICT, null, config.data, config.key, config.value);
            if (compare) return null;
            return this._delete(config, this.MODE_TYPE.STRICT);
        },
        delete2: function (config) {
            // 首先判断自身是否满足条件，如果满足条件直接返回null
            var compare = this._filterCompare(this.MODE_TYPE.CONTAIN, null, config.data, config.key, config.value);
            if (compare) return null;
            return this._delete(config, this.MODE_TYPE.CONTAIN);
        },
        deleteAllSiblings: function (config) {
            var compare = this._filterCompare(this.MODE_TYPE.STRICT, null, config.data, config.key, config.value);
            if (compare) return config.data;
            return this._deleteSiblings(config, this.MODE_TYPE.STRICT, 'all');
        },
        deleteAllSiblings2: function (config) {
            // 首先判断自身是否满足条件，如果满足条件直接返回null
            var compare = this._filterCompare(this.MODE_TYPE.CONTAIN, null, config.data, config.key, config.value);
            if (compare) return config.data;
            return this._deleteSiblings(config, this.MODE_TYPE.CONTAIN, 'all');
        },
        deleteBeforeSiblings: function (config) {
            var compare = this._filterCompare(this.MODE_TYPE.STRICT, null, config.data, config.key, config.value);
            if (compare) return config.data;
            return this._deleteSiblings(config, this.MODE_TYPE.STRICT, 'before');
        },
        deleteBeforeSiblings2: function (config) {
            // 首先判断自身是否满足条件，如果满足条件直接返回null
            var compare = this._filterCompare(this.MODE_TYPE.CONTAIN, null, config.data, config.key, config.value);
            if (compare) return config.data;
            return this._deleteSiblings(config, this.MODE_TYPE.CONTAIN, 'before');
        },
        deleteAfterSiblings: function (config) {
            var compare = this._filterCompare(this.MODE_TYPE.STRICT, null, config.data, config.key, config.value);
            if (compare) return config.data;
            return this._deleteSiblings(config, this.MODE_TYPE.STRICT, 'after');
        },
        deleteAfterSiblings2: function (config) {
            // 首先判断自身是否满足条件，如果满足条件直接返回null
            var compare = this._filterCompare(this.MODE_TYPE.CONTAIN, null, config.data, config.key, config.value);
            if (compare) return config.data;
            return this._deleteSiblings(config, this.MODE_TYPE.CONTAIN, 'after');
        },

        /**
         * 节点对象删除
         * @Author   dingyang
         * @example 严格模式【严格同一级匹配】
         * var result = delete({data: [1,{a:2},[2]], key: null, value: 2});  返回 [1,{},[]]
         * @example 包含模式【对象包含查找条件模式】
         * var result = delete2({data: [1,{a:2},[2]], key: null, value: 2}); 返回 [1]
         * 解释：数组中第2项{a;2},第3项[2]符合查找条件，因为此时是兼容模式,所以返回[1]
         * @DateTime 2018-04-24
         * @param    {Object}                         config         配置项
         * @param    {string}                         config.data    配置项-数据源                          
         * @param    {(number|string|null|undefined)} config.key     配置项-key
         * @param    {void}                           config.value   配置项-value
         * @param    {string}                         modeType       配置模式（提供两种模式'strict'|'contain'）
         * @return   {object}                         返回新的对象集合
         */
        _delete: function (config, modeType) {
            var json_arr_data = config.data,
                    nodeValue = config.value,
                      nodeKey = config.key;
            var isArrayData = this.toolUtil.isArray(json_arr_data),
                 isJsonData = this.toolUtil.isJson(json_arr_data),
                    results = [];
            // 首先，进行异常逻辑处理(如果不是json也不是array)
            if (!isJsonData && !isArrayData) {
                return json_arr_data;
            }
            var isQueryArray = ((typeof nodeKey) === 'number') ? true : false;
            var results = isArrayData ? [] : {};
            for (var key in json_arr_data) {
                var keyValue = json_arr_data[key];
                var compare = this._filterCompare(modeType, key, keyValue, nodeKey, nodeValue);
                if (compare) continue;
                if (this.toolUtil.isArray(keyValue) || this.toolUtil.isJson(keyValue)) {
                    config.data = keyValue;
                    if (isArrayData) {
                        results.push(arguments.callee.call(this, config, modeType));
                    } else {
                        results[key] = arguments.callee.call(this, config, modeType);
                    }
                } else {
                    if (isArrayData) {
                        results.push(keyValue);
                    } else {
                        results[key] = keyValue;
                    }
                }
            }
            return results;
        },


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
        _deleteSiblings: function (config, modeType, rule) {
            var json_arr_data = config.data,
                    nodeValue = config.value,
                      nodeKey = config.key;
            var isArrayData = this.toolUtil.isArray(json_arr_data),
                 isJsonData = this.toolUtil.isJson(json_arr_data),
                    results = [];
            // 首先，进行异常逻辑处理(如果不是json也不是array)
            if (!isJsonData && !isArrayData) {
                return json_arr_data;
            }
            var isQueryArray = ((typeof nodeKey) === 'number') ? true : false;
            var results = isArrayData ? [] : {};
            for (var key in json_arr_data) {
                var keyValue = json_arr_data[key];
                var compare = this._filterCompare(modeType, key, keyValue, nodeKey, nodeValue);
                if ((rule === 'before' || rule === 'all') && compare) {
                    results = isArrayData ? [] : {};
                };
                if (this.toolUtil.isArray(keyValue) || this.toolUtil.isJson(keyValue)) {
                    config.data = keyValue;
                    if (isArrayData) {
                        results.push(arguments.callee.call(this, config, modeType, rule));
                    } else {
                        results[key] = arguments.callee.call(this, config, modeType, rule);
                    }
                } else {
                    if (isArrayData) {
                        results.push(keyValue);
                    } else {
                        results[key] = keyValue;
                    }
                }
                if ((rule === 'after' || rule === 'all') && compare) break;

            }
            return results;
        },


        replace: function (config) {
            var compare = this._filterCompare(this.MODE_TYPE.STRICT, null, config.data, config.key, config.value);
            if (compare) return config.target;
            return this._replace(config, this.MODE_TYPE.STRICT);
        },
        replace2: function (config) {
            var compare = this._filterCompare(this.MODE_TYPE.CONTAIN, null, config.data, config.key, config.value);
            if (compare) return config.target;
            return this._replace(config, this.MODE_TYPE.CONTAIN);
        },
        _replace: function (config, modeType) {
            var json_arr_data = config.data,
                    nodeValue = config.value,
                      nodeKey = config.key,
                      target = config.target;
            var isArrayData = this.toolUtil.isArray(json_arr_data),
                 isJsonData = this.toolUtil.isJson(json_arr_data),
                    results = [];
            // 首先，进行异常逻辑处理(如果不是json也不是array)
            if (!isJsonData && !isArrayData) {
                return json_arr_data;
            }
            var isQueryArray = ((typeof nodeKey) === 'number') ? true : false;
            var results = isArrayData ? [] : {};
            for (var key in json_arr_data) {
                var keyValue = json_arr_data[key];
                var compare = this._filterCompare(modeType, key, keyValue, nodeKey, nodeValue);
                if (compare) {
                    if (isArrayData) {
                        results.push(target);
                    } else {
                        results[key] = target;
                    }
                    continue;
                }
                if (this.toolUtil.isArray(keyValue) || this.toolUtil.isJson(keyValue)) {
                    config.data = keyValue;
                    if (isArrayData) {
                        results.push(arguments.callee.call(this, config, modeType));
                    } else {
                        results[key] = arguments.callee.call(this, config, modeType);
                    }
                } else {
                    if (isArrayData) {
                        results.push(keyValue);
                    } else {
                        results[key] = keyValue;
                    }
                }
                

            }
            return results;
        },

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
                var compare = this._filterCompare(this.MODE_TYPE.STRICT, key, keyValue, nodeKey, nodeValue);
                if (compare) {
                    results.push(isQueryArray ? keyValue : json_arr_data);
                }
                continue;
            }
            return results;
        },

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
                var compare = this._filterCompare(this.MODE_TYPE.STRICT, key, keyValue, nodeKey, nodeValue);
                if (compare) {
                    results.push(json_arr_data);
                    if (isArrayData) {
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

        querySiblings: function (config) {
            this.tmpSiblings = [];
            this._querySiblings(config, this.MODE_TYPE.STRICT);
            var results = this.toolUtil.deepCopy(this.tmpSiblings);
            this.tmpSiblings = [];
            return results;
        },
        querySiblings2: function (config) {
            this.tmpSiblings = [];
            this._querySiblings(config, this.MODE_TYPE.CONTAIN);
            var results = this.toolUtil.deepCopy(this.tmpSiblings);
            this.tmpSiblings = [];
            return results;
        },

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
        _querySiblings: function (config, modeType) {
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
                var compare = this._filterCompare(modeType, key, keyValue, nodeKey, nodeValue);
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
                    arguments.callee.call(this, config, modeType);
                }
            }
        }
    };
    //兼容CommonJs规范   
    if (typeof module !== 'undefined' && module.exports) {  
        module.exports = _$_;  
    };  
    //兼容AMD/CMD规范  
    if (typeof define === 'function') define(function() {   
        return _$_;   
    });
    //注册全局变量，兼容直接使用script标签引入插件
    global._$_ = _$_;
})(this); 






