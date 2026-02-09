Ext.define('COURIERONLINE.overrides.form.Action', {
    override: 'Ext.form.action.Action'//,
    /*
    createCallback: function () {
        var me = this,
            undef,
            form = me.form;
        return {
            success: me.onSuccess,
            failure: me.onFailure,
            onFailureInSuccess: me.onFailureInSuccess,
            scope  : me,
            timeout: (this.timeout * 1000) || (form.timeout * 1000),
            upload : form.fileUpload ? me.onSuccess : undef
        };
    }
    */
});