Ext.define('COURIERONLINE.view.Main', {
    extend  : 'Ext.container.Container',
    alias   : 'widget.appMain',
    requires: [
        'COURIERONLINE.store.Navigator',
        'COURIERONLINE.store.Notice',
        'COURIERONLINE.store.News',
        'Ext.tab.Panel',
        'Ext.layout.container.Border',
        'COURIERONLINE.view.Header',
        'COURIERONLINE.view.Filter',
        'COURIERONLINE.view.Footer',
        'COURIERONLINE.view.Navigator',
        'COURIERONLINE.view.Notice',
        'COURIERONLINE.view.News',
        'COURIERONLINE.view.Workspace'
    ],

    layout: {
        type: 'border'
    },
    cls: 'page-background',

    bodyBorder: false,

    items: [
        {
            margin: '0 30',
            region: 'north',
            xtype : 'appHeader',
            height: 140
        },
        {
            region: 'west',
            margin: '0 0 50 30',
            width : 230,
            border: 0,
            layout: {
                type: 'vbox',
                align : 'stretch',
                pack  : 'start'
            },
            items: [
                {
                    xtype : 'appNavigator'
                },
                {
                    xtype : 'appNews'
                },
                {
                    xtype : 'appNotice'
                }
            ]
        },
        {
            region: 'center',
            margin: '0 30 50 0',
            xtype: 'container',
            layout: {type: 'border'},
            items: [
                {region: 'north', xtype: 'appFilter'},
                {region: 'center', xtype : 'appWorkspace'}
            ]
        },
        {
            region: 'south',
            xtype : 'appFooter'
        },
        {
            title: 'Обработка данных',
            autoHide : false,
            closable : false,
            draggable: false,
            xtype: 'tooltip',
            itemId: 'footerpbTooltip',
            width: 320,
            height: 50,
            hidden: true,
            items: [
                {
                    xtype: 'progressbar',
                    itemId: 'footerpb',
                    width: 300
                }
            ]
        }
    ]
});