Ext.define('COURIERONLINE.view.News', {
    extend: 'Ext.panel.Panel',
    requires: ['Ext.tree.Panel'],

    alias: 'widget.appNews',


    border: false,
    margin: {top: 25, right: 50},
    width: 180,
    height: 40,

    items: [
        {
            cls: 'appNews',
            xtype: 'label',
            itemId: 'newsLink',
            text: Msg.news
        }
    ]
});