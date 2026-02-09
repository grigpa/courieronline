Ext.define('COURIERONLINE.view.Notice', {
    extend: 'Ext.panel.Panel',
    requires: ['Ext.tree.Panel'],

    alias: 'widget.appNotice',

    cls: 'appNotice',

    border: false,
    margin: {top: 25},
    items: [
        {
            border: false,
            bodyBorder: false,
            width: 260,
            height: 150,
            xtype: 'treepanel',
            lines: false,
            hidden: true,
            autoScroll : false,
            cls: 'menu-notice',
            itemId: 'notice',
            rootVisible: false,
            rowLines: true,
            hideHeaders: true,

            columns: [
                {
                    xtype: 'templatecolumn',
                    text: 'cls',
                    width: 40,
                    defaultWidth: 40,
                    maxWidth: 40,
                    dataIndex: 'cls',
                    tpl: new Ext.XTemplate(
                        '<div class="notice-icon {cls}"></div>',
                        '<tpl if="counter">',
                        '<div class="notification-counter"><span>{counter}</span></div>',
                        '</tpl>'
                    )
                },

                {
                    xtype: 'templatecolumn',
                    text: 'Name',
                    width: 170,
                    dataIndex: 'name',
                    tpl: new Ext.XTemplate(
                        '<div class="menu-item-name">{name}</div>'

                    )
                },
                {
                    xtype: 'templatecolumn',
                    width: 1,
                    text: 'arrow',
                    tpl: ''
                }
            ],
            root: {
                expanded: true,
                allowDrag: false,
                draggable: false
            },
            displayField: 'name',
            store: 'Notice'
        }
    ]
});