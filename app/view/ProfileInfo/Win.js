Ext.define('COURIERONLINE.view.ProfileInfo.Win', {
    extend  : 'Ext.Window',

    alias: 'widget.operatorInfoWin',

    width : 800,
    height: 500,
    layout: {
        type: 'fit'
    },

    title: 'Профиль',
    defaults: {
        border  : false
    },

    buttons: [
        {
            text  : 'Сохранить',
            itemId: 'save'
        },
        {
            text  : 'Закрыть',
            itemId: 'close'
        }
    ],

    save: function () {
        var win = this;
        var forms = win.query('#info, #postSettings');
        var formsToSaveCount = forms.length;
        Ext.each(forms, function (form) {
            if (!form.isValid()) {
                return;
            }

            var record = form.getRecord(),
                values = form.getValues();

            delete record.data.id;
            delete record.modified.id;

            if (form.itemId === 'info') {
                Ext.each(win.query('grid[name!=]'), function (grid) {
                    var keys = grid.getStore().getRange();
                    values[grid.name] = Ext.pluck(keys, 'data');
                });
            }

            record.set(values);
            record.setDirty();
            if (!record.isValid()) {
                return;
            }
            record.save({
                success: function () {
                    formsToSaveCount--;
                    if (formsToSaveCount === 0) {
                        win.data = Ext.encode(win.getValues());
                        win.close();
                    }
                }
            });
        });
    },

    onBeforeClose: function () {
        var win = this, values = win.getValues();

        var hasChanges = win.data && win.data !== Ext.encode(values);

        if (hasChanges) {
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
        }
        return !hasChanges;
    }

});