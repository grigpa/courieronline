Ext.define('COURIERONLINE.model.Docflow', {
    extend: 'Ext.data.Model',

    fields    : [
        'id', 'type', 'name', 'detail', 'created',
        'state', 'sender', 'recipient',
        'hasAcceptedTag', 'hasRejectedTag'
    ]
});