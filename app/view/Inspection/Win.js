Ext.define('COURIERONLINE.view.Inspection.Win', {
    extend  : 'Ext.Window',
    requires: ['COURIERONLINE.view.Inspection.Form'],

    alias: 'widget.inspectionWin',

    width   : 660,
    minWidth: 650,
    layout: {
        type: 'fit'
    },

    title: 'Редактирование: ',

    items: {
        xtype: 'inspectionForm'
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