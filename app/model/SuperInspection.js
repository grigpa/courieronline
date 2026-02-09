Ext.define('COURIERONLINE.model.SuperInspection', {
    extend: 'Ext.data.Model',

    fields    : [
        'id', 'name', 'systemName', 'type', {name: 'certificates', defaultValue: []}
    ]
});