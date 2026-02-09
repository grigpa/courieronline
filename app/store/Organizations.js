Ext.define('COURIERONLINE.store.Organizations', {
    extend: 'Ext.data.Store',

    model : 'COURIERONLINE.model.Organization',

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
            expandData: true,
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
            obj: 'operator'
        },
        api: {
            read: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'getClients'
            })),
            update: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'updateClient'
            })),
            destroy: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'deleteClient'
            })),
            create: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'addClient'
            }))
        }
    }
});