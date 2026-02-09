Ext.define('COURIERONLINE.Application', {
    name: 'COURIERONLINE',

    extend: 'Ext.app.Application',

    requires: [
        'COURIERONLINE.Startup',
        'Ext.data.Store',
        'Ext.form.Label',
        'Ext.grid.column.Template',
        'Ext.form.field.*',
        'Ext.state.CookieProvider',
        'Ext.ux.Router',
        'Ext.ux.Deferred',
        'Ext.ux.ErrorReader',
        'Ext.ux.InputTextMask',
        'Ext.ux.PagingToolbarResizer',
        'Ext.ux.Paging',
        'COURIERONLINE.locale.ru',
        'COURIERONLINE.overrides.Container',
        'COURIERONLINE.overrides.form.Panel',
        'COURIERONLINE.overrides.form.field.File',
        'COURIERONLINE.overrides.Toolbar',
        'COURIERONLINE.overrides.FileButton',
        'COURIERONLINE.overrides.VTypes',
        'COURIERONLINE.overrides.LoadMask',
        'COURIERONLINE.overrides.GridHeader',
        'COURIERONLINE.overrides.Button',
        'COURIERONLINE.overrides.GridPanel',
        'COURIERONLINE.overrides.Window',
        'COURIERONLINE.overrides.Column',
        'COURIERONLINE.overrides.Header',
        'COURIERONLINE.overrides.Ajax',
        'COURIERONLINE.overrides.MessageBox',
        'COURIERONLINE.overrides.form.Action',
        'COURIERONLINE.overrides.History',
        'COURIERONLINE.overrides.JsonWriter'
    ],

    autoCreateViewport: false,

    controllers: [
        'Base', 'Main', 'Login', 'Header',
        'Organizations', 'Inspections', 'Docflows', 'SuperInspections',
        'ProfileInfo', 'Documents', 'Keys', 'Operators', 'SendWin', 'Tasks', 'DocWorkflow', 'Templates', 'News'
    ],

    enableRouter: true,

    /*
     * Here is where routes are defined.
     *  key:    URL matcher
     *  value:  controller + '#' + action to be invoked
     */
    routes      : {
        'test'            : 'ProfileInfo#showProfileInfoLazy',
        '/'               : 'main#index',
        'inbox'           : 'documents#inbox',
        'draft'           : 'documents#draft',
        'outbox'          : 'documents#outbox',
        'news'            : 'news#showNewsLayout',
        'clients'         : 'organizations#clients',
        'inspections'     : 'inspections#inspections',
        'docflows'        : 'docflows#docflows',
        'superInspections': 'superInspections#inspections',
        'operators'       : 'operators#operators',
        'templates'       : 'templates#templates',
        'tasks'           : 'tasks#tasks'
    },

    launch: function () {
        Ext.each(Ext.Msg.msgButtons, function (btn) {
            btn.ui = 'form-action';
        });

        Ext.Ajax.timeout = 60000;
        Ext.util.History.useTopWindow = false;

        Ext.FocusManager.enable();
        Ext.tip.QuickTipManager.init();

        Ext.state.Manager.setProvider(new Ext.state.CookieProvider());

        var me = this;
        Ext.global.APPLICATION = this;

        Ext.Ajax.request({
            url               : Ext.global.baseUrl,
            params            : {
                action: 'checkAuth'
            },
            method            : 'POST',
            onFailureInSuccess: Ext.emptyFn,
            callback          : function (o, isXdr, data) {
                var response = Ext.decode(data.responseText, true);

                if (response && response.success === true) {
                    me.fireEvent('login_success', {loadIndex: false});
                } else {
                    me.fireEvent('login_success', {loadIndex: false});
//                    me.fireEvent('login_form');
                }
            }
        });

        Ext.ux.Router.on({
            routemissed: function (token) {
                Ext.Msg.show({
                    title  : 'Error 404',
                    msg    : 'Route not found: ' + token,
                    buttons: Ext.Msg.OK,
                    icon   : Ext.Msg.ERROR
                });
            }
        });
    }
});