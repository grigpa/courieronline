/**
 * Контролллер для управления компонентами связанными с операторами
 */
Ext.define('COURIERONLINE.controller.Operators', {
    extend: 'COURIERONLINE.controller.Base',

    views: ['Operator.Win', 'Operator.Form', 'Operator.Grid'],

    refs: [
        { ref: 'operatorsGrid', selector: 'operatorGrid'}
    ],

    stores: ['Operators'],

    init: function () {
        var me = this;
        this.control({
            'operatorGrid'                       : {
                itemdblclick: me.editOperator
            },
            'operatorGrid #change'      : {
                click: me.editSelectedOperator
            },
            'operatorGrid #add'          : {
                click: me.createNewOperator
            },
            'operatorGrid #remove'          : {
                click: me.removeOperator
            },
            'operatorWin #save'    : {
                click: me.saveOperator
            },
            'operatorWin #close'   : {
                click: function (button) {
                    button.up('window').close();
                }
            }
        });
    },

    saveOperator: function (button) {
        var win = button.up('window');
        win.save();
    },

    createNewOperator: function () {
        var win = Ext.create('COURIERONLINE.view.Operator.Win');
        var form = win.down('form');
        var record = Ext.create('COURIERONLINE.model.Operator');
        form.loadRecord(record);

        win.show();
    },

    editSelectedOperator: function () {
        var record = this.getOperatorsGrid().getSelectionModel().getLastSelected();
        if (record) {
            this.editOperator(this.getOperatorsGrid(), record);
        }
    },

    removeOperator: function () {
        Ext.Msg.confirm(Msg.attention, Msg.confirmRemoveRecords, function (btn) {
            if (btn === 'yes') {
                var record = this.getOperatorsGrid().getSelectionModel().getLastSelected();
                var store = this.getOperatorsStore();
                store.remove(record);
                store.sync({
                    failure: function () { store.load(); }
                });
            }
        }, this);
    },

    editOperator: function (grid, record) {
        var win = Ext.create('COURIERONLINE.view.Operator.Win');
        win.setTitle(Msg.editOperator);
        win.show();
        win.loadRecord(record);
    },

    operators: function () {
        this.tryToInvoke(function () {
            if (!this.getWorkspace()) {
                return false;
            }
            this.getWorkspace().getLayout().setActiveItem('operatorGrid');
            this.getOperatorsStore().load();
            return true;
        });
        this.tryToInvoke(function () {
            return this.selectMenuItem(Msg.operators);
        });
    }

});