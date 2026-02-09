Ext.define('COURIERONLINE.view.Organization.Grid', {
    extend: 'Ext.grid.Panel',

    requires: ['Ext.toolbar.Paging', 'Ext.grid.Panel'],
    alias   : 'widget.organizationGrid',

    store   : 'Organizations',
    cls     : 'Organizations',
    selModel: {
        selectionMode: 'SINGLE'
    },
    forceFit: true,

    columns: [
        { text: 'Наименование', dataIndex: 'name' },
        { text: Msg.inn, dataIndex: 'inn' },
        { text: 'КПП', dataIndex: 'kpp' },
        { text: 'Email', dataIndex: 'email' },
        { text: Msg.inspection, dataIndex: 'inspection.name' }
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
        },
        {
            text     : Msg.remove,
            iconCls  : 'icon-remove',
            margin   : '0 20 0 0',
            iconAlign: 'top',
            scale    : 'medium',
            disabled : true,
            itemId   : 'remove'
        }
    ]
});