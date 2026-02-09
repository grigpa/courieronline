Ext.define('COURIERONLINE.view.Key.Win', {
    extend  : 'Ext.Window',
    requires: ['COURIERONLINE.view.Key.Form'],

    alias: 'widget.keyWin',

    width: 400,
    layout: {
        type: 'fit'
    },

    title: 'Добавить ключ',

    items: {
        xtype: 'keyForm'
    },

    buttons: [
        {
            text: 'OK',
            itemId: 'save'
        },
        {
            text: 'Закрыть',
            itemId: 'close'
        }
    ]

});