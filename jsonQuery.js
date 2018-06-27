(function(global) {
    // 配置变量
    var _$_conf_ = {
        // 判断模式
        MODE_TYPE: {
           STRICT: 'strict',
           CONTAIN: 'contain'
        },
        inValidValue: 'ignore', // 用来标记是否为无效的值
    };
    // 基本工具库
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

        isInArray: function (arr, data) {
            for (var i = 0; i < arr.length; i++) {
                if (this.compare(arr[i], data)) {
                    return true;
                }
            }
            return false;
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
            if (!this.isJson(obj) && !this.isArray(obj)) {
                return null;
            }
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
         * 为数组中的json数据添加广度&深度索引值[{id:1,childs:[{id:2}]}] => [{id:1,xIndex: 0, yIndex:0, childs:[{id:2}]}]
         * @Author   dingyang 
         * @DateTime 2018-06-27
         * @param    {[type]}   config               [description]
         * @param    {[type]}   yindex               [description]
         * @return   {[type]}                        [description]
         */
        formatIndex: function (config, yindex) {
            var obj = config.data,
                xKey = config.xKey || 'xIndex',
                yKey = config.yKey || 'yIndex';
            var isJson = this.isJson(obj);
            var isArray = this.isArray(obj);
            if (!isJson && !isArray) {
                return obj;
            }
            var type = isJson ? {} : [];
            var xIndex = 0;
            for (var key in obj) {
                var keyValue = obj[key];
                if (typeof keyValue == 'object') {
                    if (isArray && this.isJson(keyValue)) {
                        keyValue[xKey] = xIndex;
                        keyValue[yKey] = yindex;
                    }
                    if (this.isArray(keyValue)) {
                        yindex++;
                    }
                    config.data = keyValue;
                    type[key] =  arguments.callee.call(this, config, yindex);
                } else {
                    type[key] = keyValue;
                }
                if (isArray) {
                    xIndex++;
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
    // 业务公共处理对象
    var _$_busi_ = {
        toolUtil: _$_tool_,
        conf: _$_conf_,     // 配置对象
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
            var isArrayData = this.toolUtil.isArray(json_arr_data),
                 isJsonData = this.toolUtil.isJson(json_arr_data);
            if (!isArrayData && !isJsonData) {
                return false;
            }
            var isQueryArray = ((typeof nodeKey) === 'number') ? true : false;
            for (var key in json_arr_data) {
                var compare = false;
                var keyValue = json_arr_data[key];
                if (nodeKey !== this.conf.inValidValue && nodeValue !== this.conf.inValidValue) {
                    compare = (this.toolUtil.compare(isQueryArray ? key * 1 : key, nodeKey) && this.toolUtil.compare(keyValue, nodeValue));
                }
                else if (nodeKey !== this.conf.inValidValue) {
                    compare = this.toolUtil.compare(isQueryArray ? key * 1 : key, nodeKey);
                }
                else if (nodeValue !== this.conf.inValidValue) {
                    compare = this.toolUtil.compare(keyValue, nodeValue);
                }
                if (compare) return true;
            }
            return false;
        },
        _filterCompare: function (modeType, key, keyValue, nodeKey, nodeValue) {
            var compare =  false;
            var isQueryArray = ((typeof nodeKey) === 'number') ? true : false;
            if(modeType === this.conf.MODE_TYPE.CONTAIN) {
                if (nodeKey !== this.conf.inValidValue || nodeValue !== this.conf.inValidValue) {
                    compare = this.isContain({
                        key: nodeKey,
                        value: nodeValue,
                        data: keyValue
                    });
                }
                return compare;
            }
            if (modeType === this.conf.MODE_TYPE.STRICT) {
                if (nodeKey !== this.conf.inValidValue && nodeValue !== this.conf.inValidValue) {
                    compare = (this.toolUtil.compare(isQueryArray ? key * 1 : key, nodeKey) && this.toolUtil.compare(keyValue, nodeValue));
                }
                else if (nodeKey !== this.conf.inValidValue) {
                    compare = this.toolUtil.compare(isQueryArray ? key * 1 : key, nodeKey);
                }
                else if (nodeValue !== this.conf.inValidValue) {
                    compare = this.toolUtil.compare(keyValue, nodeValue);
                }
                return compare;           
            }
            return compare;
        },
    };
    // 规则层
    var _$_rule_ = {
        conf: _$_conf_,     // 配置对象
        toolUtil: _$_tool_,
        _getRules: function (rule) {
            var subRules = rule.split(',');
            var result = [];
            for (var i = 0; i < subRules.length; i++) {
                var tmpSubRule = subRules[i];
                tmpSubRule = tmpSubRule.replace(/^\s*|\s*$/g,"");
                // 验证该子规则是否符合条件（只有一个）
                var isValidRule = /\=/g.test(tmpSubRule) && !/\=\s*\=/g.test(tmpSubRule) && /[0-9a-zA-Z\_\u4e00-\u9fa5]+/g.test(tmpSubRule);
                if (isValidRule) {
                    var tmpSubRuleKeyValue = tmpSubRule.split('='),
                           tmpSubRuleValue = this._formatRule(tmpSubRuleKeyValue[1]),
                             tmpSubRuleKey = this._formatRule(tmpSubRuleKeyValue[0]);
                    if (tmpSubRuleValue.flag && tmpSubRuleKey.flag) {
                        result.push({key: tmpSubRuleKey.data, value: tmpSubRuleValue.data});
                    }
                } else {
                    this.toolUtil.logInfo('warn', 'rule-analysis: ' + tmpSubRule + ' is invalid');
                }
            }
            return result;
        },
        // 对规则中的数据进行解析
        _formatRule: function (key) {
            // 首先判断其是不是字符串
            if (/^'\w*'$/g.test(key) || /^"\w*"$/g.test(key)) {
                return {flag: true, data: key.substring(1, key.length - 1)};
            } else {
                try {
                    return {flag: true, data: JSON.parse(key)};
                } catch(e) {
                    if (key === '') {
                        return {flag: true, data: this.conf.inValidValue};
                    } else if (key === 'undefined') {
                        return {flag: true, data: undefined};
                    } else {
                        this.toolUtil.logInfo('error', 'rule-analysis: ' + key + ' is invalid');                        
                        return {flag: false, data: ''};
                    }
                }
            }
        }
    };
    // 核心方法
    var _$_core_ = {
        toolUtil: _$_tool_, // 工具库
        busiUtil: _$_busi_, // 公共业务模块
        conf: _$_conf_,     // 配置对象
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
                var queryCurrentNodes = this._queryNodes({
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
                var compare = this.busiUtil._filterCompare(modeType, key, keyValue, nodeKey, nodeValue);
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
            var compare = this.busiUtil._filterCompare(modeType, null, config.data, config.key, config.value);
            if (compare) return null;
            return this.__delete(config, modeType);
        },
        __delete: function (config, modeType) {
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
                var compare = this.busiUtil._filterCompare(modeType, key, keyValue, nodeKey, nodeValue);
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
         * @param    {string}                         type           删除规则（提供三种模式'before'|'after'|'all'）
         * @return   {object}                         返回新的对象集合
         */
        _deleteSiblings: function (config, type, modeType) {
            var compare = this.busiUtil._filterCompare(modeType, null, config.data, config.key, config.value);
            if (compare) return config.data;
            return this.__deleteSiblings(config, type, modeType);   
        },
        __deleteSiblings: function (config, type, modeType) {
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
                var compare = this.busiUtil._filterCompare(modeType, key, keyValue, nodeKey, nodeValue);
                if ((type === 'beforeAll' || type === 'all') && compare) {
                    results = isArrayData ? [] : {};
                };
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
                if ((type === 'afterAll' || type === 'all') && compare) break;

            }
            return results;
        },

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
        _replace: function (config, modeType) {
            var compare = this.busiUtil._filterCompare(modeType, null, config.data, config.key, config.value);
            if (compare) return config.target.value;
            return this.__replace(config, modeType);
        },
        __replace: function (config, modeType) {
            var json_arr_data = config.data,
                    nodeValue = config.value,
                      nodeKey = config.key,
                      targetKey = config.target.key;
                      targetValue = config.target.value;
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
                var compare = this.busiUtil._filterCompare(modeType, key, keyValue, nodeKey, nodeValue);
                if (compare && isArrayData && targetValue !== this.conf.inValidValue) {
                    results.push(targetValue);
                    continue;
                } else if (compare && targetKey !== this.conf.inValidValue) {
                    if (targetValue !== this.conf.inValidValue) {
                        results[targetKey] = targetValue;
                        continue;
                    } else {
                        key = targetKey;
                    }
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
        _queryNodes: function (config) {
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
                var compare = this.busiUtil._filterCompare(this.conf.MODE_TYPE.STRICT, key, keyValue, nodeKey, nodeValue);
                if (compare) {
                    results.push(isQueryArray ? keyValue : json_arr_data);
                }
                continue;
            }
            return results;
        },

        /**
         * 查找父节点对象集合,返回二维数组
         * @Author   dingyang
         * @example 示例
         * var result = queryParents({data: {a:{c1:3},b:{c1:3}}, key: 'c1', value: 3}); 
         * 返回[[{a:{c1:1},b:{c1:3}}, {c1:3}],   [{a:{c1:1},b:{c1:3}}, {c1:3}]]
         * @DateTime 2018-04-24
         * @param    {Object}                         config         配置项
         * @param    {string}                         config.data    配置项-数据源                          
         * @param    {(number|string|null|undefined)} config.key     配置项-key
         * @param    {void}                           config.value   配置项-value
         * @return   {array}                          符合条件的节点对象集合
         */
        _queryParents: function (config) {
            var results = [];
            var originData = config.data;
            var invalidNodes = this._queryNodes(config);
            for (var i = 0; i < invalidNodes.length; i++) {
                config.data = originData;
                this.cIndex = 0;
                results.push(this.__queryParents(config, i));
            }
            return results;
        },
        __queryParents: function (config, index) {
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
                var compare = this.busiUtil._filterCompare(this.conf.MODE_TYPE.STRICT, key, keyValue, nodeKey, nodeValue);
                if (compare) {
                    if (this.cIndex === index) {
                        // 说明找到当前指定索引位置的元素
                        results.push(json_arr_data);
                        break;
                    } else {
                        // 说明当前匹配的元素不是指定索引的元素，进行计数+1
                        this.cIndex = this.cIndex + 1;
                    }
                }
                else if (this.toolUtil.isArray(keyValue) || this.toolUtil.isJson(keyValue)) {
                    config.data = keyValue;
                    var tmpResults =  arguments.callee.call(this, config, index);
                    if (tmpResults.length) {
                        results = [json_arr_data].concat(tmpResults);
                        break;
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

        /**
         * 查找指定条件的父节点要素，类似queryParents，但不同于queryParents,返回结果要么0个要么1个
         * @Author   dingyang
         * @example 示例
         * var result = queryClosest({data: [1,2,{a:2,b:{a:5}}], key: 'a', value: 5, target: {key: 'a', value: 2}}); 
         * 返回[[{a:2,b:{a:5}}]]
         * @DateTime 2018-04-24
         * @param    {Object}                         config         配置项
         * @param    {string}                         config.data    配置项-数据源                          
         * @param    {(number|string|null|undefined)} config.key     配置项-key
         * @param    {void}                           config.value   配置项-value
         * @param    {object}                         config.target  配置项-target
         * @param    {(number|string|null|undefined)} target.key     配置项target-key
         * @param    {void}                           target.value   配置项target-value
         * @return   {array}                          符合条件的节点对象集合
         */
        _queryClosest: function (config) {
            var queryParents = this._queryParents(config);
            if (!queryParents.length) return [];
            var closestTarget = config.target;
            var results = [];
            for (var i = 0; i < queryParents.length; i++) {
                var tmpResult = [];
                for (var j = (queryParents[i].length - 1); j >=0 ; j--) {
                    var cNode = queryParents[i][j];
                    var compare = this.busiUtil.isContain({
                        data: cNode,
                        key: closestTarget.key,
                        value: closestTarget.value
                    })
                    if (compare) {
                        tmpResult.push(cNode);
                        break;
                    }
                }
                results.push(tmpResult);
            }
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
        _querySiblings: function (config, type, modeType) {
            this.tmpSiblings = [];
            this.__querySiblings(config, type, modeType);
            return  this.tmpSiblings;
        },
        __querySiblings: function (config, type, modeType) {
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
            var findFlag = false;
            // 其次，如果数据是json格式数据{a:1, b:1} || [a, b]
            for (var key in json_arr_data) {
                var keyValue = json_arr_data[key];
                results.push(keyValue);
                var compare = this.busiUtil._filterCompare(modeType, key, keyValue, nodeKey, nodeValue);
                if (compare) {
                    findFlag = true;
                    results.pop();
                    results.push('|'); // 此处插入区分标记，区分前兄弟节点／后兄弟节点
                }
                else if (this.toolUtil.isArray(keyValue) || this.toolUtil.isJson(keyValue)) {
                    subData.push(keyValue);
                }
            }
            if (findFlag) {
                var newResults = [];
                if (type === 'all') {
                    newResults = results.filter(function (item) {
                        return item !== '|'
                    });
                } else if (type === 'beforeAll') {
                    newResults = results.slice(0, results.indexOf('|'));
                } else if (type === 'afterAll') {
                    newResults = results.slice(results.indexOf('|') + 1);
                } else if (type === 'before') {
                    newResults = results.slice(results.indexOf('|') - 1, results.indexOf('|'));
                } else if (type === 'after') {
                    newResults = results.slice(results.indexOf('|') + 1, results.indexOf('|') + 2);
                }
                this.tmpSiblings.push(newResults);
            }
            if (subData.length) {
                for (var i = 0; i < subData.length; i++) {
                    config.data = subData[i];
                    arguments.callee.call(this, config, type, modeType);
                }
            }
        }
    };
    // 统一暴露层
    var _$_ = {
    	conf: _$_conf_,     // 配置对象
        ruleUtil: _$_rule_, // 规则解析
        toolUtil: _$_tool_, // 基本工具库（暂时暴露）
        busiUtil: _$_busi_, // 公共业务模块
        core: _$_core_,     // 核心对象
        /**
         * 用来进行规则拦截处理分发
         * @Author   dingyang
         * @DateTime 2018-05-28
         * @param    {[type]}   params               [description]
         * @param    {[type]}   funcName             执行函数名
         * @param    {[type]}   type                 'format' || 'query'
         * @return   {[type]}                        [description]
         */
        _transferBelt: function (params, funcName, type) {
            var rule = params.rule;
            if (rule) {
                var rules = this.ruleUtil._getRules(rule);
                var result = type === 'format' ? params.data : [];
                for (var i = 0; i < rules.length; i++) {
                    if (type === 'format') {
                        result = this[funcName]({
                            data: result,
                            key: rules[i]['key'],
                            value: rules[i]['value'],
                            target: params.target || {}
                        })
                    }
                    if (type === 'query') {
                        result.push(this[funcName]({
                            data: params.data,
                            key: rules[i]['key'],
                            value: rules[i]['value'],
                            target: params.target || {}
                        }));
                    }
                }
                return result;
            } else {
                return this[funcName](params);
            }
        },

        formatChildren: function (config) {
            return this.core._formatChildren(config, []);
        },


        insert: function (target, modeType, insertType) {
            if (!this.rule) {
                console.log('rule is not exits');
                return;
            }
            this._insertType = this.toolUtil.isInArray(['after', 'before'], insertType) ? insertType : 'before';
            // 模式参数设定
            this._modeType = this.toolUtil.isInArray([this.conf.MODE_TYPE.STRICT, this.conf.MODE_TYPE.CONTAIN], modeType) ? modeType : this.conf.MODE_TYPE.CONTAIN;
            // 执行查找
            var datas = this.data;
            var totalResults = [];
            for (var i = 0; i < datas.length; i++) {
                var tmpResults = this._transferBelt({
                    data: datas[i],
                    rule: this.rule,
                    target: target
                }, '_insert', 'format');
                totalResults.push(tmpResults);
            }
            this.setData(totalResults);
            this.setResult(totalResults[0] || null);
            return this;
        },
        _insert: function (config) {
            return this.core._insertBeforeOrAfter(config, this._insertType, this._modeType);
        },


        // 元素替换
        replace: function (target, modeType) {
            if (!this.rule) {
                console.log('rule is not exits');
                return;
            }
            // 模式参数设定
            this._modeType = this.toolUtil.isInArray([this.conf.MODE_TYPE.STRICT, this.conf.MODE_TYPE.CONTAIN], modeType) ? modeType : this.conf.MODE_TYPE.CONTAIN;
            // 删除逻辑
            var datas = this.data;
            var totalResults = [];
            for (var i = 0; i < datas.length; i++) {
                var tmpResults = this._transferBelt({
                    data: datas[i],
                    rule: this.rule,
                    target: target
                },  '_replace', 'format');
                totalResults.push(tmpResults);
            }
            this.setData(totalResults);
            this.setResult(totalResults[0] || null);
            return this;
        },
        _replace: function (config) {
            return this.core._replace(config, this._modeType);
        },


        // 元素删除
        delete: function (modeType) {
            if (!this.rule) {
                console.log('rule is not exits');
                return;
            }
            // 模式参数设定
            this._modeType = this.toolUtil.isInArray([this.conf.MODE_TYPE.STRICT, this.conf.MODE_TYPE.CONTAIN], modeType) ? modeType : this.conf.MODE_TYPE.CONTAIN;
            // 删除逻辑
            var datas = this.data;
            var totalResults = [];
            for (var i = 0; i < datas.length; i++) {
                var tmpResults = this._transferBelt({
                    data: datas[i],
                    rule: this.rule
                },  '_delete', 'format');
                totalResults.push(tmpResults);
            }
            this.setData(totalResults);
            this.setResult(totalResults[0] || null);
            return this;
        },
        _delete: function (config) {
            return this.core._delete(config, this._modeType);
        },

        deleteSiblings: function (modeType, deleteType) {
            if (!this.rule) {
                console.log('rule is not exits');
                return;
            }
            // 查找类型（区分‘all’， ‘beforeAll’，'afterAll'）三种兄弟节点类型
            this._deleteType = this.toolUtil.isInArray(['all', 'beforeAll', 'afterAll'], deleteType) ? deleteType : 'all';
            // 模式参数设定
            this._modeType = this.toolUtil.isInArray([this.conf.MODE_TYPE.STRICT, this.conf.MODE_TYPE.CONTAIN], modeType) ? modeType : this.conf.MODE_TYPE.CONTAIN;
 
            // 删除逻辑
            var datas = this.data;
            var totalResults = [];
            for (var i = 0; i < datas.length; i++) {
                var tmpResults = this._transferBelt({
                    data: datas[i],
                    rule: this.rule
                },  '_deleteSiblings', 'format');
                totalResults.push(tmpResults);
            }
            this.setData(totalResults);
            this.setResult(totalResults[0] || null);
            return this;
        },
        _deleteSiblings: function (config) {
            return this.core._deleteSiblings(config, this._deleteType, this._modeType);
        },

        // 元素查找
        find: function () {
            if (!this.rule) {
                console.log('rule is not exits');
                return;
            }
            var datas = this.data;
            var totalResults = [];
            for (var i = 0; i < datas.length; i++) {
                var tmpResults = this._transferBelt({
                    data: datas[i],
                    rule: this.rule
                }, '_find', 'query');
                // 进行一维数组转换
                for (var j = 0; j < tmpResults.length; j++) {
                    totalResults = totalResults.concat(tmpResults[j]);
                }
            }
            this.setResult(totalResults);
            return this;
        },
        _find: function (config) {
            return this.core._queryNodes(config);
        },

        siblings: function (modeType, queryType) {
            if (!this.rule) {
                console.log('rule is not exits');
                return;
            }
            // 查找类型（区分‘all’， ‘before’，'after'）三种兄弟节点类型
            this._queryType = this.toolUtil.isInArray(['all', 'before', 'after', 'beforeAll', 'afterAll'], queryType) ? queryType : 'all';
            // 模式参数设定
            this._modeType = this.toolUtil.isInArray([this.conf.MODE_TYPE.STRICT, this.conf.MODE_TYPE.CONTAIN], modeType) ? modeType : this.conf.MODE_TYPE.CONTAIN;
            // 执行查找
            var datas = this.data;
            var totalResults = [];
            for (var i = 0; i < datas.length; i++) {
                var tmpResults = this._transferBelt({
                    data: datas[i],
                    rule: this.rule
                }, '_siblings', 'query');
                // 进行二维数组转换
                for (var j = 0; j < tmpResults.length; j++) {
                    for (var k = 0; k < tmpResults[j].length; k++) {
                        totalResults = totalResults.concat(tmpResults[j][k]);
                    }
                }
            }
            this.setResult(totalResults);
            return this;
            
        },
        _siblings: function (config) {
            return this.core._querySiblings(config, this._queryType, this._modeType);
        },


        parents: function () {
            if (!this.rule) {
                console.log('rule is not exits');
                return;
            }
            return this._parentsAndClosest(this.rule, '_parents');
        },
        closest: function (target) {
            if (!this.rule) {
                console.log('rule is not exits');
                return;
            }
            return this._parentsAndClosest(this.rule, '_closest', target);
        },
        _parentsAndClosest: function (rule, funcName, target) {
            // 执行查找
            var datas = this.data;
            var totalResults = [];
            for (var i = 0; i < datas.length; i++) {
                var tmpResults = this._transferBelt({
                    data: datas[i],
                    rule: rule,
                    target: target || {}
                }, funcName, 'query');
                // 进行二维数组转换
                for (var j = 0; j < tmpResults.length; j++) {
                    for (var k = 0; k < tmpResults[j].length; k++) {
                        totalResults = totalResults.concat(tmpResults[j][k]);
                    }
                }
            }
            this.setResult(totalResults);
            return this; 
        },
        _parents: function (config) {
            return this.core._queryParents(config);
        },
        _closest: function (config) {
            return this.core._queryClosest(config);
        },

        // 设置rule条件，后续操作都会基于当前rule规则
        target: function (rule) {
            // 首先需要对rule规则进行初步校验，暂时todo校验，直接放行
            this.rule = rule;
            return this;
        },

        // 获取最终返回数据
        val: function () {
            return this.result || this.data;
        },
        // 数据源重设
        setData: function (data) {
            this.data = data;
        },

        // 返回结果，供.val()方法使用
        setResult: function (result) {
            this.result = result;
        }
    };


    var jsonQuery = function (dataSource) {
        return new jsonQuery.fn.init(dataSource);
    };
    jsonQuery.fn = jsonQuery.prototype = _$_; // 核心暴露方法
    jsonQuery.toolUtil = _$_tool_; // 工具方法暴露对象
    var init = jsonQuery.fn.init = function (dataSource) {
        this.data = [dataSource];
        return this;
    };
    init.prototype = jsonQuery.fn;
    

    
    



    //兼容CommonJs规范   
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = jsonQuery;
    };
    //兼容AMD/CMD规范  
    if (typeof define === 'function') define(function() {   
        return jsonQuery;   
    });
    //注册全局变量，兼容直接使用script标签引入插件
    global.jsonQuery= jsonQuery;
})(this); 






