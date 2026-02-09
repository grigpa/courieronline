Ext.define('COURIERONLINE.store.SuperInspections', {
    extend: 'Ext.data.Store',

    requires: ['Ext.data.writer.Json'],

    model : 'COURIERONLINE.model.SuperInspection',

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
        baseParams   : {
            action: 'invoke',
            obj   : 'admin'
        },
        api: {
            read: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'getInspections',
                action: 'invoke',
                obj   : 'admin'
            })),
            update: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'updateInspection',
                action: 'invoke',
                obj   : 'admin'
            })),
            destroy: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'deleteInspection',
                action: 'invoke',
                obj   : 'admin'
            })),
            create: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'addInspection',
                action: 'invoke',
                obj   : 'admin'
            }))
        }
    }
});