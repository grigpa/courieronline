Ext.define('COURIERONLINE.model.DocWorkflowPacket', {
    extend: 'Ext.data.Model',
    fields: [
        'id', 'name', 'docs', 'attachments', 'text', 'state', 'motion', 'author', 'organization', 'status', 'createtime', 'docflowType', 'tech'
    ],
    associations: [
        {
            type: 'hasMany',
            model: 'DocWorkflowAttach',
            name: 'attachments',
            associationKey: 'attachments'
        },
        {
            type: 'hasMany',
            model: 'DocWorkflow',
            name: 'docs'
        }
    ]
});