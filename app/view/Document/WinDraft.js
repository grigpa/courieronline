/**
 * Окно документооборота, работает в двух режимах:
 *  режим просмотра документа и режим просмотра пакета документов
 */
Ext.define('COURIERONLINE.view.Document.WinDraft', {

    extend: 'Ext.Window',

    alias: 'widget.documentWinDraft',


    layout : {
        type: 'fit'
    },
    minWidth  : 1100,
    width  : 1100,
    height : 600,
    buttons: [
        {
            itemId: 'close',
            text  : 'OK'
        }
    ],

    initComponent: function () {
        var record = this.record;
        var docFlowId = this.docFlowId;
        var docFlowType = this.docFlowType;
        var folderType = this.folderType;
        var created = this.created;
        var row = this.row;
        Ext.apply(this, {
            title: row.get('name')
        });

        Ext.apply(this, {
            items: {
                xtype : 'panel',
                border : false,
                layout: {
                    type: 'border'
                },
                items : [
                    {
                        region  : 'west',
                        xtype   : 'docWorkflowRoot',
                        document: record,
                        docFlowId: docFlowId,
                        folderType: folderType,
                        created: created
                    },
                    {
                        region : 'center',
                        border : false,
                        layout: {
                            type: 'vbox',
                            align : 'stretch',
                            pack  : 'start'
                        },
                        items  : [
                            {
                                xtype  : 'docWorkflowList',
                                padding: '10 0 0 0',
                                folderType: folderType,
                                docFlowType: docFlowType,
                                records: record,
                                height: 350,
                                row: row
                            },
                            {
                                id       : 'docWindowContent',
                                border   : false,
                                flex: 1,
                                loader   : {
                                    autoLoad: false,
                                    url     : Ext.global.baseUrl
                                }
                            }
                        ]
                    }
                ]
            }
        });

        this.callParent();
    }
});