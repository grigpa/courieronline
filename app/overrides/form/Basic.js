/**
 * Не используется на данный момент в проекте!!!
 * Заготовка для биндинга валидаторов моделей на формы
 */
Ext.define('COURIERONLINE.overrides.form.Basic', {
    override: 'Ext.form.Basic',
    loadRecord         : function (record) {
        this._record = record;
        this.setModelValidations(record.validations);
        return this.setValues(record.data);
    },
    setModelValidations: function (validations) {
        var i;
        for (i = 0; i < validations.length; i++) {
            var fieldMatch = this.findField(validations[i].field);
            if (fieldMatch) {
                fieldMatch.setModelFieldValidation(validations[i]);
            }
        }
    }
});