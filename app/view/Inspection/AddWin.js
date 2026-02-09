Ext.define('COURIERONLINE.view.Inspection.AddWin', {
    extend  : 'Ext.Window',
    requires: ['COURIERONLINE.view.Inspection.Form'],

    alias: 'widget.inspectionAddWin',

    width: 700,
    layout: {
        type: 'fit'
    },

    title: 'Создание новой инспекции',

    items: {
        xtype: 'togsForm'
    },

    buttons: [
        {
            text: 'Сохранить',
            itemId: 'save'
        },
        {
            text: 'Закрыть',
            itemId: 'close'
        }
    ]

});