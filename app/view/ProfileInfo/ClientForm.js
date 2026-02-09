Ext.define('COURIERONLINE.view.ProfileInfo.ClientForm', {
    extend: 'Ext.Panel',

    alias: 'widget.clientInfoForm',

    layout: {
        type: 'fit'
    },

    requires: [
        'COURIERONLINE.view.Key.Grid',
        'COURIERONLINE.view.ProfileInfo.ChangePasswordForm',
        'COURIERONLINE.view.ProfileInfo.AppInfoForm',
        'Ext.ux.GroupTabPanel'
    ],

    items: {
        xtype: 'grouptabpanel',

        items: [
            {
                items: {
                    title: 'Реквизиты',
                    itemId: 'info',
                    xtype: 'form',
                    defaults: {
                        margin: '10 10 0 10',
                        labelWidth: 200,
                        anchor: '100%'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: Msg.regNum,
                            name: 'pfrSystemName',
                            plugins: [new Ext.ux.InputTextMask('999-999-999999', true)]
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Наименование организации',
                            allowBlank: false,
                            maxLength: 255,
                            name: 'name'
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: Msg.inn,
                            name: 'inn',
                            allowBlank: false,
                            maxLength: 12,
                            enforceMaxLength: 12,
                            invalidText: Msg.innInvalidText,
                            regex: /^\d{10,10}(\d\d)?$/,
                            maskRe: /\d/
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'КПП',
                            allowBlank: false,
                            name: 'kpp',
                            maxLength: 9,
                            enforceMaxLength: 9,
                            invalidText: Msg.kppInvalidText,
                            regex: /^\d{9,9}$/,
                            maskRe: /\d/
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'ОГРН',
                            allowBlank: false,
                            name: 'ogrn',
                            maxLength: 15,
                            enforceMaxLength: 15,
                            invalidText: Msg.ogrnInvalidText,
                            regex: /^\d{13,13}(\d\d)?$/,
                            maskRe: /\d/
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'ОКПО',
                            allowBlank: false,
                            name: 'okpo',
                            maxLength: 12,
                            enforceMaxLength: 12,
                            invalidText: Msg.okpdInvalidText,
                            regex: /^\d{10,10}(\d\d)?$/,
                            maskRe: /\d/
                        },
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Email (контактный)',
                            allowBlank: false,
                            maxLength: 100,
                            enforceMaxLength: 100,
                            vtype: 'email',
                            name: 'email'
                        }
                    ]
                }
            },
            {
                items: {
                    title: 'Сертификаты',
                    layout: 'anchor',
                    items: [
                        {
                            header: '',
                            margin: 10,
                            anchor: '100% 0',
                            name: 'certificates',
                            minHeight: 150,
                            xtype: 'keyGrid'
                        }
                    ]
                }
            },
            {
                items: {
                    title: 'Сменить пароль',
                    itemId: 'changePassword',
                    xtype: 'changePasswordForm'
                }
            },
            {
                items: {
                    title: 'О программе',
                    xtype: 'appInfoForm'
                }
            }
        ]
    }
});