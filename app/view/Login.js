Ext.define('COURIERONLINE.view.Login', {
    extend: 'Ext.form.Panel',
    alias : 'widget.userlogin',

    bodyPadding: 10,
    width      : 350,
    labelAlign : 'left',
    modal      : false,
    floating   : true,
    autoHeight : true,
    resizable  : false,
    frame      : false,
    ui         : '',
    autoDestroy: true,
    id         : 'loginform',

    style: {
        // чтобы это значение не переопределялось "important" в базовых стилях для ие8
        padding: '20px !important;'
    },

    requires: ['Ext.ux.statusbar.StatusBar'],

    autoEl: {
        tag   : 'form',
        target: 'loginframe',
        action: '/ccwe/',
        method: 'POST'
    },

    defaults: {
        labelCls  : 'login-form-label',
        labelAlign: 'top',
        ui        : 'login-input',
        height    : 32,
        msgTarget : 'qtip',
        anchor    : '95%'
    },

    dockedItems: [
        {
            xtype  : 'toolbar',
            dock   : 'bottom',
            padding: '0 10',
            items  : [
                {
                    xtype   : 'button',
                    type    : 'submit',
                    width   : 100,
                    ui      : 'header',
                    scale   : 'medium',
                    text    : 'Войти',
                    action  : 'userlogin',
                    formBind: true
                },
                '->',
                {
                    xtype      : 'statusbar',
                    dock       : 'bottom',
                    itemId     : 'form-statusbar',
                    defaultText: ''
                }
            ]
        }
    ],

    items: [
        {
            margin         : '0 0 10 0',
            xtype          : 'textfield',
            name           : 'login',
            tabIndex       : 1,
            emptyText      : 'Логин',
            allowBlank     : false,
            blankText      : 'Введите ваш логин',
            selectOnFocus  : true,
            enableKeyEvents: true,
            inputAttrTpl   : 'autocomplete="on"'
        },
        {
            xtype          : 'textfield',
            tabIndex       : 2,
            inputType      : 'password',
            emptyText      : 'Пароль',
            name           : 'password',
            allowBlank     : false,
            blankText      : 'Введите ваш пароль',
            selectOnFocus  : true,
            enableKeyEvents: true,
            inputAttrTpl   : 'autocomplete="on"'
        }
    ]

});