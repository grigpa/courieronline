Ext.define('COURIERONLINE.overrides.VTypes', {
    override: 'Ext.form.VTypes',
    password    : function (val, field) {
        if (field.initialPassField) {
            var pwd = Ext.ComponentQuery.query('[itemId=' + field.initialPassField + ']')[0];
            return pwd && val === pwd.getValue();
        }
        return true;
    },
    passwordText: 'Неверное подтверждение пароля',

    fileXML: function (val) {
        var fileName = /^.*\.(xml)$/i;
        return fileName.test(val);
    },
    fileXMLText: 'файл должен быть с расширением XML'

});