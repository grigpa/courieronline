new TestCase('Test JsonWriter and JsonReader', {

    /**
     * Конвертирует объект со вложенными объектами в плоский объект,
     * например: {a: {b:1} }  -> { 'a.b': 1 }
     */
    convertObjectToPlain: function (record) {
        var result = {};
        Ext.Object.each(record, function (k1, v1) {
            if (Ext.isObject(v1)) {
                var obj = this.convertObjectToPlain(v1);
                Ext.Object.each(obj, function (key, value) {
                    result[k1 + '.' + key] = value;
                });
            } else {
                result[k1] = v1;
            }
        }, this);
        return result;
    },

    /**
     * Конвертирует плоский объект в объект со вложенными объектами,
     * например: { 'a.b': 1 } -> {a: {b:1} }
     */
    convertObjectFromPlain: function (record) {
        var result = {};
        Ext.Object.each(record, function (key, value) {
            if (key.indexOf('.') === -1) {
                result[key] = value;
            } else {
                var keys = key.split('.');
                var newKey = keys.shift();

                var inner = {};
                inner[keys.join('.')] = value;
                var nested = this.convertObjectFromPlain(inner);

                if (result[newKey] && Ext.isObject(result[newKey])) {
                    Ext.Object.each(nested, function (k, v) {
                        result[newKey][k] = v;
                    });
                } else {
                    result[newKey] = nested;
                }
            }
        }, this);
        return result;
    },

    'test convertObjectToPlain': function () {
        var input = {
            a: 1,
            b: { c: 2 },
            d: { e: 3, f: {g : 4} }
        };
        var expected = {
            a    : 1,
            'b.c': 2,
            'd.e': 3,
            'd.f.g': 4
        };
        assertEquals(this.convertObjectToPlain(input), expected);
    },

    'test convertObjectToFromPlain': function () {
        var input = {
            a    : 1,
            'b.c': 2,
            'b.d': 3,
            'b.d.e': 4,
            'k.l': 5,
            'k.m': 6
        };
        var expected = {
            a: 1,
            b: { c: 2, d: {e: 4} },
            k: {l: 5, m: 6}
        };
        assertEquals(this.convertObjectFromPlain(input), expected);
    }


});