/**
 * Таблица документооборотов
 */
Ext.define('COURIERONLINE.view.Docflow.Grid', {
    extend: 'Ext.grid.Panel',

    requires: ['Ext.toolbar.Paging', 'Ext.grid.Panel'],
    alias   : 'widget.docflowGrid',

    store   : 'Docflows',
    cls     : 'Docflows',
    selModel: {
        selectionMode: 'SINGLE'
    },
    forceFit: true,

    columns: [
        { text: 'Наименование', dataIndex: 'name' },
        { text: 'Отправитель',  dataIndex: 'sender' },
        { text: 'Получатель',   dataIndex: 'recipient' },
        { text: 'Начат',        dataIndex: 'started' },
        { text: 'Завершен',     dataIndex: 'finished' },
        { text: 'Состояние',    dataIndex: 'state' }
    ],
    tbar: [
        {
            text: 'Тест',
            iconCls: 'icon-copy',
            iconAlign: 'top',
            margin: '0 20 0 0',
            scale: 'medium',
            itemId: 'test'
        }
    ],

    bbar: {
        xtype: 'custompaging',
        store: 'Docflows'
    }
});