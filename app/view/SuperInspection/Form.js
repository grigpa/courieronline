Ext.define('COURIERONLINE.view.SuperInspection.Form', {
    extend: 'Ext.form.Panel',

    alias: 'widget.superInspectionForm',

    requires: [
        'COURIERONLINE.view.Key.Grid'
    ],

    defaults: {
        margin: '10 10 0 10',
        labelWidth: 200
    },

    initComponent: function () {
        Ext.apply(this, {
            items: [
                {
                    name: 'id',
                    xtype: 'hidden'
                },
                {
                    xtype: 'combobox',
                    fieldLabel: 'Контролирующий орган',
                    itemId: 'comboOrg',
                    store: new Ext.data.SimpleStore({
                        id: 0,
                        fields: [
                            'id',
                            'text'
                        ],
                        data: [
                            ['STAT', 'ТОГС'],
                            ['PFR', 'УПФР']
                        ],
                        value: 'STAT'
                    }),
                    valueField: 'id',
                    displayField: 'text',
                    allowBlank: false,
                    queryMode: 'local',
                    editable: false,
                    name: 'type'
                },

                {
                    xtype: 'textfield',
                    fieldLabel: 'Системное имя',
                    allowBlank: false,
                    maxLength: 100,
                    name: 'systemName'
                },
                {
                    xtype: 'textfield',
                    allowBlank: false,
                    maxLength: 255,
                    fieldLabel: 'Наименование',
                    name: 'name'
                },
                {
                    xtype: 'keyGrid',
                    anchor: '100% -70',
                    name: 'certificates'
                }
            ]
        });
        this.callParent();
    }




});