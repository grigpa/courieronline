Ext.define('COURIERONLINE.model.DocWorkflow', {
    extend: 'Ext.data.Model',
    fields: [
        'id', 'name', 'text', 'state', 'motion', 'author', 'organization', 'createtime', 'docType', 'size', 'tech', 'origFileName', 'contentType'
    ],
    belongsTo: 'DocWorkflowPacket',
    associations: [
        {
            type: 'hasMany',
            model: 'DocWorkflowCert',
            name: 'cert'
        }
    ]
});