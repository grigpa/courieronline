Ext.define('Ext.ux.ErrorReader', {
    isReader: true,
    alias: 'reader.not_empty_json',
    read: function (response) {
        response = Ext.decode(response.responseText, true);
        return { success: !!response, records: [] };
    }
});