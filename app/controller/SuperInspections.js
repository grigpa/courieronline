/**
 * Контролллер для управления компонентами связанными с инспекциями,
 * контроллер используется в режиме суперпольователя
 */
Ext.define('COURIERONLINE.controller.SuperInspections', {
    extend: 'COURIERONLINE.controller.Base',

    requires: ['COURIERONLINE.view.Inspection.TogsForm'],

    refs: [
        {ref: 'superInspectionsGrid', selector: 'superInspectionGrid'}
    ],

    views: ['SuperInspection.Form', 'SuperInspection.Win', 'SuperInspection.Grid'],

    stores: ['SuperInspections'],

    init: function () {
        var me = this;
        me.control({
            'superInspectionGrid #change': {
                click: me.editSelectedInspection
            },
            'superInspectionGrid': {
                itemdblclick: me.editInspection
            },
            'superInspectionWin #save': {
                click: me.savedInspection
            },
            'superInspectionWin': {
                beforerender: me.loadRecordToForm
            },
            'superInspectionGrid #remove': {
                click: me.removeInspection
            },
            'superInspectionGrid #add': {
                click: me.addInspection
            },
            'superInspectionWin #close': {
                click: function (button) {
                    button.up('window').close();
                }
            }
        });
    },

    loadRecordToForm: function (me) {
        var form = me.down('form');
        var combo = Ext.ComponentQuery.query('superInspectionForm #comboOrg')[0];
        var recordSelected = null;
        if (Ext.isDefined(form.getRecord().data.id)) {
            var idx = form.getRecord().data.type === 'PFR' ? 1 : 0;
            recordSelected = combo.getStore().getAt(idx);
            combo.setDisabled(true);
            combo.setValue(recordSelected.get('id'));
        } else {
            recordSelected = combo.getStore().getAt(0);
            combo.setDisabled(false);
            combo.setValue(recordSelected.get('id'));
        }
    },

    addInspection: function () {
        var record = Ext.create('COURIERONLINE.model.SuperInspection');
        var win = Ext.create('COURIERONLINE.view.SuperInspection.Win', {record: record});
        var form = win.down('form');
        form.loadRecord(record);
        win.show();
    },

    savedInspection: function (button) {
        var win = button.up('window');
        win.save(true, this.getSuperInspectionsStore());
    },

    editSelectedInspection: function () {
        var record = this.getSuperInspectionsGrid().getSelectionModel().getLastSelected();
        if (record) {
            this.editInspection(this.getSuperInspectionsGrid(), record);
        }
    },

    editInspection: function (grid, record) {
        var win = Ext.create('COURIERONLINE.view.SuperInspection.Win', {record: record});
        win.loadRecord(record);
        win.show();
    },

    removeInspection: function () {
        Ext.Msg.confirm(Msg.attention, Msg.confirmRemoveRecords, function (btn) {
            if (btn === 'yes') {
                var record = this.getSuperInspectionsGrid().getSelectionModel().getLastSelected();
                var store = this.getSuperInspectionsStore();
                store.remove(record);
                store.sync({
                    failure: function () {
                        store.load();
                    }
                });
            }
        }, this);
    },

    inspections: function () {
        this.tryToInvoke(function () {
            if (!this.getWorkspace()) {
                return false;
            }
            this.getWorkspace().getLayout().setActiveItem('superInspectionGrid');
            this.getSuperInspectionsStore().load();
            return true;
        });
        this.tryToInvoke(function () {
            return this.selectMenuItem(Msg.inspections);
        });
    }


});