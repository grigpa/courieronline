Ext.define('COURIERONLINE.store.Docflows', {
    extend: 'Ext.data.Store',

    requires: ['Ext.data.writer.Json'],

    model: 'COURIERONLINE.model.Docflow',

    remoteSort: true,
    pageSize: 10,
    proxy: {
        reader: {
            type: 'json',
            root: 'items'
        },
        writer: {
            root: 'docflow',
            encode: true
        },
        sortParam: 'orderBy',
        startParam: undefined,
        limitParam: 'itemsPerPage',
        simpleSortMode: true,
        type: 'ajax',
        url: Ext.global.baseUrl,
        extraParams: {
            action: 'invoke',
            obj: 'operator'
        },
        api: {
            read: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'getDocRouteList'
            })),
            update: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'updateDocflow'
            })),
            destroy: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'deleteDocflow'
            })),
            create: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'addDocflow'
            }))
        }
    }
});