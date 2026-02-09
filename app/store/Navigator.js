Ext.define('COURIERONLINE.store.Navigator', {
    extend             : 'Ext.data.TreeStore',
    autoLoad           : false,
    fields             : ['name', 'js', 'counter', 'className'],
    defaultRootProperty: 'items'
});