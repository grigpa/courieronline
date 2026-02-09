Ext.define('COURIERONLINE.view.Footer', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.toolbar.Spacer'
    ],

    alias: 'widget.appFooter',

    height  : 50,
    layout  : {
        type : 'hbox',
        align: 'middle'
    },
    ui      : 'blue',
    items   : [
        {
            xtype : 'container',
            html  : 'ЗАО "Удостоверяющий центар" www.nwudc.ru',
            margin: '0 0 0 30'
        },
        {
            xtype: 'panel',
            frame : false,
            border: false,
            plain: true,
            bodyStyle: 'background-color: transparent',
            flex: 3,

            layout: {
                align: 'middle',
                pack: 'center',
                type: 'hbox'
            }
        },
        {
            xtype : 'container',
            margin: '0 30 0 0',
            html  : 'Техподдержка: (812) 578-01-96 email: udc@mail.ru'
        }
    ]

});
