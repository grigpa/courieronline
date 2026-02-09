Ext.define('COURIERONLINE.view.Key.Form', {
    extend: 'Ext.form.Panel',

    alias: 'widget.keyForm',

    defaults: {
        margin    : 10,
        labelWidth: 200
    },

    items: [
        {
            xtype     : 'textfield',
            readOnly  : true,
            size      : 24,
            name      : 'owner',
            fieldLabel: 'Владелец сертификата'
        },
        {
            xtype     : 'checkbox',
            name      : 'isActive',
            fieldLabel: 'Активность'
        },
        {
            xtype     : 'checkbox',
            name      : 'isForEncryption',
            fieldLabel: 'Только шифрование'
        }
    ]

});