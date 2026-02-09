Ext.define('COURIERONLINE.model.PostServerInfo', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'smtpHost', type: 'string'},
        {name: 'pop3Host', type: 'string'},
        {name: 'pop3Port', type: 'string'},
        {name: 'smtpPort', type: 'string'},
        {name: 'address', type: 'string'},
        {name: 'login', type: 'string'},
        {name: 'password', type: 'string'}
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
                mth: 'getStatPostServer'
            })),
            update: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'setStatPostServer'
            }))
        }
    }
});