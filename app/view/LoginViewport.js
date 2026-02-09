Ext.define('COURIERONLINE.view.LoginViewport', {
    extend  : 'Ext.container.Viewport',
    requires: [
        'Ext.layout.container.Fit',
        'Ext.layout.container.Border',
        'Ext.tab.Panel',
        'COURIERONLINE.view.Login',
        'COURIERONLINE.view.Header',
        'COURIERONLINE.view.Footer'
    ],

    layout: 'fit',

    items: {
        layout    : 'fit',
        autoScroll: true,
        defaults  : {
            minWidth : 600,
            minHeight: 700
        },
        items     : {
            layout : {
                type: 'border'
            },
            cls    : 'page-background',
            bodyCls: 'login-page-background',

            bodyBorder: false,

            items: [
                {
                    margin: '0 30',
                    region: 'north',
                    layout: {
                        type: 'border'
                    },

                    border: false,

                    items : [
                        {
                            region: 'center',
                            height: 80,
                            border: false,
                            xtype : 'panel',
                            layout: {
                                type: 'border'
                            },
                            items : [
                                {
                                    xtype : 'container',
                                    region: 'center',
                                    layout: 'fit',
                                    items : {
                                        xtype: 'container',
                                        cls: 'b-logo'
                                    }
                                }
                            ]
                        }
                    ],
                    height: 140
                },
                {
                    region: 'south',
                    xtype : 'appFooter'
                }
            ]
        }
    }
});