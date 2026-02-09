Ext.define('COURIERONLINE.store.Inspections', {
    extend: 'Ext.data.Store',

    requires: ['Ext.data.writer.Json'],

    model : 'COURIERONLINE.model.Inspection',

    remoteSort: true,
    pageSize  : 10,
    proxy     : {
        reader        : {
            type: 'json',
            root: 'items'
        },
        writer: {
            root: 'inspection',
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
            obj   : 'operator'
        },
        api: {
            read: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'getInspections'
            })),
            update: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'updateInspection'
            })),
            destroy: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'deleteInspection'
            })),
            create: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'addInspection'
            }))
        }
    }
});