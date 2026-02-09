/**
 * Контроллер для управления элементами находящихся в шапке страницы
 */
Ext.define('COURIERONLINE.controller.Header', {
    extend: 'Ext.app.Controller',

    views: ['Header', 'CertWin'],

    refs: [ {ref: 'documentFilter', selector: 'appFilter'}],

    requires: ['COURIERONLINE.services.EDSService'],

    init: function () {
        var me = this;
        me.control({
            'appHeader #logout': {
                click: me.logout
            },
            'appHeader #show-menu-btn': {
                click: me.showFilter
            },
            'appHeader #userInfo': {
                click: function () {
                    me.getApplication().fireEvent('showProfileInfo');
                }
            },
            'appHeader #certificatesInfo': {
                click: function () {
                    var EDSService = Ext.create('COURIERONLINE.services.EDSService');
                    EDSService.showCertWin();
                }
            },
            'certWin #OkCert': {
                click: me.updateCurrentCertificate
            }
        });
    },

    logout: function () {
        this.getApplication().fireEvent('logout');
    },

    showFilter: function () {
        var filter = this.getDocumentFilter();
        if (filter && filter.isVisible()) {
            filter.hide();
        } else {
            filter.show();
        }
    },

    updateCurrentCertificate: function (button) {
        var win = button.up('window');
        var grid = win.down('gridpanel');
        var me = this;
        var selections = grid.getSelectionModel().getSelection();
        if (selections.length) {
            var EDSService = Ext.create('COURIERONLINE.services.EDSService');
            EDSService.updateCurrentCert(Ext.pluck(selections, 'data'), function () {
                win.close();
                var certEl = Ext.ComponentQuery.query('appHeader #certificatesInfo')[0];
                certEl.update(selections[0].get('owner'));
                me.getApplication().getController('Main').setCertWidth();
            });
        } else {
            Ext.Msg.alert(Msg.msgTitle, Msg.selectCertRow);
        }
    }

});