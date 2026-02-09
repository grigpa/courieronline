Ext.define('COURIERONLINE.view.Filter', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.appFilter',

    ui      : 'shadow',
    hidden  : true,
    height  : 55,
    layout  : 'hbox',
    margin  : '0 0 20 0',
    style   : {
        'border-bottom': '1px solid #A8ACB0'
    },
    defaults: {
        margin    : '15 5',
        height    : 27,
        labelAlign: 'right'
    },
    items   : [
        {
            xtype     : 'combo',
            fieldLabel: 'Документы',
            labelWidth: 100,
            flex      : 1
        },
        {
            xtype       : 'datefield',
            width       : 120,
            labelWidth  : 30,
            triggerWidth: 22,
            fieldLabel  : 'C'
        },
        {
            xtype       : 'datefield',
            width       : 120,
            labelWidth  : 30,
            triggerWidth: 22,
            fieldLabel  : 'По'
        },
        {
            xtype: 'button',
            width: 100,
            ui: 'bordered',
            scale: 'small',
            text : 'Показать'
        }
    ]

});