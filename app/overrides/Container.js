Ext.define('COURIERONLINE.overrides.Container', {
    override: 'Ext.container.Container',

    initComponent: function () {
        this.callOverridden();

        /**
         * Добавляем возможность реагировать на клики для всех контейнеров
         */
        this.on('afterrender', function (p) {
            p.getEl().on('click', function () {
                p.fireEvent('click');
            });
        });
    }
});