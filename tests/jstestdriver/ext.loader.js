Ext.Loader.setPath('COURIERONLINE', '/test/app');
Ext.Loader.setPath('TEST', '/test/jstestdriver');
Ext.Loader.setConfig({ enabled: true, syncModeEnabled: true, disableCaching: true });
Ext.define('Ext.data.proxy.Server', {override: 'Ext.data.proxy.Server', noCache: false });