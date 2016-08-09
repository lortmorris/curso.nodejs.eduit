/**
 Name: $_$
 Version: 0.0.1
 */

console.log("Cargando libreria...");


var $_$ = {

    $arrays: {
        min: function () {
            var p = null;
            for (var x = 0; x < this.length; x++) {
                if (typeof this[x] == "number") {
                    p = p == null ? this[x] : ( p < this[x] ? p : this[x]);
                }
            }//end for
            return p;
        }//end min
        , max: function () {
            var p = null;
            for (var x = 0; x < this.length; x++) {
                if (typeof this[x] == "number") {
                    p = p == null ? this[x] : ( p > this[x] ? p : this[x]);
                }
            }//end for
            return p;
        }//end max

        , forEach: function (cb) {
            for (var x = 0; x < this.length; x++) {
                var r = cb(this[x]);
                this[x] = r == undefined ? this[x] : cb(this[x]);
            }//end for
            return this;
        }

        , last: function () {
            return this[this.length - 1];
        }

        , append: function (d) {
            if (d == null || d == undefined) return this;
            if (typeof d == "object" && typeof d.length != "undefined") {
                for (var x = 0; x < d.length; x++) this.push(d[x]);
                return this;
            }
            this.push(d);
            return this;
        }
    }//end $arrays objects


    , $object: {
        methods: ['isArray', 'isObject', 'isFunction', 'forEach', 'union']
        , isArray: function () {
            return Object.prototype.toString.call(this) == "[object Array]" ? true : false;
        }
        , isObject: function () {
            return Object.prototype.toString.call(this) == "[object Object]" ? true : false;
        }
        , isFunction: function () {
            return Object.prototype.toString.call(this) == "[object Function]" ? true : false;
        }
        , forEach: function (cb) {
            var _this = this;
            var _f = function (obj) {
                if (!obj.isObject) return;

                for (var x in obj) {
                    if (obj[x].isObject()) _f(obj[x]);
                    else {
                        if ($_$.$object.methods.indexOf(x) == -1 && !obj[x].isFunction()) {
                            var r = cb(x, obj[x]);
                            obj[x] = r == undefined ? obj[x] : r;
                        }//end if
                    }//end else
                }//end for
            };
            _f(this);

        }
        , union: function () {
            var _this = this;
            var _ = function (o, n) {
                for (var k in o) {
                    if (o[k].isObject()) {
                        n[k] = {};
                        _(o[k], n[k]);
                    }//end if
                    else {
                        n[k] = o[k];
                    }//end else
                }//end for
            }//end _

            for (var x = 0; x < arguments.length; x++) {
                if (arguments[x].isObject()) _(arguments[x], _this);
            }//end for
            return this;
        }
    }//end $object

    , $math: {
        sum: function (a) {
            a = a || [];
            return a.isArray() ?
                (function () {
                    var t = 0;
                    for (var x = 0; x < a.length; x++) t += a[x];
                    return t;
                })()
                : null;
        }
    }
};

(function () {

    Array.prototype.min = $_$.$arrays.min;
    Array.prototype.max = $_$.$arrays.max;
    Array.prototype.forEach = $_$.$arrays.forEach;
    Array.prototype.last = $_$.$arrays.last;
    Array.prototype.append = $_$.$arrays.append;

    Object.prototype.isArray = $_$.$object.isArray;
    Object.prototype.isObject = $_$.$object.isObject;
    Object.prototype.isFunction = $_$.$object.isFunction;
    Object.prototype.forEach = $_$.$object.forEach;
    Object.prototype.union = $_$.$object.union;

    Math.sum = $_$.$math.sum;

})();


