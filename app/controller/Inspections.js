/**
 * Контролллер для управления компонентами связанными с инспекциями
 */
Ext.define('COURIERONLINE.controller.Inspections', {
    extend: 'COURIERONLINE.controller.Base',

    requires: ['COURIERONLINE.view.Inspection.TogsForm'],

    refs: [
        {ref: 'inspectionsGrid', selector: 'inspectionGrid'}
    ],

    views: ['Inspection.Form', 'Inspection.Win', 'Inspection.Grid'],

    stores: ['Inspections', 'InspectionsPFR', 'Togs'],

    init: function () {
        var me = this;
        me.control({
            'inspectionGrid #change': {
                click: me.editSelectedInspection
            },
            'inspectionGrid'                      : {
                itemdblclick: me.editInspection
            },
            'inspectionWin #save'   : {
                click: me.savedInspection
            },
            'inspectionAddWin #save'   : {
                click: me.savedInspection
            },
            'inspectionGrid #remove'          : {
                click: me.removeInspection
            },
            'inspectionGrid #add'          : {
                click: me.addInspection
            },
            'inspectionWin #close'  : {
                click: function (button) {
                    button.up('window').close();
                }
            },
            'inspectionAddWin #close'  : {
                click: function (button) {
                    button.up('window').close();
                }
            },
            'togsForm combo': {
                change: function (obj, newValue/*, oldValue, eOpts*/) {
                    var info = me.getTogsStore().findRecord('id', newValue);
                    if (info) {
                        obj.up('form').down('[name=id]').setValue(info.get('id'));
                        obj.up('form').down('[name=systemName]').setValue(info.get('systemName'));
                        obj.up('form').down('[name=name]').setValue(info.get('name'));
                    }
                }
            }
        });
    },

    addInspection: function () {
        var win = Ext.create('COURIERONLINE.view.Inspection.AddWin');
        var form = win.down('form');
        var record = Ext.create('COURIERONLINE.model.Inspection');
        record.preventInternalUpdate = true;
        form.loadRecord(record);
        win.show();
    },

    savedInspection: function (button) {
        var win = button.up('window');
        win.save(true, this.getInspectionsStore());
    },

    editSelectedInspection: function () {
        var record = this.getInspectionsGrid().getSelectionModel().getLastSelected();
        if (record) {
            this.editInspection(this.getInspectionsGrid(), record);
        }
    },

    editInspection: function (grid, record) {
        var win = Ext.create('COURIERONLINE.view.Inspection.Win');
        win.show();
        win.loadRecord(record);
    },

    removeInspection: function () {
        Ext.Msg.confirm(Msg.attention, Msg.confirmRemoveRecords, function (btn) {
            if (btn === 'yes') {
                var record = this.getInspectionsGrid().getSelectionModel().getLastSelected();
                var store = this.getInspectionsStore();
                store.remove(record);
                store.sync({
                    failure: function () { store.load(); }
                });
            }
        }, this);
    },

    inspections: function () {
        this.tryToInvoke(function () {
            if (!this.getWorkspace()) {
                return false;
            }
            this.getWorkspace().getLayout().setActiveItem('inspectionGrid');
            this.getInspectionsStore().load();
            return true;
        });
        this.tryToInvoke(function () {
            return this.selectMenuItem(Msg.inspections);
        });
    }

});