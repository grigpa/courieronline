Ext.define('COURIERONLINE.model.DocWorkflowAttach', {
    extend: 'Ext.data.Model',
    fields: [
        'id', 'name'
    ],
    belongsTo: [{
        name: 'attachments',
        model: 'DocWorkflowPacket',
        associationKey: 'attachments'
    }]
});