Ext.define('COURIERONLINE.store.Operators', {
    extend: 'Ext.data.Store',

    model : 'COURIERONLINE.model.Operator',

    requires: ['Ext.data.writer.Json'],

    remoteSort: true,
    pageSize  : 10,
    proxy     : {
        reader        : {
            type: 'json',
            root: 'items'
        },
        writer: {
            root: 'data',
            encode: true
        },
        sortParam     : 'orderBy',
        startParam    : undefined,
        limitParam    : 'itemsPerPage',
        simpleSortMode: true,
        type          : 'ajax',
        url           : Ext.global.baseUrl,
        extraParams   : {
            action: 'invoke',
            obj: 'admin'
        },
        api: {
            read: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'getOperators'
            })),
            update: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'updateOperator'
            })),
            destroy: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'deleteOperator'
            })),
            create: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'addOperator'
            }))
        }
    }
});