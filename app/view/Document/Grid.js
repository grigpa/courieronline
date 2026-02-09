Ext.define('COURIERONLINE.view.Document.Grid', {
    extend: 'Ext.grid.Panel',

    requires: ['Ext.ux.Paging', 'Ext.grid.Panel'],
    alias   : 'widget.documentGrid',

    store   : 'Documents',
    cls     : 'Documents',
    selType : 'checkboxmodel',
    forceFit: true,
    viewConfig: {
        getRowClass: function (record) {
            return (record.get('hasAcceptedTag') || record.get('hasRejectedTag')) ? 'bold-row' : '';
        }
    },
    columns : [
        {
            text: 'Документ',
            dataIndex: 'name',
            align: 'center',
            xtype    : 'templatecolumn',
            tpl      : new Ext.XTemplate(
                '{name}',
                '<tpl if="typeId==\'STAT_DOCFLOW_LETTER\'">',
                '<div class="document-letter-grid-subject">Тема: {details}</div>',
                '</tpl>'
            )

        },
        { text: 'Создан', dataIndex: 'created', align: 'center' },
        { text: 'Отчетный период',
            dataIndex: 'details',
            align: 'center',
            xtype    : 'templatecolumn',
            tpl      : new Ext.XTemplate(
                '<tpl if="typeId!=\'STAT_DOCFLOW_LETTER\'">',
                '{details}',
                '</tpl>'
            )
        },
        { text: 'Получатель', dataIndex: 'recipient', align: 'center' },
        {
            text     : 'Состояние',
            dataIndex: 'state',
            align    : 'center',
            xtype    : 'templatecolumn',
            tpl      : new Ext.XTemplate(
                '<tpl if="state==\'Отправлен\'">',
                '<div class="document-status-sent"></div>',
                '</tpl>',
                '<tpl if="state==\'Отвергнут\'">',
                '<div class="document-status-rejected"></div>',
                '</tpl>',
                '<tpl if="state==\'Доставлен\'">',
                '<div class="document-status-delivered"></div>',
                '</tpl>',
                '<tpl if="state==\'Принят\'">',
                '<div class="document-status-accepted"></div>',
                '</tpl>',
                '<tpl if="state==\'Отправлен в ТОГС\'">',
                '<div class="document-status-sent"></div>',
                '</tpl>',
                '<tpl if="state==\'Получен ТОГС\'">',
                '<div class="document-status-accepted"></div>',
                '</tpl>',
                '<tpl if="state==\'Получен респондентом\'">',
                '<div class="document-status-accepted"></div>',
                '</tpl>',
                '<tpl if="state==\'Требует уточнения\'">',
                '<div class="document-status-other"></div>',
                '</tpl>{state}'
            )
        }
    ],
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            margin: 5,
            items: [
                {
                    xtype: 'button',
                    scale: 'medium',
                    ui   : 'workspace',
                    multiple: 'multiple',
                    text: Msg.inbox,
                    itemId: 'filterDocs',
                    width: 170,
                    height: 30,
                    padding: 5,
                    menu: [
                        {
                            text: Msg.allDocs,
                            width: 170,
                            action: 'allDocs'
                        },
                        {
                            text: Msg.onlyNewDocs,
                            width: 170,
                            action: 'onlyNewDocs'
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    bodyPadding: 5,
                    height: 30,
                    border: 0,
                    itemId: 'counterPanel',
                    hidden: true,
                    layout: {
                        type: 'hbox',
                        align: 'middle'
                    },
                    items: [
                        {
                            xtype: 'label',
                            itemId: 'rowCounterLabel',
                            text: Msg.allDocsLabel + ':',
                            margin: '0 0 0 0'
                        },
                        {
                            xtype: 'label',
                            itemId: 'rowCounter',
                            text: '',
                            margin: '0 0 0 10'
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'toolbar',
            dock: 'top',
            items: [
                {
                    text     : 'Отправить',
                    iconCls  : 'icon-send',
                    margin   : '0 20 0 0',
                    iconAlign: 'top',
                    scale    : 'medium',
                    itemId   : 'sign'
                },
                {
                    text     : 'Печать',
                    iconCls  : 'icon-print',
                    margin   : '0 20 0 0',
                    iconAlign: 'top',
                    scale    : 'medium',
                    itemId   : 'print'
                },
                {
                    text     : Msg.exportMsg,
                    iconCls  : 'icon-export',
                    iconAlign: 'top',
                    scale    : 'medium',
                    margin   : '0 20 0 0',
                    itemId   : 'export'
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
        }
    ],
    bbar    : {
        xtype  : 'custompaging',
        store  : 'Documents'
    }
});