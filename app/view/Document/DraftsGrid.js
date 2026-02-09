Ext.define('COURIERONLINE.view.Document.DraftsGrid', {
    extend: 'COURIERONLINE.view.Document.Grid',

    requires: ['COURIERONLINE.view.Document.Grid'],

    alias: 'widget.documentDraftsGrid',

    columns: [
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

        { text: 'Получатель', dataIndex: 'recipient', align: 'center' }
    ],
    dockedItems: [
        {
            xtype: 'toolbar',
            dock: 'top',
            items: [
                {
                    xtype: 'panel',
                    margin: {top: 5, left: 5, right: 5, bottom: 5},
                    border: 0,
                    layout: {
                        type: 'hbox',
                        align: 'middle'
                    },
                    items: [
                        {
                            cls:   'workspaceCaption',
                            xtype: 'label',
                            html: Msg.draft,
                            margin: '0 12 0 0'
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

    ]
});