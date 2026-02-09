Ext.define('COURIERONLINE.store.Tasks', {
    extend: 'Ext.data.Store',

    requires: ['Ext.data.writer.Json'],

    model : 'COURIERONLINE.model.Task',

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
            obj   : 'admin'
        },
        api: {
            read: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'getTasks'
            })),
            update: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'updateTask'
            })),
            destroy: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'deleteTask'
            })),
            create: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'addTask'
            }))
        }
    }
});