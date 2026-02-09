Ext.define('COURIERONLINE.view.Inspection.TogsForm', {
    extend: 'Ext.form.Panel',

    alias: 'widget.togsForm',

    requires: [
        'COURIERONLINE.view.Key.Grid'
    ],

    defaults: {
        margin: 10,
        labelWidth: 200
    },

    items: [
        {
            name: 'id',
            xtype: 'hidden'
        },
        {
            xtype: 'hidden',
            name: 'systemName'
        },
        {
            xtype: 'hidden',
            name: 'name'
        },
        {
            fieldLabel: 'Выберите инспекцию',
            xtype: 'combobox',
            allowBlank: false,
            editable: false,
            displayField: 'name',
            valueField: 'id',
            store: 'Togs',
            listeners: {
                change: function (combo) {
                    var idStore = combo.getStore().find('id', combo.getValue());
                    if (combo.getStore().getAt(idStore).get('type') === 'PFR') {
                        Ext.ComponentQuery.query('togsForm #email')[0].setDisabled(true);
                    } else {
                        Ext.ComponentQuery.query('togsForm #email')[0].setDisabled(false);
                    }
                }
            }
        },
        {
            xtype: 'textfield',
            maxLength: 255,
            fieldLabel: 'Email',
            vtype: 'email',
            itemId: 'email',
            name: 'email'
        }
    ]

});