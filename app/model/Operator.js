Ext.define('COURIERONLINE.model.Operator', {
    extend: 'Ext.data.Model',

    fields: [
        'id', 'name', 'statSubjectId', 'pfrSubjectId', 'login', {name: 'certificates', defaultValue: []}
    ]

});