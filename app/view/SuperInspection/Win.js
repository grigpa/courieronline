Ext.define('COURIERONLINE.view.SuperInspection.Win', {
    extend  : 'Ext.Window',
    requires: ['COURIERONLINE.view.SuperInspection.Form'],

    alias: 'widget.superInspectionWin',

    minHeight: 300,
    width    : 660,
    minWidth : 650,
    layout   : {
        type: 'fit'
    },

    initComponent: function () {
        var record = this.record;

        Ext.apply(this, {
            title: 'Редактирование: ',
            items: {
                xtype: 'superInspectionForm',
                record: record
            }
        });
        this.callParent();
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