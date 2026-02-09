Ext.define('COURIERONLINE.view.Navigator', {
    extend  : 'Ext.panel.Panel',
    requires: ['Ext.tree.Panel'],

    alias: 'widget.appNavigator',

    border: false,

    items: [
        {
            border      : false,
            bodyBorder  : false,
            xtype       : 'treepanel',
            lines       : false,
            cls         : 'menu-navigator',
            itemId      : 'navigator',
            rootVisible : false,
            rowLines    : true,
            hideHeaders : true,
            columns     : [
                {
                    xtype    : 'templatecolumn',
                    text     : 'Name',
                    width    : 210,
                    dataIndex: 'name',
                    tpl      : new Ext.XTemplate(
                        '<div class="menu-item-link">{name}',
                        '<tpl if="counter">',
                                '<div class="{className}"><span>',
                                '{counter}',
                                '</span></div>',
                            '</tpl>',
                        '</div>'
                    )
                },
                {
                    xtype: 'templatecolumn',
                    width: 20,
                    text : '',
                    tpl  : ''
                }
            ],
            root        : {
                expanded : true,
                allowDrag: false,
                draggable: false
            },
            displayField: 'name',
            store       : 'Navigator'
        }
    ]
});