/**
 * Окно для подписи и отправке подписанных пакетов
 */
Ext.define('COURIERONLINE.view.CertWin', {
    extend: 'Ext.Window',

    alias: 'widget.certWin',

    width   : 300,
    height  : 200,
    title   : 'Выберите сертификат',
    modal   : true,
    closable: true,

    layout : {
        type: 'fit'
    },
    buttons: [
        {text: 'OK', itemId: 'OkCert'}
    ],
    items  : {
        xtype : 'gridpanel',
        forceFit: true,
        anchor: '100% 100%',
        columns : [
            {
                text     : 'Владелец',
                dataIndex: 'owner',
                editor   : 'textfield',
                minWidth : 130
            },
            {
                text     : 'Установлен локально',
                dataIndex: 'isLocal',
                falseText: '<span style="color:red;">нет</span>',
                trueText: '<span style="color:lightgreen;">да</span>',
                xtype   : 'booleancolumn',
                minWidth : 130
            },
            {
                text     : 'Наличие закрытого ключа',
                dataIndex: 'hasPrivateKey',
                falseText: '<span style="color:red;">нет</span>',
                trueText: '<span style="color:lightgreen;">да</span>',
                xtype   : 'booleancolumn',
                minWidth : 130
            }
        ],
        store   : {
            fields: [
                'id', 'owner', 'isActive', 'hasPrivateKey', 'isForEncryption', 'content',
                'hash', 'validFrom', 'validThrough', 'isLocal'
            ],
            data  : [],
            proxy : {
                type: 'memory'
            }
        }
    }

});