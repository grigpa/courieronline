Ext.define('COURIERONLINE.overrides.History', {
    override : 'Ext.util.History',

    require: ['Ext.ux.Router'],

    go: function (path) {
        Ext.History.un('change', Ext.ux.Router.parse, Ext.ux.Router);
        Ext.History.add(path);
        Ext.History.on('change', function () {
            Ext.History.on('change', Ext.ux.Router.parse, Ext.ux.Router);
        });
    }

});
