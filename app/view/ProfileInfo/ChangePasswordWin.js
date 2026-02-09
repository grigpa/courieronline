Ext.define('COURIERONLINE.view.ProfileInfo.ChangePasswordWin', {
    extend: 'Ext.Window',

    alias: 'widget.changePasswordWin',

    requires: ['COURIERONLINE.view.ProfileInfo.ChangePasswordForm'],

    width    : 400,
    minHeight: 200,
    height   : 200,
    layout   : {
        type: 'fit'
    },

    title: 'Смена пароля',

    items: {
        xtype: 'changePasswordForm'
    }

});