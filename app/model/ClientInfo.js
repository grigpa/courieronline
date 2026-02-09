Ext.define('COURIERONLINE.model.ClientInfo', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'certificates', defaultValue: []},
        {name: 'email', type: 'string'},
        {name: 'inn', type: 'string'},
        {name: 'inspection.id'},
        {name: 'kpp', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'ogrn', type: 'string'},
        {name: 'okpo', type: 'string'},
        {name: 'pfrSystemName', type: 'string'},
        {name: 'pfrInspection', type: 'string'},
        {name: 'systemName', type: 'string'}
    ],

    proxy: {
        type: 'ajax',
        extraParams   : {
            action: 'invoke',
            obj: 'respondent'
        },
        writer: {
            root: 'data',
            encode: true
        },
        api: {
            read: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'getInfo'
            })),
            update: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'setInfo'
            }))
        }
    }

});