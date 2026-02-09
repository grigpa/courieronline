Ext.define('COURIERONLINE.store.Documents', {
    extend: 'Ext.data.Store',

    model: 'COURIERONLINE.model.Document',

    remoteSort: true,
    pageSize: 50,
    proxy: {
        autoAbort: true,
        reader: {
            type: 'json',
            root: 'items'
        },
        sortParam: 'orderBy',
        startParam: undefined,
        limitParam: 'itemsPerPage',
        simpleSortMode: true,
        type: 'ajax',
        url: Ext.global.baseUrl,
        extraParams: {
            action: 'invoke',
            filter: null,
            obj: 'docRoutes'
        },
        api: {
            read: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'getDocRouteList'
            })),
            destroy: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'deleteDoc'
            }))
        }
    }
});