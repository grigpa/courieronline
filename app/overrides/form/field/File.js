Ext.define('COURIERONLINE.overrides.form.field.File', {
    override: 'Ext.form.field.File',

    /**
     * Gets the markup to be inserted into the subTplMarkup.
     */
    getTriggerMarkup: function () {
        return '<td id="' + this.id + '-browseButtonWrap" class="browseButtonWrap"></td>';
    }

});