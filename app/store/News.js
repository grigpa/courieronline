Ext.define('COURIERONLINE.store.News', {
    extend: 'Ext.data.Store',

    model: 'COURIERONLINE.model.News',

    remoteSort: true,
    pageSize: 50,
    proxy: {
        autoAbort: true,
        sortParam: 'orderBy',
        startParam: undefined,
        limitParam: 'itemsPerPage',
        simpleSortMode: true,
        type: 'ajax',
        url: Ext.global.baseUrl,
        extraParams: {
            action: 'invoke',
            filter: null,
            obj: 'respondent'
        },
        api: {
            read: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'getNews'
            }))
            /*
            ,
            destroy: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'deleteDoc'
            }))
            */
        }
    }
});