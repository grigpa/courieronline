/**
 * Контроллер для управления элементами находящихся в шапке страницы
 */
Ext.define('COURIERONLINE.controller.SendWin', {
    extend: 'Ext.app.Controller',

    requires: ['COURIERONLINE.view.Document.Win'],

    views: ['SendWin', 'CertWin'],

    init: function () {
        var me = this;
        me.control({
            'sendWin #ok': {
                click: function (obj) {
                    obj.up('window').fireEvent('ok_click');
                }
            },
            'sendWin #cancel': {
                click: function (obj) {
                    obj.up('window').fireEvent('cancel_click');
                }
            },

            'certWin #certWinSign': {
                click: function (obj) {
                    obj.up('window').fireEvent('ok_click');
                }
            },
            'certWin #certWinCancel': {
                click: function (obj) {
                    obj.up('window').fireEvent('cancel_click');
                }
            },
            'sendWin gridpanel': {
                itemdblclick: function (grid, record) {
                    var contentWin = Ext.create('COURIERONLINE.view.Document.Win', {
                        record: record,
                        type: 'document'
                    });
                    contentWin.show();
                }
            }
        });
    }

});
