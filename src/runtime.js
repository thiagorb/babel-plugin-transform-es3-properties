(function () {
    if (Object.__has_es3_properties_decorations__) {
        return;
    }

    var initializeProperties = function () {
        var properties = {};
        return function () { return properties; };
    };

    var initializeProperty = function (v) {
        var value = v;
        return {
            get: function () { return value },
            set: function (v) { value = v; return value }
        }
    };

    var decorate = function (source, method, decoration, fallback) {
        if (typeof source[method] !== 'undefined') {
            var original = source[method];
            source[method] = decoration(original);
        } else {
            source[method] = decoration(fallback);
        }
    };

    Object.defineProperty = function (obj, prop, descriptor) {
        if (typeof obj.__properties__ === 'undefined') {
            obj.__properties__ = initializeProperties();
        }

        if (!(prop in obj)) {
            obj[prop] = undefined;
        }

        if (typeof descriptor.value === 'undefined') {
            obj.__properties__()[prop] = descriptor;
        } else {
            obj.__properties__()[prop] = initializeProperty(descriptor.value);
        }
    };

    Object.defineProperties = function (obj, descriptors) {
        for (var prop in descriptors) {
            Object.defineProperty(obj, prop, descriptors[prop]);
        }
    };

    decorate(
        Object,
        'keys',
        function (original) {
            return function (obj) {
                var keys = [];
                var originalKeys = original(obj);
                for (var i = 0; i < originalKeys.length; i++) {
                    if (obj.hasOwnProperty(originalKeys[i])) {
                        keys.push(originalKeys[i]);
                    }
                }
                return keys;
            };
        },
        function (obj) {
            var objKeys = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    objKeys.push(key);
                }
            }
            return objKeys;
        }
    );

    decorate(
        Object.prototype,
        'hasOwnProperty',
        function (original) {
            return function (propertyName) {
                if (!original.call(this, propertyName) || propertyName === '__properties__') {
                    return false;
                }

                var objProperties = (this.__properties__ && this.__properties__()) || {};
                return !(propertyName in objProperties);
            };
        },
        function (propertyName) {
            return propertyName in this;
        }
    );

    Object.__has_es3_properties_decorations__ = true;
})();

function isInvalidProperty (obj, prop) {
    return prop === 'constructor' ||
        prop === '__proto__' ||
        typeof obj.__properties__ === 'undefined' ||
        typeof obj.__properties__()[prop] === 'undefined';
}

function callGetter(obj, prop) {
    if (!obj) {
        return undefined;
    }

    if (isInvalidProperty(obj, prop)) {
        return obj[prop];
    }

    return obj.__properties__()[prop].get.call(obj);
}

function invokeGetter(obj, prop, args) {
    if (typeof obj === 'function' && prop === 'call') {
        var target = args[0];
        var _args = args.slice(1);
        return obj.apply(target, _args);
    }

    return callGetter(obj, prop).apply(obj, args);
}

function callSetter(obj, prop, value) {
    if (!obj) {
        return undefined;
    }

    if (isInvalidProperty(obj, prop)) {
        return obj[prop] = value;
    }

    obj.__properties__()[prop].set.call(obj, value);
    return value;
}

function doIncrement(obj, prop) {
    if (!obj) {
        return undefined;
    }

    if (isInvalidProperty(obj, prop)) {
        return obj[prop]++;
    }

    return obj.__properties__()[prop].set.call(obj, obj.__properties__()[prop].get.call(obj) + 1);
}

function doDecrement(obj, prop) {
    if (!obj) {
        return undefined;
    }

    if (isInvalidProperty(obj, prop)) {
        return obj[prop]--;
    }

    return obj.__properties__()[prop].set.call(obj, obj.__properties__()[prop].get.call(obj) - 1);
}