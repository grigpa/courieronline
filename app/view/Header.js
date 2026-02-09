Ext.define('COURIERONLINE.view.Header', {
    extend: 'Ext.panel.Panel',

    requires: [
        'Ext.ux.form.SearchField',
        'Ext.toolbar.Spacer'
    ],

    alias: 'widget.appHeader',

    layout: {
        type: 'border'
    },

    border: false,
    initComponent: function () {
        var me = this;
        var store = COURIERONLINE.getApplication().getStore('Documents');
        Ext.apply(me, {
            items: [
                {
                    region: 'center',
                    height: 80,
                    border: false,
                    xtype : 'container',
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
                                cls  : 'b-logo'
                            }
                        },
                        {
                            xtype : 'container',
                            region: 'east',
                            items : {
                                margin: 15,
                                xtype : 'panel',
                                height: 60,
                                ui    : 'shadow',
                                layout: 'hbox',
                                items : [
                                    {
                                        layout  : 'border',
                                        border  : false,
                                        height  : 50,
                                        width   : 150,
                                        margin  : '5 0 0 5',
                                        style   : {
                                            'border-right': '1px solid black'
                                        },
                                        defaults: {
                                            xtype: 'container'
                                        },
                                        items   : [
                                            {
                                                region: 'center',
                                                margin: '5 3 3 10',
                                                cls   : 'userInfo',
                                                itemId: 'userInfo',
                                                html  : ''
                                            },
                                            {
                                                margin: '3 3 10 10',
                                                region: 'south',
                                                itemId: 'certificatesInfo',
                                                cls   : 'certificatesInfo',
                                                html  : 'Сертификаты'
                                            }
                                        ]
                                    },
                                    {
                                        xtype    : 'button',
                                        height   : 50,
                                        width    : 55,
                                        margin   : '5 5 5 5',
                                        ui       : 'plain',
                                        scale    : 'medium',
                                        iconAlign: 'top',
                                        iconCls  : 'exit-icon',
                                        itemId   : 'logout',
                                        text     : 'Выход'
                                    }
                                ]
                            }
                        }
                    ]
                },
                {
                    region  : 'south',
                    xtype   : 'panel',
                    ui      : 'blue',
                    height  : 50,
                    layout  : {
                        type   : 'hbox',
                        padding: 5,
                        align  : 'middle'
                    },
                    defaults: {
                        margin    : '0 5 0 10',
                        labelStyle: 'color:white',
                        labelAlign: 'right'
                    },
                    items   : [
                        {
                            xtype: 'button',
                            ui: 'header',
                            itemId: 'newDoc',
                            scale: 'medium',
                            iconCls: 'icon-doc',
                            multiple: 'multiple',
                            hidden: true,
                            style: {padding: '3px 5px'},
                            text: Msg.newDoc,
                            width: 170,
                            padding: null,
                            menu: [
                                {
                                    text: Msg.create,
                                    width: 115,
                                    action: 'create'
                                },

                                {
                                    text: Msg.importMsg,
                                    width: 115,
                                    action: 'import'
                                },
                                {

                                    xtype: 'form',
                                    itemId: 'importform',
                                    ui: '',

                                    border: false,
                                    hidden: true,
                                    errorReader: Ext.create('Ext.ux.ErrorReader'),
                                    items: {
                                        hidden: true,
                                        xtype: 'filefield',
                                        itemId: 'importXml',
                                        buttonText: Msg.importMsg,
                                        buttonConfig: {
                                            id: 'importXmlBtn',
                                            multiple: 'multiple',
                                            acceptedTypes: 'application/xml'
                                        },
                                        buttonOnly: true,
                                        margin: 0
                                    }

                                }
                            ]
                        },
                        {xtype: 'tbspacer', flex: 1 },
                        {
                            xtype   : 'button',
                            scale   : 'medium',
                            itemId  : 'show-menu-btn',
                            hidden  : true,
                            padding : null,
                            ui      : 'header-menu',
                            menu    : [],
                            text    : 'Расширенный поиск'
                        },
                        {xtype: 'tbspacer', flex: 3 },
                        {
                            xtype     : 'searchfield',
                            fieldLabel: 'Поиск',
                            width: 300,
                            store: store
                        }
                    ]
                }
            ]
        });

        me.callParent();
    }

});