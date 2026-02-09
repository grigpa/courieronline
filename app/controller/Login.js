/**
 * Контролллер для работы с авторизацией
 */
Ext.define('COURIERONLINE.controller.Login', {
    extend: 'Ext.app.Controller',

    refs: [
        { ref: 'appMain', selector: 'appMain' },
        { ref: 'loginForm', selector: 'userlogin' },
        { ref: 'loginField', selector: 'userlogin textfield[name=login]' }
    ],

    views: ['LoginViewport', 'Login'],

    init: function () {
        var me = this;

        this.control({
            'userlogin button[action=userlogin]': {
                click: this.userLogin
            },
            'userlogin textfield[name=login]'   : {
                keyup: this.keyEnter
            },
            'userlogin textfield[name=password]': {
                keyup: this.keyEnter,
                blur : function () {
                    me.getLoginField().focus();
                }
            },
            'userlogin'                         : {
                show: function () {
                    me.getLoginField().focus(true, 100, function () {
                        me.getLoginField().blur(); // инициируем валидацию формы
                        me.getLoginField().focus(true); // возвращаем фокус на поле
                    });
                    me.getLoginForm().mask = new Ext.LoadMask(me.getLoginForm().getEl(), {msg: Msg.authProgress});
                }
            }
        });
        this.getApplication().on({
            'login_form'   : this.showLoginForm,
            'login_success': this.onLoginSuccess,
            'login_failure': this.onLoginFailure,
            'logout'       : this.logout,
            scope          : this
        });
    },

    logout: function () {
        Ext.Msg.show({
            title  : Msg.exit,
            msg    : Msg.exitConfirm,
            icon   : Ext.MessageBox.QUESTION,
            buttons: Ext.Msg.OKCANCEL,
            fn     : function (btn) {
                if (btn === 'ok') {
                    Ext.Ajax.request({
                        method : 'POST',
                        params : {
                            action: 'invoke',
                            obj   : 'profile',
                            mth   : 'logout'
                        },
                        url    : Ext.global.baseUrl,
                        failure: function (response) {
                            Ext.log(response.responseText);
                            document.location = Ext.global.rootUrl;
                        },
                        success: function (response) {
                            Ext.log(response.responseText);
                            document.location = Ext.global.rootUrl;
                        }
                    });
                }
            }
        });
    },

    createTooltip: function (msg) {
        var me = this;
        this.tooltip = this.tooltip || Ext.create('Ext.panel.Panel', {
            height  : 70,
            width   : 350,
            ui      : 'white',
            bodyPadding: '20 10 10 60',
            html    : '',
            floating: true
        });
        var xy = Ext.getCmp('loginform').getPosition();
        this.tooltip.showAt(xy[0], xy[1] - 80);
        this.tooltip.update(msg);
        setTimeout(function () {
            me.tooltip.hide();
        }, 3000);
    },

    showLoginForm: function () {
        var loginForm;
        if (this.getAppMain()) {
            loginForm = this.getLoginView().create();
            loginForm.modal = true;
            loginForm.ui = 'login-form';
        } else {
            this.getLoginViewportView().create();
            loginForm = this.getLoginView().create();
        }
        loginForm.show();
    },

    onLoginSuccess: function () {
        if (this.getLoginForm()) {
            this.getLoginForm().getEl().dom.submit();
            this.getLoginForm().mask.hide();
            this.getLoginForm().close();
            if (this.tooltip) {
                this.tooltip.hide();
            }
        }
    },

    onLoginFailure: function (action) {
        var response = action.response;
        var msg = response && response.responseText && response.responseText.length < 100
            ? response.responseText : Msg.authError;
        this.createTooltip(msg);
        this.getLoginForm().mask.hide();
        this.getLoginForm().getForm().reset();
        this.getLoginField().focus();
    },

    keyEnter: function (textfield, e) {
        if (e.keyCode === 13) {
            e.stopEvent();
            this.userLogin();
        }
    },

    userLogin: function () {
        var me = this;
        if (!me.getLoginForm().isValid()) {
            return;
        }
        me.getLoginForm().mask.show();
        me.getLoginForm().submit({
            method            : 'POST',
            params            : {
                action: 'authenticate'
            },
            url               : Ext.global.baseUrl,
            success           : function () {
                me.getApplication().fireEvent('login_success');
            },
            onFailureInSuccess: Ext.emptyFn,
            failure           : function (form, action) {
                var response = action.response.responseText;
                var isSuccess = (action.response.status === 200 && response === '');
                if (isSuccess) {
                    me.getApplication().fireEvent('login_success');
                } else {
                    me.getApplication().fireEvent('login_failure', action);
                    Ext.log(action);
                }
            }
        });
    }

});