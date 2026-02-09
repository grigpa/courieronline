Ext.Loader.setConfig({
    enabled : true,
    disableCaching: false
});
Ext.Loader.setPath('Ext.ux', 'app/ux');
Ext.application({
    name: 'COURIERONLINE',

    extend: 'COURIERONLINE.Application',
    
    init: function () {
        Ext.data.proxy.Server.prototype.noCache = false;
        Ext.Ajax.disableCaching = false;
    }
});
