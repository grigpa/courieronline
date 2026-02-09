/**
 * Таблица инспекций
 */
Ext.define('COURIERONLINE.view.SuperInspection.Grid', {
    extend: 'Ext.grid.Panel',

    requires: ['Ext.toolbar.Paging', 'Ext.grid.Panel'],
    alias   : 'widget.superInspectionGrid',

    store   : 'SuperInspections',
    cls     : 'SuperInspections',
    selModel: {
        selectionMode: 'SINGLE'
    },
    forceFit: true,


    columns: [
        { text: 'Наименование', dataIndex: 'name' },
        { text: 'Системное имя', dataIndex: 'systemName' }
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