/**
 * Контролллер для управления компонентами связанными с сертификатами
 */
Ext.define('COURIERONLINE.controller.Keys', {
    extend: 'COURIERONLINE.controller.Base',

    views: ['Key.Win', 'Key.Form', 'Key.Grid'],

    refs: [
        { ref: 'keyGrid', selector: 'keyGrid'},
        { ref: 'addCertificateForm', selector: 'keyGrid #addCertificateForm'}
    ],

    init: function () {
        var me = this;
        this.control({
            'keyGrid'          : {
                itemdblclick: me.editKey
            },
            'keyGrid #certfile': {
                'change': this.addCertificate
            },
            'keyGrid #remove'  : {
                click: function () {
                    var record = me.getKeyGrid().getSelectionModel().getLastSelected();
                    me.getKeyGrid().getStore().remove(record);
                }
            },
            'keyGrid #download': {
                click: me.downloadKey
            },
            'keyWin #add'      : {
                click: me.addKey
            },
            'keyWin #save'      : {
                click: me.saveKey
            },
            'keyWin #close'    : {
                click: function (button) {
                    button.up('window').close();
                }
            }
        });
    },

    downloadKey: function () {
        var record = this.getKeyGrid().getSelectionModel().getLastSelected();
        if (!record) {
            return;
        }

        var form = Ext.create('Ext.form.Panel', {
            renderTo      : Ext.getBody(),
            autoEl        : {
                tag   : 'form',
                action: Ext.global.baseUrl,
                target: 'loginframe'
            },
            standardSubmit: true,
            method        : 'GET',
            defaults      : {
                xtype: 'hiddenfield'
            },
            items         : [
                { name: 'action', value: 'invoke' },
                { name: 'mth', value: 'exportCertificate' },
                { name: 'obj', value: 'docRoutes' },
                { name: 'id', value: record.get('id') }
            ]
        });
        form.getEl().dom.submit();
    },

    addCertificate: function () {
        var me = this;
        var form = this.getAddCertificateForm().getForm();
        if (form.isValid()) {
            var baseParams = {
                action: 'invoke',
                obj   : 'admin',
                mth   : 'loadCertificate'
            };
            form.submit({
                url    : Ext.global.baseUrl + '?' + Ext.Object.toQueryString(baseParams),
                waitMsg: Msg.fileUploading,
                success: function (fp, o) {
                    Ext.log(arguments);
                    var store = me.getKeyGrid().getStore();
                    var records = Ext.decode(o.response.responseText, true);
                    if (records) {
                        records = Ext.Array.from(records);
                        Ext.each(records, function (record) {
                            record.isActive = true;
                            record.isForEncryption = true;
                        });
                        store.loadRawData(records, true);

                        /**
                         * Открываем на редактирование загруженный сертификат
                         */
                        var win = me.openKeyWin();
                        win.loadRecord(store.getAt(store.getCount() - 1));
                    }
                },
                failure: function (fp, o) {
                    Ext.log(arguments);
                    var response = o.response && Ext.decode(o.response.responseText, true);
                    var msg = (response && response.msg ? response.msg : o.response.responseText);
                    Ext.Msg.error(msg);
                }
            });
        }
    },

    editSelectedKey: function () {
        var record = this.getKeyGrid().getSelectionModel().getLastSelected();
        if (record) {
            this.editKey(this.getKeyGrid(), record);
        }
    },

    addKey: function (button) {
        var win = button.up('window'),
            form = win.down('form'),
            record = form.getRecord(),
            values = form.getValues();

        if (!form.isValid()) {
            return;
        }
        if (record) {
            record.set(values);
            this.getKeyGrid().getStore().remove(record);
        }
        this.getKeyGrid().getStore().add(values);

        win.close();
    },

    openKeyWin: function () {
        var win = Ext.create('COURIERONLINE.view.Key.Win');
        win.setTitle(Msg.editKey);
        return win.show();
    },

    editKey: function (grid, record) {
        var win = this.openKeyWin();
        win.loadRecord(record);
    },

    saveKey: function (button) {
        var win = button.up('window');
        win.save(false);
    }

});