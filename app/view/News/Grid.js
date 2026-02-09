Ext.define('COURIERONLINE.view.News.Grid', {
    extend: 'Ext.grid.Panel',

    requires: ['Ext.ux.Paging', 'Ext.grid.Panel'],
    alias: 'widget.newsGrid',

    store: 'News',
    cls: 'News',
    forceFit: true,
    viewConfig: {
        getRowClass: function (record) {
            return (record.get('isNew')) ? 'bold-row' : '';
        }
    },
    columns: [
        {
            text: 'Заголовок',
            dataIndex: 'title',
            align: 'center'
        },
        { text: 'Создан', dataIndex: 'created', align: 'center' },
        { text: 'Автор',
            dataIndex: 'author',
            align: 'center'
        }
    ],


    dockedItems: [
        {
            itemId: 'crudToolbar',
            hidden: true,
            xtype: 'toolbar',
            dock: 'top',
            items: [
                {
                    text     : 'Добавить',
                    iconCls  : 'icon-add',
                    margin   : '0 20 0 0',
                    iconAlign: 'top',
                    scale    : 'medium',
                    itemId   : 'add'
                },
                {
                    text     : 'Изменить',
                    iconCls  : 'icon-edit',
                    margin   : '0 20 0 0',
                    iconAlign: 'top',
                    scale    : 'medium',
                    itemId   : 'edit'
                },
                {
                    text     : Msg.remove,
                    iconCls  : 'icon-remove',
                    margin   : '0 20 0 0',
                    iconAlign: 'top',
                    scale    : 'medium',
                    disabled : true,
                    itemId   : 'remove'
                }
            ]
        }
    ],
    bbar: {
        xtype: 'custompaging',
        store: 'News'
    }
});