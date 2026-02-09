Ext.define('COURIERONLINE.store.Templates', {
    extend: 'Ext.data.Store',

    requires: ['Ext.data.writer.Json'],

    model : 'COURIERONLINE.model.Template',

    proxy     : {
        reader        : {
            type: 'json',
            root: 'items'
        },
        writer: {
            root: 'data',
            encode: true
        },
        type          : 'ajax',
        url           : Ext.global.baseUrl,
        extraParams   : {
            action: 'invoke',
            obj   : 'stat'
        },
        api: {
            read: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'getTemplateList'
            })),
            destroy: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'deleteTemplates'
            }))
        }
    }
});