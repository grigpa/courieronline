Ext.define('COURIERONLINE.view.Organization.Form', {
    extend: 'Ext.form.Panel',

    requires: [
        'COURIERONLINE.view.Key.Grid',
        'Ext.grid.plugin.CellEditing'
    ],
    autoScroll: true,

    alias: 'widget.organizationForm',

    defaults: {
        margin: '10 10 0 10',
        labelWidth: 200
    },

    items: [
        {
            name: 'id',
            xtype: 'hidden'
        },
        {
            xtype: 'hidden',
            name: 'orgType'
        },
        {
            xtype: 'textfield',
            fieldLabel: Msg.regNum,
            name: 'pfrSystemName',
            plugins: [new Ext.ux.InputTextMask('999-999-999999', true)]
        },
        {
            xtype: 'combo',
            name: 'inspection.id',
            fieldLabel: Msg.togsName,
            allowBlank: false,
            displayField: 'name',
            editable: false,
            valueField: 'id',
            store: 'Inspections',
            listeners: {
                expand: function () {
                    var store = this.getStore();
                    store.clearFilter(true);
                    store.filter({
                        filterFn: function (f) {
                            return f.get('type') === 'STAT';
                        }
                    });
                }
            }

        },
        {
            xtype: 'combo',
            name: 'pfrInspection.id',
            fieldLabel: Msg.pfrName,
            displayField: 'name',
            editable: false,
            valueField: 'id',
            store: 'InspectionsPFR',
            listeners: {
                expand: function () {
                    var store = this.getStore();
                    store.clearFilter(true);
                    store.filter({
                        filterFn: function (f) {
                            return f.get('type') === 'PFR';
                        }
                    });
                }
            }
        },
        {
            xtype: 'hidden',
            name: 'systemName'
        },
        {
            xtype: 'checkbox',
            checked: true,
            fieldLabel: 'Юридическое лицо',
            name: 'isIllegalEntity'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Наименование организации',
            allowBlank: false,
            maxLength: 255,
            name: 'name'
        },
        {
            xtype: 'textfield',
            fieldLabel: Msg.inn,
            name: 'inn',
            allowBlank: false,
            maxLength: 12,
            enforceMaxLength: 12,
            invalidText: Msg.innInvalidText,
            regex: /^\d{10,10}(\d\d)?$/,
            maskRe: /\d/
        },
        {
            xtype: 'textfield',
            fieldLabel: 'КПП',
            allowBlank: false,
            name: 'kpp',
            maxLength: 9,
            enforceMaxLength: 9,
            invalidText: Msg.kppInvalidText,
            regex: /^\d{9,9}$/,
            maskRe: /\d/
        },
        {
            xtype: 'textfield',
            fieldLabel: 'ОГРН',
            allowBlank: false,
            name: 'ogrn',
            maxLength: 15,
            enforceMaxLength: 15,
            invalidText: Msg.ogrnInvalidText,
            regex: /^\d{13,13}(\d\d)?$/,
            maskRe: /\d/
        },
        {
            xtype: 'textfield',
            fieldLabel: 'ОКПО',
            allowBlank: false,
            name: 'okpo',
            minLength: 8,
            maxLength: 14,
            invalidText: Msg.okpdInvalidText,
            regex: /^\d{8,14}$/,
            maskRe: /\d/
        },
        {
            xtype     : 'checkbox',
            name      : 'usesThickClient',
            fieldLabel: 'ПК КК JE'
        },
        {
            xtype: 'textfield',
            fieldLabel: 'Email (контактный)',
            allowBlank: false,
            maxLength: 100,
            enforceMaxLength: 100,
            vtype: 'email',
            name: 'email'
        },
        {
            xtype: 'fieldcontainer',
            fieldLabel: 'Системные имена ПК КК JE',
            items: {
                xtype: 'gridpanel',
                height: 120,
                name: 'systemNames',
                columns: [
                    { text: 'Тип организации', dataIndex: 'type' },
                    { text: 'Системное имя', dataIndex: 'system_name', flex: 1, editor: 'textfield' }
                ],
                plugins: [
                    {
                        ptype: 'cellediting',
                        clicksToEdit: 1
                    }
                ],
                store: {
                    fields: ['type', 'system_name'],
                    data: [
                        { 'type': 'MNS', 'system_name': '' },
                        { 'type': 'PFR', 'system_name': '' },
                        { 'type': 'STAT', 'system_name': '' },
                        { 'type': 'FSS', 'system_name': '' }
                    ]
                }
            }
        },
        {
            xtype: 'keyGrid',
            minHeight: 150,
            margin: 10,
            anchor: '100% -390',
            name: 'certificates'
        }
    ]
});