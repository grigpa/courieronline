/**
 * Окно документооборота, работает в двух режимах:
 *  режим просмотра документа и режим просмотра пакета документов
 */
Ext.define('COURIERONLINE.view.Document.Win', {

    extend: 'Ext.Window',

    alias: 'widget.documentWin',

    layout : {
        type: 'fit'
    },
    width  : 800,
    height : 600,
    buttons: [
        {
            itemId: 'close',
            text  : 'OK'
        }
    ],

    initComponent: function () {
        var record = this.record;
        var folderType = this.folderType;
        Ext.apply(this, {
            title: record.get('name')
        });

        var tbar = [
            {text: Msg.print},
            {text: Msg.exportMsg},
            {text: Msg.change}
        ];

        Ext.apply(this, {
            items: {
                xtype : 'panel',
                tbar  : tbar,
                layout: {
                    type: 'border'
                },
                items : [
                    {
                        region: 'center',
                        split : true,
                        layout: 'fit',
                        items : [
                            {
                                xtype  : 'docworkflowlist',
                                folderType: folderType,
                                records: record
                            }
                        ]
                    },
                    {
                        id       : 'docWindowContent',
                        region   : 'south',
                        split    : true,
                        height   : 100,
                        minHeight: 75,
                        maxHeight: 450,
                        loader   : {
                            autoLoad: false,
                            url     : Ext.global.baseUrl
                        }
                    }
                ]
            }
        });

        this.callParent();
    }
});