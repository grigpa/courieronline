Ext.define('COURIERONLINE.store.Notice', {
    extend             : 'Ext.data.TreeStore',
    autoLoad           : false,
    filter             : Ext.emptyFn,
    clearFilter        : Ext.emptyFn,
    fields             : ['id', 'cls', 'command', 'name', 'js', 'counter', 'ids'],
    defaultRootProperty: 'items'
});