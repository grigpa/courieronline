/**
 * ТОГС - Территориальные Органы Государственной Статистики
 */
Ext.define('COURIERONLINE.store.Togs', {
    extend: 'Ext.data.Store',

    fields: ['id', 'systemName', 'name', 'type'],
    proxy     : {
        reader        : {
            type: 'json',
            root: 'items'
        },
        type          : 'ajax',
        url           : Ext.global.baseUrl,
        extraParams   : {
            action: 'invoke',
            obj: 'operator',
            mth: 'getAllInspections'
        }
    }
});