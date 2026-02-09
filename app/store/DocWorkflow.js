Ext.define('COURIERONLINE.store.DocWorkflow', {
    extend: 'Ext.data.TreeStore',
    model: 'COURIERONLINE.model.DocWorkflowPacket',
    config: {storeId: 'docWorkflowStore'},
    autoLoad: false,
    url: Ext.global.baseUrl,
    root: {
        expanded: false
    },
    proxy: {
        autoLoad: false,
        url: Ext.global.baseUrl,
        type: 'ajax',
        reader: {
            type: 'json',
            root: 'packets'
        }
    }
});