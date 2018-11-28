import uuidv4 from 'uuid/v4';

/**
 * @desc 封装了一些项目常用方法.
 */

// 内部函数, 用于判断对象类型
function _getClass(object) {
    return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
}

export function isArray(obj) {
    return _getClass(obj).toLowerCase() === 'array';
}

export function isString(obj) {
    return _getClass(obj).toLowerCase() === 'string';
}

export function isDate(obj) {
    return _getClass(obj).toLowerCase() === 'date';
}

export function isObject(obj) {
    return _getClass(obj).toLowerCase() === 'object';
}

export function isNumber(obj) {
    return _getClass(obj).toLowerCase() === 'number';
}

export function isFormData(obj) {
    try {
        if (obj instanceof FormData) {
            return true;
        }
    } catch (e) {
        return false;
    }
    return false;
}

export function isIE() {
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf('compatible') > -1 &&
        userAgent.indexOf('MSIE') > -1) {
        return true;
    }
    return false;
}

/**
 * @desc 判断参数是否为空, 包括null, undefined, [], '', {}
 * @param {object} obj 需判断的对象
 */
export function isEmpty(obj) {
    var empty = false;

    if (obj === null || obj === undefined) { // null and undefined
        empty = true;
    } else if ((isArray(obj) || isString(obj)) && obj.length === 0) {
        empty = true;
    } else if (isObject(obj)) {
        var hasProp = false;
        for (let prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                hasProp = true;
                break;
            }
        }
        if (!hasProp) {
            empty = true;
        }
    } else if (isNumber(obj) && isNaN(obj)) {
        empty = true;
    }
    return empty;
}

/**
 * @desc 判断参数是否不为空
 */
export function isNotEmpty(obj) {
    return !isEmpty(obj);
}

/**
 * @desc 判断参数是否为空字符串, 比isEmpty()多判断字符串中全是空格的情况, 如: '   '.
 * @param {string} str 需判断的字符串
 */
export function isBlank(str) {
    if (isEmpty(str)) {
        return true;
    } else if (isString(str) && str.trim().length === 0) {
        return true;
    }
    return false;
}

/**
 * @desc 判断参数是否不为空字符串
 */
export function isNotBlank(obj) {
    return !isBlank(obj);
}

/**
 * @desc 判断元素对象是否还在滚动条可见区域
 * @param {string} index 子元素的索引
 * @param {string} scrollTop 滚动条顶部滚动的距离
 * @param {string} parentHeight 父元素的高度
 * @param {string} childHeight 子元素的高度
 */
export function isVisibleChild(index, scrollTop, parentHeight, childHeight) {
    var offsetTop = index * childHeight; // 列表项与父元素顶部的距离
    var offsetHeight = childHeight;      // 列表项的高度
    var visible = true;
    var calculateTop = offsetTop + offsetHeight - scrollTop;    // 计算是否在滚动条可见区域上方
    var calculateBottom = offsetTop - parentHeight - scrollTop; // 计算是否在滚动条可见区域下方

    // 当前对象是显示状态, 并且已经移动到滚动条上方或下方不可见区域
    if (calculateTop <= 0 || calculateBottom >= 0) {
        visible = false;
    }
    return visible;
}

/**
 * @desc 批量生成带id的对象数组.
 * @param {string} index 子元素的索引
 * @param {string} scrollTop 滚动条顶部滚动的距离
 * @param {string} parentHeight 父元素的高度
 * @param {string} childHeight 子元素的高度
 */
export function batchCreateItems(count) {
    var list = [];
    var i = 0;
    while (i < count) {
        list.push({
            id: uuidv4()
        });

        i++;
    }
    return list;
}

/**
 * @desc 函数节流
 * @url http://underscorejs.org/#throttle
 * @param {string} func 防抖函数
 * @param {string} wait 间隔时间
 * @param {string} options 可选项
 */
export function throttle(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) {
        options = {};
    }

    var later = function() {
        previous = options.leading === false ? 0 : +new Date();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) {
            context = args = null;
        }
    };

    return function() {
        var now = +new Date();
        if (!previous && options.leading === false) {
            previous = now;
        } 
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) {
                context = args = null;
            }
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}