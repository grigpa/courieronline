Ext.define('COURIERONLINE.view.Operator.Grid', {
    extend: 'Ext.grid.Panel',

    requires: ['Ext.toolbar.Paging', 'Ext.grid.Panel'],
    alias   : 'widget.operatorGrid',

    store   : 'Operators',
    cls     : 'Operators',
    selModel: {
        selectionMode: 'SINGLE'
    },
    forceFit: true,

    columns: [
        { text: 'Наименование', dataIndex: 'name' },
        { text: 'Логин', dataIndex: 'login' }
    ],
    tbar   : [
        {
            text     : Msg.add,
            iconCls  : 'icon-add',
            margin   : '0 20 0 0',
            iconAlign: 'top',
            scale    : 'medium',
            itemId   : 'add'
        },
        {
            text     : Msg.change,
            disabled : true,
            iconCls  : 'icon-edit',
            margin   : '0 20 0 0',
            iconAlign: 'top',
            scale    : 'medium',
            itemId   : 'change'
        }
    ]
});