Ext.define('COURIERONLINE.view.Key.Grid', {
    extend: 'Ext.grid.Panel',

    alias: 'widget.keyGrid',

    requires: [
        'Ext.grid.column.CheckColumn'
    ],

    margin  : 10,
    name    : 'certificates',
    forceFit: true,
    columns : [
        {
            text     : 'Владелец',
            dataIndex: 'owner',
            editor   : 'textfield',
            minWidth : 130
        },
        {
            text     : 'Активен',
            dataIndex: 'isActive',
            editor   : 'checkbox',
            xtype    : 'checkcolumn',
            minWidth : 50
        },
        {
            text     : 'Для шифрования',
            dataIndex: 'isForEncryption',
            editor   : 'checkbox',
            xtype    : 'checkcolumn',
            minWidth : 100
        },
        {
            text     : 'Действителен с',
            dataIndex: 'validFrom',
            minWidth : 100
        },
        {
            text     : 'Действителен до',
            dataIndex: 'validThrough',
            minWidth : 100
        },
        {
            text     : 'Отпечаток',
            dataIndex: 'hash',
            minWidth : 100
        }
    ],
    tbar    : [
        {
            xtype: 'label',
            text : 'Сертификаты'
        },
        '->',
        {
            xtype      : 'form',
            itemId     : 'addCertificateForm',
            border     : false,
            errorReader: Ext.create('Ext.ux.ErrorReader'),
            items      : {
                xtype       : 'filefield',
                buttonText  : Msg.add,
                ui          : 'default-toolbar',
                scale       : 'small',
                buttonConfig: {
                    multiple: 'multiple'
                },
                itemId      : 'certfile',
                buttonOnly  : true,
                margin      : 0
            }
        },
        {
            text    : Msg.remove,
            ui      : 'default', // по факту ui=default-toolbar
            scale   : 'small',
            itemId  : 'remove',
            disabled: true
        },
        {
            text    : Msg.download,
            ui      : 'default', // по факту ui=default-toolbar
            scale   : 'small',
            itemId  : 'download',
            disabled: true
        }
    ],
    store   : {
        fields: [
            'id', 'owner', 'isActive', 'isForEncryption', 'content', 'hash', 'validFrom',
            'validThrough'
        ],
        data  : [],
        proxy : {
            type: 'memory'
        }
    }

});