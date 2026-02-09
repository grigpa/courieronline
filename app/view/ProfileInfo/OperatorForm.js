Ext.define('COURIERONLINE.view.ProfileInfo.OperatorForm', {
    extend: 'Ext.Panel',

    alias: 'widget.operatorInfoForm',

    layout: {
        type: 'fit'
    },

    requires: [
        'COURIERONLINE.view.Key.Grid',
        'COURIERONLINE.view.ProfileInfo.ChangePasswordWin',
        'COURIERONLINE.view.ProfileInfo.AppInfoForm',
        'Ext.ux.GroupTabPanel'
    ],

    items: {
        xtype: 'grouptabpanel',

        items: [
            {
                items: {
                    title   : Msg.edoTitle,
                    itemId  : 'info',
                    xtype   : 'form',
                    defaults: {
                        margin    : '10 10 0 10',
                        labelWidth: 200
                    },
                    items   : [
                        {
                            xtype     : 'textfield',
                            name      : 'name',
                            maxLength : 255,
                            fieldLabel: 'Наименование'
                        },
                        {
                            xtype     : 'textfield',
                            name      : 'statSubjectId',
                            allowBlank: false,
                            fieldLabel: 'Идентификатор субъекта для обмена с Росстат'
                        },
                        {
                            xtype     : 'textfield',
                            name      : 'pfrSubjectId',
                            fieldLabel: 'Идентификатор субъекта для обмена с ПФР'
                        },
                        {
                            xtype     : 'textfield',
                            name      : 'login',
                            maxLength : 100,
                            fieldLabel: 'Логин'
                        },
                        {
                            xtype: 'button',
                            itemId: 'changePassword',
                            text: 'Сменить пароль'
                        }
                    ]
                }
            },
            {
                items: {
                    title : 'Сертификаты',
                    layout: 'anchor',
                    items : [
                        {
                            header   : '',
                            margin   : 10,
                            anchor   : '100% 0',
                            name     : 'certificates',
                            minHeight: 150,
                            xtype    : 'keyGrid'
                        }
                    ]
                }
            },
            {
                items: {
                    title   : 'Почтовый сервер ТОГС',
                    itemId  : 'postSettings',
                    xtype   : 'form',
                    defaults: {
                        margin    : '10 10 0 10',
                        labelWidth: 200
                    },
                    items   : [
                        {
                            xtype     : 'textfield',
                            fieldLabel: 'Адрес сервера POP3',
                            maxLength : 50,
                            name      : 'pop3Host'
                        },
                        {
                            xtype     : 'textfield',
                            fieldLabel: 'Адрес сервера SMTP',
                            maxLength : 50,
                            name      : 'smtpHost'
                        },
                        {
                            xtype           : 'textfield',
                            fieldLabel      : 'Порт POP3',
                            maxLength       : 4,
                            enforceMaxLength: 4,
                            maskRe          : /\d/,
                            name            : 'pop3Port'
                        },
                        {
                            xtype           : 'textfield',
                            fieldLabel      : 'Порт SMTP',
                            maxLength       : 4,
                            enforceMaxLength: 4,
                            maskRe          : /\d/,
                            name            : 'smtpPort'
                        },
                        {
                            xtype     : 'textfield',
                            fieldLabel: Msg.email,
                            maxLength : 50,
                            vtype     : 'email',
                            name      : 'address'
                        },
                        {
                            xtype     : 'textfield',
                            fieldLabel: Msg.login,
                            maxLength : 10,
                            name      : 'login'
                        },
                        {
                            xtype     : 'textfield',
                            inputType : 'password',
                            fieldLabel: 'Пароль',
                            enforceMaxLength: 100,
                            maxLength : 100,
                            name      : 'password'
                        }
                    ]
                }
            },
            {
                items: {
                    title   : 'О программе',
                    xtype   : 'appInfoForm'
                }
            }

        ]
    }
});