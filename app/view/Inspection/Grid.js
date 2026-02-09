/**
 * Таблица инспекций
 */
Ext.define('COURIERONLINE.view.Inspection.Grid', {
    extend: 'Ext.grid.Panel',

    requires: ['Ext.toolbar.Paging', 'Ext.grid.Panel'],
    alias   : 'widget.inspectionGrid',

    store   : 'Inspections',
    cls     : 'Inspections',
    selModel: {
        selectionMode: 'SINGLE'
    },
    forceFit: true,

    columns: [
        { text: 'Наименование', dataIndex: 'name' },
        { text: 'Системное имя', dataIndex: 'systemName' },
        { text: 'email', dataIndex: 'email' }
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
            iconCls  : 'icon-edit',
            margin   : '0 20 0 0',
            iconAlign: 'top',
            scale    : 'medium',
            disabled : true,
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