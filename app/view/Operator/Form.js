Ext.define('COURIERONLINE.view.Operator.Form', {
    extend: 'Ext.form.Panel',

    requires: [
        'COURIERONLINE.view.Key.Grid',
        'Ext.grid.plugin.CellEditing'
    ],

    alias: 'widget.operatorForm',

    defaults: {
        margin    : '10 10 0 10',
        labelWidth: 200
    },

    items: [
        {
            xtype     : 'textfield',
            name      : 'name',
            allowBlank: false,
            fieldLabel: 'Наименование'
        },
        {
            xtype     : 'textfield',
            name      : 'statSubjectId',
            allowBlank: false,
            fieldLabel: 'Идентификатор субъекта для обмена с Росстат'
        },
        {
            xtype     : 'textfield',
            name      : 'pfrSubjectId',
            fieldLabel: 'Идентификатор субъекта для обмена с ПФР'
        },
        {
            xtype     : 'textfield',
            name      : 'login',
            allowBlank: false,
            fieldLabel: 'Логин'
        },
        {
            xtype : 'keyGrid',
            anchor: '100% -100',
            name  : 'certificates'
        }
    ]

});