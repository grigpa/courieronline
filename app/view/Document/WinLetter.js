/**
 * Окно отправки письма
 */
Ext.define('COURIERONLINE.view.Document.WinLetter', {

    extend: 'Ext.Window',

    alias: 'widget.documentWinLetter',

    requires: [
        'Ext.ux.form.MultiUpload'
    ],

    layout: {
        type: 'fit'
    },
    width: 800,
    height: 600,
    buttons: [
        {
            itemId: 'save',
            iconCls: 'icon-accepted',
            text: 'Сохранить'
        },
        {
            itemId: 'close',
            iconCls: 'icon-rejected',
            text: 'Закрыть'
        }
    ],

    initComponent: function () {
        var me = this;
        var mu = new Ext.ux.form.MultiUpload();
        mu.fileslist = [];
        var apArr = [];

        if (Ext.isDefined(me.attachments)) {

            Ext.each(me.attachments, function (attach) {
                var filename = attach.name;
                var size = attach.size;
                var ap = Ext.create('Ext.form.Panel', {
                    frame: false,
                    border: 0,
                    padding: 2,
                    margin: '0 10 0 0',

                    layout: {
                        type: 'hbox',
                        align: 'middle'
                    },
                    items: [

                        {
                            xtype: 'image',
                            listeners: {
                                render: function (me/*, eOpts*/) {
                                    var ext = filename.substr(filename.lastIndexOf('.') + 1);
                                    me.setSrc('resources/icons/extensions/' + ext.toLowerCase() + '.png');
                                }
                            }
                        },
                        {
                            xtype: 'label',
                            width: 200,
                            margin: {top: -20, left: 5, right: 5, bottom: 5},
                            cls: 'labelAttach',
                            itemId: 'labelAttach',
                            attachId: attach.id,
                            listeners: {
                                render: function (me/*, eOpts*/) {

                                    me.getEl().on('click', function () {
                                        var form = Ext.create('Ext.form.Panel', {
                                            renderTo: Ext.getBody(),
                                            autoEl: {
                                                tag: 'form',
                                                action: Ext.global.baseUrl,
                                                target: 'loginframe'
                                            },
                                            standardSubmit: true,
                                            method: 'GET',
                                            defaults: {
                                                xtype: 'hiddenfield'
                                            },
                                            items: [
                                                { name: 'action', value: 'invoke' },
                                                { name: 'mth', value: 'getAttachLetter' },
                                                { name: 'obj', value: 'docRoutes' },
                                                { name: 'id', value: me.attachId }
                                            ]
                                        });
                                        form.getEl().dom.submit();
                                    });

                                    function stringSize(obj, str) {
                                        var s = document.createElement("span");
                                        s.innerHTML = str;
                                        s.style.visibility = "hidden";
                                        s.style.whiteSpace = "nowrap";
                                        obj.appendChild(s);
                                        var res = {width: s.offsetWidth, height: s.offsetHeight};
                                        obj.removeChild(s);
                                        return res;
                                    }

                                    function truncString(obj, str) {
                                        while (stringSize(obj, str).width > 100) {
                                            str = str.substr(0, str.length - 1);
                                        }
                                        return str;
                                    }


                                    if (stringSize(me.getEl().dom, filename).width > 180) {
                                        me.setText(
                                            truncString(me.getEl().dom, filename.substr(0, filename.lastIndexOf('.') - 1))
                                                + '...' + filename.substr(filename.lastIndexOf('.') + 1)
                                                + ' (' + size + ')'
                                        );
                                    } else {
                                        me.setText(filename + ' (' + size + ')');
                                    }
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            text: null,
                            border: 0,
                            frame: false,
                            iconCls: 'icon-delete-white',
                            attachId: attach.id,
                            tooltip: 'Удалить',
                            listeners: {
                                click: function (me/*, e, eOpts*/) {

                                    Ext.Msg.confirm(Msg.attention, Msg.confirmRemoveAttach, function (btn) {
                                        if (btn === 'yes') {
                                            Ext.Ajax.request({
                                                url: Ext.global.baseUrl,
                                                method: 'POST',
                                                params: {
                                                    action: 'invoke',
                                                    mth: 'deleteAttachLetter',
                                                    obj: 'docRoutes',
                                                    id: me.attachId
                                                },
                                                callback: function () {
                                                    var currentform = me.up('form');
                                                    var mainform = currentform.up('form');
                                                    var lbl = currentform.down('label');
                                                    mu.fileslist.pop(lbl.text);
                                                    mainform.remove(currentform);
                                                    currentform.destroy();
                                                    mainform.doLayout();
                                                }
                                            });
                                        }
                                    }, this);


                                }
                            }

                        }
                    ]
                });

                apArr.push(ap);

            }, this);


        }

        Ext.apply(this, {
            title: 'Письмо в Росстат',
            items: {
                xtype: 'panel',
                items: [
                    {
                        xtype: 'form',
                        border: 0,
                        itemId: 'letterForm',
                        bodyPadding: 10,

                        fieldDefaults: {
                            labelWidth: 150,
                            anchor: '100%'
                        },

                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Кому',
                                hidden: true,
                                name: 'to'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: 'Тема',
                                name: 'subject',
                                allowBlank: false,
                                value: me.subject || ''
                            },
                            {
                                xtype: 'textarea',
                                fieldLabel: 'Текст письма',
                                emptyText: 'Текст письма',
                                hideLabel: true,
                                height: 140,
                                name: 'message',
                                allowBlank: false,
                                value: me.details || '',
                                style: 'margin:0',
                                flex: 1
                            },
                            {
                                bodyPadding: 5,
                                itemId: 'attachFiles',
                                border: 0,
                                items: [mu]
                            },
                            {
                                bodyPadding: 5,
                                border: 0,
                                itemId: 'attachPanel',
                                items: apArr
                            }
                        ]
                    }
                ]
            }
        });


        this.callParent();
    }
});