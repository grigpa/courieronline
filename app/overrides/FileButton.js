/**
 * добавлена поддержка аттрибута accept
 */
Ext.define('COURIERONLINE.overrides.FileButton', {
    override : 'Ext.form.field.FileButton',
    renderTpl: [
        '<span id="{id}-btnWrap" class="{baseCls}-wrap',
        '<tpl if="splitCls"> {splitCls}</tpl>',
        '{childElCls}" unselectable="on">',
        '<span id="{id}-btnEl" class="{baseCls}-button">',
        '<span id="{id}-btnInnerEl" class="{baseCls}-inner {innerCls}',
        '{childElCls}" unselectable="on">',
        '{text}',
        '</span>',
        '<span role="img" id="{id}-btnIconEl" class="{baseCls}-icon-el {iconCls}',
        '{childElCls} {glyphCls}" unselectable="on" style="',
        '<tpl if="iconUrl">background-image:url({iconUrl});</tpl>',
        '<tpl if="glyph && glyphFontFamily">font-family:{glyphFontFamily};</tpl>">',
        '<tpl if="glyph">&#{glyph};</tpl><tpl if="iconCls || iconUrl">&#160;</tpl>',
        '</span>',
        '</span>',
        '</span>',
        '<input id="{id}-fileInputEl" class="{childElCls} {inputCls}" accept="{acceptedTypes}" {multiple} ' +
            'type="file" size="1" name="{inputName}">'
    ],

    getTemplateArgs: function () {
        var args = this.callParent();
        args.acceptedTypes = this.acceptedTypes;
        args.multiple = this.multiple;
        return args;
    },

    /**
     * Переопределяем метод,
     * чтобы не пропадали наши дополнительные аттрибуты после перерисовки
     * @param isTemporary
     */
    createFileInput : function (isTemporary) {
        var me = this;
        var config = {
            name: me.inputName,
            id  : !isTemporary ? me.id + '-fileInputEl' : undefined,
            cls : me.inputCls,
            tag : 'input',
            type: 'file',
            size: 1
        };
        if (me.renderData) {
            if (me.renderData.acceptedTypes) {
                config.accept = me.renderData.acceptedTypes;
            }
            if (me.renderData.multiple) {
                config.multiple = me.renderData.multiple;
            }
        }
        me.fileInputEl = me.el.createChild(config);
        me.fileInputEl.on('change', me.fireChange, me);
    }


});