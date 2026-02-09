Ext.define('COURIERONLINE.model.DocWorkflowCert', {
    extend: 'Ext.data.Model',
    fields: [
        'id', 'isActive', 'validThrough', 'validFrom', 'owner', 'isForEncryption'
    ],
    belongsTo: 'DocWorkflow'
});