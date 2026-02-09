Ext.define('COURIERONLINE.model.Organization', {
    extend: 'Ext.data.Model',

    fields: [
        'id', 'name', 'systemName', 'inn', 'kpp', 'ogrn',
        'okpo', 'email', {name: 'certificates', defaultValue: []},
        'inspection.id', 'inspection.name', 'pfrInspection.id', 'pfrInspection.name',
        'pfrSystemName', 'pfrInspection', /*'regNum',*/ 'usesThickClient'
    ]

});