var crypto = require('crypto'),
    util = require('util');

var toString = Object.prototype.toString;
var isArray = util.isArray;

exports.isArray = isArray;

function isBoolean(obj) {
    return toString.call(obj) === '[object Boolean]';
}


function isString(obj) {
    return toString.call(obj) === '[object String]';
}

function isNumber(obj) {
    return toString.call(obj) === '[object Number]';
}

function isObject(obj) {
    if (Buffer.isBuffer(obj)) {
        return false;
    }
    return toString.call(obj) === '[object Object]';
}

exports.isObject = isObject;
exports.isString = isString;
exports.isNumber = isNumber;
exports.isBoolean = isBoolean;


exports.isFunction = function(obj) {
    return typeof obj === 'function';
};

exports.isDate = util.isDate;
exports.isRegexp = util.isRegexp;
exports.isError = util.isError;

exports.isEmpty = function(obj) {
    if (isObject(obj)) {
        var key;
        for (key in obj) {
            return false;
        }
        return true;
    } else if (isArray(obj)) {
        return obj.length === 0;
    } else if (isString(obj)) {
        return obj.length === 0;
    } else if (isNumber(obj)) {
        return obj === 0;
    } else if (obj === null || obj === undefined) {
        return true;
    } else if (isBoolean(obj)) {
        return !obj;
    }
    return false;
};

exports.isScalar = function(obj) {
    return isBoolean(obj) || isNumber(obj) || isString(obj);
};



var numberReg = /^((\-?\d*\.?\d*(?:e[+-]?\d*(?:\d?\.?|\.?\d?)\d*)?)|(0[0-7]+)|(0x[0-9a-f]+))$/i;
exports.isNumberString = function(obj) {
    return numberReg.test(obj);
};


exports.ucfirst = function(name) {
    name = (name || '') + '';
    return name.substr(0, 1).toUpperCase() + name.substr(1).toLowerCase();
};

exports.md5 = function(str) {
    return crypto.createHash('md5').update(str + '').digest('hex');
};

exports.toNumber = function(s) {
    if (!s) {
        return 0;
    }
    if (s.toFixed) {
        return s;
    }
    if (s.indexOf('E') > -1) {
        return Number(s).valueOf();
    }
    if (s.indexOf('.') > -1) {
        return parseFloat(s);
    }
    return parseInt(s, 10);
};


exports.strlen = function(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            len++;
        } else {
            len += 2;
        }
    }
    return len;
};


exports.htmlEscape = function(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/'/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
};

exports.encrypt = function(value, secret) {
    if ('string' !== typeof value) {
        throw new TypeError('value required');
    }
    if ('string' !== typeof secret) {
        throw new TypeError('secret required');
    }

    var cipher = crypto.createCipher('des', secret);
    var ret = cipher.update(value, 'utf8', 'hex');
    ret += cipher['final']('hex');

    return ret;
};

exports.decrypt = function(value, secret) {
    if ('string' !== typeof value) {
        throw new TypeError('value required');
    }
    if ('string' !== typeof secret) {
        throw new TypeError('secret required');
    }

    var decipher,
        ret;

    try {
        decipher = crypto.createDecipher('des', secret);
        ret = decipher.update(value, 'hex', 'utf8');
        ret += decipher['final']('utf8');
    } catch (e) {
        ret = '';
    }

    return ret;
};