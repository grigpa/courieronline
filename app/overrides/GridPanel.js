Ext.define('COURIERONLINE.overrides.GridPanel', {
    override: 'Ext.grid.Panel',

    border: false,

    rowLines: true,
    stripeRows: true,

    _overItemCls: '',
    _selectedItemCls: '',

    initComponent: function () {
        this.on('selectionchange', this.toggleBtnState, this);

        this.callOverridden();
    },

    toggleBtnState: function () {
        var method = this.getSelectionModel().hasSelection() ? 'enable' : 'disable';
        var buttons = ['remove', 'change', 'download'];
        var query = Ext.Array.map(buttons, function (btn) { return '[itemId=' + btn + ']'; }).join(', ');
        Ext.each(this.query(query), function (btn) {
            btn[method]();
        });
    }

});