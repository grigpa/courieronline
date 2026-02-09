Ext.define('COURIERONLINE.model.OperatorInfo', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'statSubjectId', type: 'string'},
        {name: 'pfrSubjectId', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'login', type: 'string'},
        {name: 'email', type: 'string'},
        {name: 'certificates', defaultValue: []}
    ],

    proxy: {
        type: 'ajax',
        extraParams   : {
            action: 'invoke',
            obj: 'operator'
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