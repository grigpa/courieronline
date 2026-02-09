/**
 * Таблицу активных задач
 */
Ext.define('COURIERONLINE.view.Templates.Grid', {
    extend: 'Ext.grid.Panel',

    requires: ['Ext.toolbar.Paging', 'Ext.grid.Panel'],
    alias: 'widget.templatesGrid',

    store: 'Templates',
    cls  : 'Templates',
    selType : 'checkboxmodel',

    multiSelect: true,
    forceFit: true,

    columns: [
        { text: 'id', dataIndex: 'name', hidden: true },
        { text: 'Наименование', dataIndex: 'name' }
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

            xtype: 'form',
            itemId: 'importform',
            ui: '',
            border: false,
            hidden: true,
            errorReader: Ext.create('Ext.ux.ErrorReader'),
            items: {
                hidden: true,
                xtype: 'filefield',
                itemId: 'importTemplate',
                buttonText: Msg.importMsg,
                buttonConfig: {
                    id: 'importTemplateBtn',
                    multiple: 'multiple',
                    acceptedTypes: 'application/xml'
                },
                buttonOnly: true,
                margin: 0
            }
        },
        {
            text     : Msg.remove,
            iconCls  : 'icon-remove',
            margin   : '0 20 0 0',
            iconAlign: 'top',
            scale    : 'medium',
            itemId   : 'remove'
        }
    ]
});