/**
 * Окно для подписи и отправке подписанных пакетов
 */
Ext.define('COURIERONLINE.view.SendWin', {
    extend: 'Ext.Window',

    alias: 'widget.sendWin',

    width  : 500,
    height : 300,
    title  : 'Отправка',
    closable: false,
    layout: {
        type: 'fit'
    },
    buttons: [
        {text: 'OK', itemId: 'ok'},
        {text: 'Отмена', itemId: 'cancel'}
    ],
    items:[
        {
            xtype: 'displayfield',
            value: 'Внимание! Будут подписаны следующие документы:',
            cls: 'sendWinLabel',
            height: 50,
            border: 0
        },
        {
        xtype   : 'gridpanel',
//        title   : 'Внимание! Будут подписаны следующие документы:',
        forceFit: true,
        store   : Ext.create('Ext.data.Store', {
            fields: ['id', 'name', 'url']
        }),
        columns : [
            {text: 'Отчет', dataIndex: 'name'},
            {text: 'Отчетный период', dataIndex: 'url'}
        ]
    }
    ]

});