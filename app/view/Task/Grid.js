/**
 * Таблицу активных задач
 */
Ext.define('COURIERONLINE.view.Task.Grid', {
    extend: 'Ext.grid.Panel',

    requires: ['Ext.toolbar.Paging', 'Ext.grid.Panel'],
    alias: 'widget.taskGrid',

    store: 'Tasks',
    cls  : 'Tasks',
    selModel: {
        selectionMode: 'MULTI'
    },
    forceFit: true,

    columns: [
        { text: 'Наименование', dataIndex: 'name' },
        { text: 'Создано', dataIndex: 'created' },
        { text: 'Обновлено', dataIndex: 'updated' },
        { text: 'Состояние', dataIndex: 'state' }
    ],
    tbar: [
        {
            text: Msg.start,
            itemId: 'start'
        },
        {
            text: Msg.stop,
            itemId: 'stop'
        },
        {
            text: Msg.details,
            itemId: 'details'
        }
    ],
    bbar: {
        xtype: 'pagingtoolbar',
        pageSize: 10,
        store: 'Tasks',
        displayInfo: true
    }
});