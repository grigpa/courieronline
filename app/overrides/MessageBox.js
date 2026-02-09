Ext.define('COURIERONLINE.overrides.MessageBox', {
    override: 'Ext.window.MessageBox',

    errorTitle: 'Ошибка',

    msgCt: null,

    constructor: function () {
        this.callParent(arguments);
        Ext.onReady(this._init, this);
    },

    /**
     *
     * @param msg
     * @param [fn]
     * @param [scope]
     */
    error: function (msg, fn, scope) {
        msg = msg || 'Неизвестная ошибка';
        var cfg = {
            title   : this.errorTitle,
            msg     : msg.split('\r').join('<br>').split('\n').join('<br>'),
            buttons : this.OK,
            fn      : fn,
            icon    : this.ERROR,
            scope   : scope,
            minWidth: this.minWidth
        };
        return this.show(cfg);
    },

    _createBox: function (t, s) {
        return '<div class="msg"><h3>' + t + '</h3><p>' + s + '</p></div>';
    },

    /**
     * Вывод всплывающего сообщения
     * @param title
     * @param msg
     * @param msgParams
     */
    notify: function (title) {
        this._init();
        var s = '';
        try {
            s = arguments.length > 1 ?
                Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1)) : '';
        } catch (ex) {
            Ext.log(ex);
        }
        var m = Ext.DomHelper.append(this.msgCt, this._createBox(title, s), true);
        var hideMsgFn = function () {
            m.ghost('t', { remove: true});
        };
        m.on('click', hideMsgFn);
        setTimeout(hideMsgFn, 7000);
        m.slideIn('t');
        Ext.log(arguments);
    },

    _init: function () {
        if (!this.msgCt) {
            // It's better to create the msg-div here in order to avoid re-layouts
            // later that could interfere with the HtmlEditor and reset its iFrame.
            this.msgCt = Ext.DomHelper.insertFirst(document.body, {id: 'msg-div'}, true);
        }
    }


});