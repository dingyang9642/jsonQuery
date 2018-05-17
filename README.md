# jsonQuery
json数据查找+格式化

/**
 * 格式化方法[{id:,parentId:}, {id:,parentId:}] => [{id:,childern:[{}]}]
 * @Author   dingyang
 * @DateTime 2018-05-02
 * @param    {[type]}   config               [description]
 * @return   {[type]}                        [description]
 */
formatChildren: function (config) {
    return this._formatChildren(config, []);
}

insertBefore: function (config) {
   
},

insertAfter: function (config) {
   
}

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
queryNodes: function (config) {}

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
queryParents: function (config) {}

querySiblings()
