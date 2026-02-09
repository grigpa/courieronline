/**
 * Контролллер для управления компонентами связанными с организациями
 */
Ext.define('COURIERONLINE.controller.Organizations', {
    extend: 'COURIERONLINE.controller.Base',

    views: ['Organization.Win', 'Organization.Form', 'Organization.Grid'],

    refs: [
        { ref: 'organizationsGrid', selector: 'organizationGrid'}
    ],

    stores: ['Organizations'],

    init: function () {
        var me = this;
        this.control({
            'organizationGrid'                       : {
                itemdblclick: me.editOrganization
            },
            'organizationGrid #change'      : {
                click: me.editSelectedOrganization
            },
            'organizationGrid #add'          : {
                click: me.createNewOrganization
            },
            'organizationGrid #remove'          : {
                click: me.removeOrganization
            },
            'organizationWin #save'    : {
                click: me.saveOrganization
            },
            'organizationWin #close'   : {
                click: function (button) {
                    button.up('window').close();
                }
            },
            'organizationForm [name=isIllegalEntity]': {
                change: function (obj, newValue/*, oldValue*/) {
                    var form = obj.up('organizationForm');
                    var kpp = form.down('[name=kpp]');
                    var ogrn = form.down('[name=ogrn]');
                    kpp[newValue ? 'enable' : 'disable']();
                    ogrn[newValue ? 'enable' : 'disable']();
                }
            }
        });
    },

    saveOrganization: function (button) {
        var me = this;
        var win = button.up('window');
        win.save(true, me.getOrganizationsStore());
    },

    createNewOrganization: function () {
        var win = Ext.create('COURIERONLINE.view.Organization.Win');
        var form = win.down('form');
        var record = Ext.create('COURIERONLINE.model.Organization');
        form.loadRecord(record);

        win.show();
    },

    editSelectedOrganization: function () {
        var record = this.getOrganizationsGrid().getSelectionModel().getLastSelected();
        if (record) {
            this.editOrganization(this.getOrganizationsGrid(), record);
        }
    },

    removeOrganization: function () {
        Ext.Msg.confirm(Msg.attention, Msg.confirmRemoveRecords, function (btn) {
            if (btn === 'yes') {
                var record = this.getOrganizationsGrid().getSelectionModel().getLastSelected();
                var store = this.getOrganizationsStore();
                store.remove(record);
                store.sync({
                    failure: function () { store.load(); }
                });
            }
        }, this);
    },

    editOrganization: function (grid, record) {
        var win = Ext.create('COURIERONLINE.view.Organization.Win');
        win.setTitle(Msg.editOrganization);
        win.down('[name=inspection.id]').getStore().load({
            callback: function () {
                win.show();
                win.loadRecord(record);
            }
        });
    },

    clients: function () {
        this.tryToInvoke(function () {
            if (!this.getWorkspace()) {
                return false;
            }
            this.getWorkspace().getLayout().setActiveItem('organizationGrid');
            this.getOrganizationsStore().load();
            return true;
        });
        this.tryToInvoke(function () {
            return this.selectMenuItem(Msg.organizations);
        });
    }

});