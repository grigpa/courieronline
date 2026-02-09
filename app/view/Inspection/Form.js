Ext.define('COURIERONLINE.view.Inspection.Form', {
    extend  : 'Ext.form.Panel',

    alias: 'widget.inspectionForm',

    requires: [
        'COURIERONLINE.view.Key.Grid'
    ],

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
            xtype     : 'textfield',
            fieldLabel: 'Системное имя',
            readOnly  : true,
            tooltip   : 'Недоступно для редактирования',
            maxLength : 100,
            name      : 'systemName'
        },
        {
            xtype     : 'textfield',
            maxLength : 255,
            readOnly  : true,
            tooltip   : 'Недоступно для редактирования',
            fieldLabel: 'Наименование организации',
            name      : 'name'
        },
        {
            xtype     : 'textfield',
            maxLength : 255,
            fieldLabel: 'Email',
            vtype     : 'email',
            name      : 'email'
        },
        {
            xtype : 'keyGrid',
            name  : 'certificates',
            anchor: '100% -100',
            tbar  : [
                { text: Msg.download, itemId: 'download', disabled: true }
            ]
        }
    ]

});