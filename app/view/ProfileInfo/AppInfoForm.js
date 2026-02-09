Ext.define('COURIERONLINE.view.ProfileInfo.AppInfoForm', {
    extend: 'Ext.form.Panel',

    alias: 'widget.appInfoForm',

    itemId  : 'appInfo',
    defaults: {
        margin    : '10 10 0 10',
        readOnly  : true,
        labelWidth: 200
    },
    items   : [
        {
            xtype     : 'textfield',
            fieldLabel: 'Наименование программы',
            name      : 'appName'
        },
        {
            xtype     : 'textfield',
            fieldLabel: 'Версия',
            name      : 'appVersion'
        },
        {
            xtype     : 'textfield',
            fieldLabel: 'Версия БД',
            name      : 'dbVersion'
        },
        {
            xtype     : 'textfield',
            fieldLabel: 'Сборка',
            name      : 'appPackageNumber'
        },
        {
            xtype     : 'textfield',
            fieldLabel: 'Браузер',
            name      : 'browser'
        }
    ]

});