Ext.define('COURIERONLINE.view.Organization.Win', {
    extend  : 'Ext.Window',
    requires: ['COURIERONLINE.view.Organization.Form'],

    alias: 'widget.organizationWin',

    width     : 660,
    minWidth  : 650,
    height    : 600,
    minHeight : 600,
    layout    : {
        type: 'fit'
    },

    title: 'Новая организация...',

    items: {
        xtype: 'organizationForm'
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