/**
 * Не используется на данный момент в проекте!!!
 * Заготовка для биндинга валидаторов моделей на формы
 */
Ext.define('COURIERONLINE.overrides.form.field.Base', {
    override: 'Ext.form.field.Base',

    setModelFieldValidation: function (validation) {
        this.modelValidations = Ext.isArray(this.modelValidations) ? this.modelValidations : [];
        this.modelValidations.push(validation);
    },
    getModelErrors         : function (value) {
        var errors = Ext.create('Ext.data.Errors'),
            validations = this.modelValidations,
            validators = Ext.data.validations,
            length, validation, field, valid, type, i;

        if (validations) {
            length = validations.length;

            for (i = 0; i < length; i++) {
                validation = validations[i];
                field = validation.field || validation.name;
                type = validation.type;
                valid = validators[type](validation, value);

                if (!valid) {
                    errors.add({
                        field  : field,
                        message: Ext.String.format(validation.message || validators[type + 'Message'])
                    });
                }
            }
        }
        return errors;
    },
    validateValue          : function (value) {
        var me = this,
            errors = me.getErrors(value),
            modelErrors = me.getModelErrors(value),
            isValid = Ext.isEmpty(errors) && modelErrors.isValid();

        if (!me.preventMark) {
            if (isValid) {
                me.clearInvalid();
            } else {
                if (!modelErrors.isValid()) {
                    modelErrors.each(function () {
                        errors.push(this.message);
                    });
                }
                me.markInvalid(errors);
            }
        }
        return isValid;
    }
});