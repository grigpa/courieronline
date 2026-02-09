Ext.define('COURIERONLINE.overrides.JsonWriter', {
    override: 'Ext.data.writer.Json',

    writeRecords: function (request, data) {
        if (request.action === 'destroy') {
            if (!data.length || data.length === 1) {
                request.params.id = data[0] ? data[0].id : data.id;
                request.params.ids = Ext.encode([request.params.id]);
            } else if (data.length > 1) {
                request.params.ids = Ext.encode(Ext.pluck(data, 'id'));
            }
            return request;
        } else {
            return this.callOverridden([request, data]);
        }
    }
});