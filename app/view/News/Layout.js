Ext.define('COURIERONLINE.view.News.Layout', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.newsLayout',
    layout: {
        type: 'fit',
        align: 'stretch'
    },


    items: [
        {
            layout: 'border',
            border: 0,
            defaults: {
                border: 0
            },

            items: [
                {
                    region: 'south',
                    itemId: 'southNews',
                    height: 150,
                    hidden: true,
                    cmargins: '5 0 0 0',
                    padding: 10,
                    html: 'текст новости'
                },
                {
                    region: 'east',
                    itemId: 'eastNews',
                    padding: 10,
                    margins: '5 0 0 0',
                    cmargins: '5 5 0 0',
                    width: 175,
                    hidden: true,
                    html: 'текст новости'
                },
                {
                    region: 'center',
                    margins: '5 0 0 0',
                    itemId: 'eastCenter',
                    layout: {
                        type: 'vbox',
                        align : 'stretch',
                        pack  : 'start'
                    },
                    items: [
                        {
                            xtype: 'radiogroup',
                            margins: '10 0 10 20',
                            vertical: true,
                            layout: {
                                type: 'vbox',
                                align : 'stretch'
                            },
                            itemId: 'selectLayoutNews',
                            cls: 'selectLayoutNews',
                            items: [
                                {
                                    boxLabel: 'по горизонтали',
                                    name: 'rb',
                                    inputValue: '1'
                                },
                                {
                                    boxLabel: 'по вертикали',
                                    name: 'rb',
                                    inputValue: '2'
                                }
                            ]
                        },
                        {
                            xtype: 'newsGrid',
                            itemId: 'newsGrid'
                        }
                    ]
                }
            ]
        }
    ]

});

