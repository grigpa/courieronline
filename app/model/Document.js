Ext.define('COURIERONLINE.model.Document', {
    extend: 'Ext.data.Model',

    fields    : [
        'name', 'state', 'created', 'details', 'type', 'typeId', 'recipient', 'hasRejectedTag', 'hasAcceptedTag'
    ]

});