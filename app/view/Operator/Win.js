Ext.define('COURIERONLINE.view.Operator.Win', {
    extend  : 'Ext.Window',
    requires: ['COURIERONLINE.view.Operator.Form'],

    alias: 'widget.operatorWin',

    width     : 660,
    minWidth  : 650,
    height    : 400,
    minHeight : 300,

    layout: {
        type: 'fit'
    },

    title: 'Новый оператор...',

    items: {
        xtype: 'operatorForm'
    },

    buttons: [
        {
            text  : 'Сохранить',
            itemId: 'save'
        },
        {
            text  : 'Закрыть',
            itemId: 'close'
        }
    ]

});