/**
 * инициализация глобальных переменных
 * перед стартом всего приложения
 */
Ext.define('COURIERONLINE.Startup', {
    extend: 'Ext.Base'
});

Ext.global.baseUrl = Ext.global.baseUrl || '/ccwe/main';
Ext.global.rootUrl = Ext.global.rootUrl || location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1);
Ext.BLANK_IMAGE_URL = (Ext.isIE6 || Ext.isIE7)
    ? Ext.global.rootUrl + '/ext/packages/ext-theme-gray/build/resources/images/tree/s.gif'
    : 'data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';