Ext.define('COURIERONLINE.overrides.Button', {
    override: 'Ext.button.Button',

    padding: 3,

    initComponent: function () {
        this.on('click', function (p) {
            if (p.disabledOnClick) {
                p.removeClsWithUI('focus');
            }
        });

        var formButtons = ['Сохранить', 'Закрыть', 'Отмена', 'OK'];
        var icons = {
            'Сохранить': 'icon-accepted',
            'Закрыть'  : 'icon-rejected',
            'Отмена'   : 'icon-rejected',
            'Добавить' : 'icon-plus',
            'Удалить'  : 'icon-minus'
        };
        if (Ext.Array.indexOf(formButtons, this.text) !== -1) {
            this.ui = 'form-action';
            this.padding = '5';
        }
        if (this.text in icons) {
            this.iconCls = this.iconCls || icons[this.text];
        }

        this.callParent();
    }

});