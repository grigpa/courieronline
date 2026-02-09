Ext.define('COURIERONLINE.view.ProfileInfo.ChangePasswordForm', {
    extend: 'Ext.form.Panel',

    alias: 'widget.changePasswordForm',

    defaults: {
        margin    : '10 10 0 10',
        labelWidth: 200
    },
    items   : [
        {
            xtype           : 'textfield',
            fieldLabel      : 'Старый пароль',
            allowBlank      : false,
            maxLength       : 100,
            enforceMaxLength: 100,
            inputType       : 'password',
            name            : 'oldPass'
        },
        {
            xtype           : 'textfield',
            fieldLabel      : 'Новый пароль',
            allowBlank      : false,
            maxLength       : 100,
            enforceMaxLength: 100,
            inputType       : 'password',
            itemId          : 'newPass',
            name            : 'newPass'
        },
        {
            xtype           : 'textfield',
            fieldLabel      : 'Подтверждение пароля',
            allowBlank      : false,
            maxLength       : 100,
            enforceMaxLength: 100,
            inputType       : 'password',
            vtype           : 'password',
            initialPassField: 'newPass',
            name            : 'confirmPass'
        },
        {
            xtype : 'button',
            itemId: 'changePassword',
            text  : 'Сохранить'
        }
    ]

});