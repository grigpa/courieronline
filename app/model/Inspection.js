Ext.define('COURIERONLINE.model.Inspection', {
    extend: 'Ext.data.Model',

    fields    : [
        'id', 'name', 'systemName', 'email', 'type', {name: 'certificates', defaultValue: []}
    ]
});