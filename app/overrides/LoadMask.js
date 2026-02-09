Ext.define('COURIERONLINE.overrides.LoadMask', {
    override: 'Ext.LoadMask',

    show: function () {
        var isAnyMaskVisible = Ext.Array.some(Ext.ComponentQuery.query('loadmask'), function (item) {
            // проверяем отображение маски
            return item.el ? item.el.isVisible() : (item.ownerCt && item.ownerCt.isMasked && item.ownerCt.isMasked());
        });
        if (!isAnyMaskVisible) {
            this.callOverridden();
        }
    }

});