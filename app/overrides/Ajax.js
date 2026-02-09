/**
 * Переопределяем для глобальной обработки аякс ошибок
 */
Ext.define('COURIERONLINE.overrides.Ajax', {
    override: 'Ext.Ajax',
    method  : 'GET',
    loadMask: null,
    loadMaskTimeout: null,

    unAuthorizedErrorMsg: 'Сессия не содержит информации о пользователе',

    initLoadMask: function () {
        this.loadMask = this.loadMask || new Ext.LoadMask(Ext.getBody(), {msg: 'Выполняется запрос...'});
    },

    hideMask             : function () {
        clearTimeout(this.loadMaskTimeout);
        if (this.loadMask) {
            this.loadMask.hide();
        }
    },

    request           : function (options) {
        var me = this;
        if (!me.hasListener('beforerequest')) {
            me.on('beforerequest', me.onBeforeRequest);
        }
        me.on('requestcomplete', me.hideMask, me);
        me.on('requestexception', me.hideMask, me);
        options = Ext.applyIf(options, {
            failure: me.onFailureDefault,
            onFailureInSuccess: me.onFailureInSuccess
        });
        options.failure = Ext.Function.createInterceptor(
            options.failure, Ext.bind(me.onBeforeFailure, me));
        options.onFailureInSuccess = Ext.Function.createInterceptor(
            Ext.bind(options.onFailureInSuccess, me), Ext.bind(me.onBeforeFailure, me));
        me.callParent([options]);
    },

    onBeforeFailure: function (response/*, opts*/) {
        if (response.responseText === this.unAuthorizedErrorMsg) {
            this.hideMask();
            Ext.Msg.error(response.responseText, function () {
                Ext.global.APPLICATION.fireEvent('login_form');
            }, this);
            return false; // не выполнять остальные обработчики onfailure
        }
        return true;
    },

    onBeforeRequest   : function (el, options) {
        var me = this;
        if (!options.hideMask) {
            clearTimeout(this.loadMaskTimeout);
            this.loadMaskTimeout = setTimeout(function () {
                me.initLoadMask();
                me.loadMask.show();
            }, 500);
        }

        options.success = (function (origin) {
            return function (response, options) {
                var result = true;
                try {
                    me.processingResponse(response);
                } catch (ex) {
                    result = options.onFailureInSuccess(response, options, ex);
                }
                if (result && origin) {
                    origin.call(this, response, options);
                }
            };
        }(options.success));
    },

    onFailureInSuccess: function (response, options, msg) {
        Ext.Msg.error(msg ? (msg.message || msg) : '');
    },

    onFailureDefault  : function (response, opts) {
        var msg = Ext.String.format('{2}',
            response.status,
            Ext.String.urlAppend(opts.url, Ext.Object.toQueryString(opts.params)),
            response.responseText
        );
        Ext.Msg.error(msg);
    },

    processingResponse: function (response, raiseException) {
        raiseException = raiseException || true;

        if (response.responseText) {
            var responseMsg = Ext.decode(response.responseText, true);
            if (responseMsg && (responseMsg.success === false || responseMsg.success === 'false') && raiseException) {
                throw responseMsg.msg;
            }
            if (response.responseText === this.unAuthorizedErrorMsg) {
                throw response.responseText;
            }
        }
        return response;
    }
});
