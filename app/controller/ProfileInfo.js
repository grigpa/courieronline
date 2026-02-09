/**
 * Контроллер для управления окном с информацией о текущем пользовател-операторе
 */
Ext.define('COURIERONLINE.controller.ProfileInfo', {
    extend: 'Ext.app.Controller',

    requires: [
        'COURIERONLINE.view.ProfileInfo.Win',
        'COURIERONLINE.view.ProfileInfo.ChangePasswordWin',
        'COURIERONLINE.model.OperatorInfo',
        'COURIERONLINE.model.AppInfo',
        'COURIERONLINE.model.ClientInfo',
        'COURIERONLINE.model.PostServerInfo'
    ],

    views: ['ProfileInfo.ClientForm', 'ProfileInfo.OperatorForm', 'ProfileInfo.Win'],

    init: function () {
        var me = this;
        me.control({
            'operatorInfoWin #save' : {
                click: me.save
            },
            'operatorInfoWin #close' : {
                click: function (button) {
                    button.up('window').close();
                }
            },
            'changePasswordForm #changePassword': {
                click: me.changePassword
            },
            'operatorInfoForm #changePassword': {
                click: me.changeOperatorPassword
            }
        });

        this.getApplication().on({
            scope          : this,
            showProfileInfo: me.showProfileInfo
        });
    },

    changePassword: function (obj) {
        var form = obj.up('form');
        if (!form || !form.isValid()) {
            return;
        }
        var values = form.getValues();

        Ext.Ajax.request({
            method: 'POST',
            params: {
                action: 'invoke',
                obj: 'profile',
                mth: 'changePassword',
                data: Ext.encode(values)
            },
            url: Ext.global.baseUrl,
            success: function (response) {
                var win = form.up('window');
                if (win) {
                    win.close();
                }
                Ext.log(response);
            }
        });
    },

    changeOperatorPassword: function () {
        var win = Ext.create('COURIERONLINE.view.ProfileInfo.ChangePasswordWin');
        win.show();
    },

    save: function (button) {
        var win = button.up('window');
        win.save();
    },

    showProfileInfoLazy: function () {
        var me = this;
        setTimeout(function () {
            me.showProfileInfo();
        }, 500);
    },

    showProfileInfo: function () {
        var me = this;
        var formXType, ProfileInfo, ServerInfo;
        var user = me.getApplication().user;
        if (user && user.isOperator()) {
            ServerInfo = Ext.ModelManager.getModel('COURIERONLINE.model.PostServerInfo');
            ProfileInfo = Ext.ModelManager.getModel('COURIERONLINE.model.OperatorInfo');
            formXType = 'operatorInfoForm';
        } else if (user && user.isClient()) {
            ProfileInfo = Ext.ModelManager.getModel('COURIERONLINE.model.ClientInfo');
            formXType = 'clientInfoForm';
        } else {
            return;
        }
        var AppInfo = Ext.ModelManager.getModel('COURIERONLINE.model.AppInfo');

        var win = Ext.create('COURIERONLINE.view.ProfileInfo.Win', {
            items: {
                cls: 'b-profile-info',
                xtype: formXType
            }
        });
        win.setTitle('Профиль - ' + me.getApplication().user.get('fullName'));
        win.show();

        ProfileInfo.load({}, {
            success: function (record) {
                Ext.each(win.query('grid[name!=]'), function (grid) {
                    grid.getStore().loadRawData(record.get(grid.name));
                });
                win.down('#info').loadRecord(record);
                win.memento();
            }
        });

        if (ServerInfo) {
            ServerInfo.load({}, {
                failure: function () {
                    Ext.log(arguments);
                },
                success: function (record) {
                    win.down('#postSettings').loadRecord(record);
                    win.memento();
                }
            });
        }

        AppInfo.load({}, {
            success: function (record) {
                win.down('#appInfo').loadRecord(record);
                win.memento();
            }
        });
    }

});