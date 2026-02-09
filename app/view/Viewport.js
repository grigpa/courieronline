Ext.define('COURIERONLINE.view.Viewport', {
    extend  : 'Ext.container.Viewport',
    requires: [
        'Ext.layout.container.Fit',
        'COURIERONLINE.view.Main',
        'COURIERONLINE.view.Login'
    ],

    layout: 'fit',

    items: {
        layout    : 'fit',
        autoScroll: true,
        items     : {
            minWidth : 800,
            minHeight: 600,
            xtype    : 'appMain'
        }
    }
});