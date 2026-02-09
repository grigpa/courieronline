Ext.define('COURIERONLINE.model.AppInfo', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'appName', type: 'string'},
        {name: 'appVersion', type: 'string'},
        {name: 'dbVersion', type: 'string'},
        {name: 'appPackageNumber', type: 'string'},
        {name: 'browser', type: 'string'}
    ],
    getBrowser: function () {
        return 'IE';
    },
    proxy: {
        type: 'memory',
        data: {
            appName: 'COURIERONLINE',
            appVersion: '0.1',
            dbVersion: '0.1',
            appPackageNumber: '0.2',
            browser: 'Chrome'
        }
    },
    _proxy: {
        type: 'ajax',
        url: Ext.global.baseUrl,
        extraParams   : {
            action: 'invoke',
            obj: 'profile',
            mth: 'getApplicationInfo'
        }
    }
});