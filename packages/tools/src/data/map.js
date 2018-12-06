

function SmipleMap() {
    this.clear();
}
SmipleMap.prototype = {
    constructor: SmipleMap,
    clear: function () {
        this._values = {};
        this.size = 0;
    },
    delete: function (key) {
        if (this.has(key)) {
            this.size--;
            delete this._values[key];
            return true;
        }
        return false;
    },
    entries: function () {
        var i = -1, size = this.size, keys = this.keys(), values = this._values, done = false;
        function next() {
            var value;
            if (++i < size) {
                value = [keys[i], values[keys[i]]];
            } else {
                done = true;
            }
            return {
                value: value,
                done: done
            }
        }
        return {
            next: next
        }
    },
    forEach: function (callback, thatArg) {
        var iterator = this.entries(), item;
        do {
            item = iterator.next();
        }
        while (!item.done && callback.call(thatArg, item.value[1], item.value[0], this) !== false);
    },
    get: function (key) {
        if (this.has(key)) {
            return this._values[key];
        }
    },
    has: function (key) {
        return this._values.hasOwnProperty(key);
    },
    keys: function () {
        var name, i = 0, values = this._values, result = new Array(this.size);
        for (name in values) {
            if (this.has(name)) {
                result[i++] = name;
            }
        }
        return result;
    },
    set: function (key, value) {
        if (!this.has(key)) {
            this._values[key] = value;
            this.size++;
        }
        return this;
    },
    values: function () {
        var result = new Array(this.size), i = 0;
        this.forEach(function (value, key) {
            result[i++] = value;
        })
        return result;
    }

}