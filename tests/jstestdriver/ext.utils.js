Ext.define('TEST.testUtils', {

    compareStructureObjects: function (x, y) {
        if (!(x instanceof Object) || !(y instanceof Object)) {
            return false;
        }
        if (x.constructor !== y.constructor) {
            return false;
        }
        Ext.each(x, function (p) {
            var hasContinued = false;
            if (!x.hasOwnProperty(p)) {
                hasContinued = true;
            }
            if ((!y.hasOwnProperty(p)) && (!hasContinued)) {
                return false;
            }
            if ((x[p] === y[p]) && (!hasContinued)) {
                hasContinued = true;
            }
            if ((typeof(x[p]) !== 'object') && (!hasContinued)) {
                return true;
            }
            if ((!this.compareStructureObjects(x[p], y[p])) && (!hasContinued)) {
                return false;
            }
        }, this);

        for (var p in y) {
            if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
                return false;
            }
        }
        return true;
    }
});
