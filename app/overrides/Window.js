Ext.define('COURIERONLINE.overrides.Window', {
    override     : 'Ext.window.Window',
    ghost        : false,
    stateful     : true,
    constrain    : true,
    minHeight    : 200,
    modal        : true,
    minWidth     : 400,
    padding      : '30 40 20 40',

    header: {
        height : 50,
        iconCls: 'icon-doc'
    },

    initComponent: function () {
        this.stateId = this.alias;
        this.on('beforeclose', this.onBeforeClose, this);
        this.on('beforeshow', this.onBeforeShow, this);
        this.callParent();
    },


    onBeforeShow: function () {
        if (this.title !== '') {
            this.setTitle(this.title);
        }
    },

    onBeforeClose: function () {
        var win = this,
            values = win.getValues(),
            form = win.down('form'),
            record = form && form.getRecord(),
            store = record && record.store;

        var hasChanges = win.data && win.data !== Ext.encode(values);

        if (hasChanges) {
            if (store) {
                Ext.Msg.show({
                    title  : 'Внимание',
                    msg    : 'Сохранить изменения?',
                    icon   : Ext.MessageBox.QUESTION,
                    buttons: Ext.Msg.YESNO,
                    fn     : function (btn) {
                        if (btn === 'yes') {
                            win.save();
                        }
                        if (btn === 'no') {
                            win.doClose();
                        }
                    }
                });
            } else {
                Ext.Msg.show({
                    title  : 'Внимание',
                    msg    : 'Закрыть без сохранения изменений?',
                    icon   : Ext.MessageBox.QUESTION,
                    buttons: Ext.Msg.OKCANCEL,
                    fn     : function (btn) {
                        if (btn === 'ok') {
                            win.doClose();
                        }
                    }
                });
            }
        }
        return !hasChanges;
    },

    /**
     * Сохранение первоначального состояния данных в окне
     */
    memento: function () {
        this.data = Ext.encode(this.getValues());
    },

    getValues: function () {
        var win = this,
            forms = win.query('form'),
            values = {};

        Ext.each(forms, function (form, i) {
            values[i] = form.getValues(false, false, false, true);
        });
        Ext.each(win.query('grid[name!=]'), function (grid) {
            var keys = grid.getStore().getRange();
            values[grid.name] = Ext.pluck(keys, 'data');
        });

        return values;
    },

    loadRecord: function (record) {
        var win = this;
        var form = win.down('form');
        if (form) {
            form.loadRecord(record);
        }
        Ext.each(win.query('grid[name!=]'), function (grid) {
            grid.getStore().loadRawData(record.get(grid.name));
        });
        win.memento();
    },

    /**
     *
     * @param [isNeedSync]
     */
    save: function (isNeedSync, _store) {
        var win = this,
            form = win.down('form'),
            record = form.getRecord(),
            values = form.getValues(false, false, false, true);
        var store;
        if (_store) {
            store = _store;
        } else {
            store = record.store;
        }


        if (!form.isValid()) {
            return;
        }

        Ext.each(form.query('grid[name!=]'), function (grid) {
            var keys = grid.getStore().getRange();
            values[grid.name] = Ext.pluck(keys, 'data');
        });

        record.set(values);
        record.setDirty();
        if (!record.isValid()) {
            return;
        }

        if (record.phantom) {
            store.add(record);
        }

        win.memento();

        if (isNeedSync === false) {
            win.close();
            return;
        }
        store.getProxy().on('exception', function (param, response) {
            if (response && response.responseText) {
                Ext.MessageBox.error(response.responseText);
            }
        }, {single: true});

        store.sync({
            success: function () { win.close(); },
            callback: function () { store.load(); }
        });
    }
});