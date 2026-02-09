/**
 * Сервис для подписания и отправки выбранных документов
 */
Ext.define('COURIERONLINE.services.SignAndSend', {

    requires: [
        'COURIERONLINE.view.SendWin', 'COURIERONLINE.services.EDSService'
    ],

    msgNoData            : 'Нет данных по выбранным документам',
    msgInvalidPacketData : 'Ошибка получения данных по выбранным документам',
    msgNoPacketsSelected : 'Не выбраны документы',
    msgCannotFetchContent: 'Ошибка получения содержимого документа',
    msgSendError         : 'Ошибка при отправке документов',
    msgSignError         : 'Ошибка при подписи некоторых документов',
    msgAlreadySigned     : 'Выбранные документы уже подписаны',

    msgSignErrorDetails: '',
    hideMask             : false,

    /**
     * Сервис осуществляющий криптографическую подпись,
     * инициализируется в методе step2ShowWindow
     */
    getCryptoService: function () {
        this.cryptoService = this.cryptoService || Ext.create('COURIERONLINE.services.EDSService');
        return this.cryptoService;
    },

    /**
     * Цепочка операций для подписи и отправки документов
     */
    signAndSend: function (documentIds) {
        var dfd = Ext.create('Ext.ux.Deferred');

        this.msgSignErrorDetails = '';
        this.step1GetPackets(documentIds)
            .then(Ext.bind(this.step2ShowWindow, this))
            .then(Ext.bind(this.step3Sign, this))
            .then(Ext.bind(this.step4Send, this))
            .done(function (win, msg) {
                if (win) {
                    win.close();
                }
                dfd.resolve(msg);
            }).fail(function (err, packets) {
                dfd.reject(err, packets);
            });

        return dfd;
    },

    /**
     * Получение списка пакетов по выбранным документоборотам
     *
     * формат ответа от сервера:
     * [{id: '123', docs: [{id  : '123', name: 'qqqq'}]}]
     *
     * @param documentIds - идентификаторы документоборотов
     * @returns {Deferred|*}
     * @private
     */
    step1GetPackets: function (documentIds) {
        var dfd = Ext.create('Ext.ux.Deferred'), me = this;

        if (documentIds && documentIds.length) {
            Ext.Ajax.request({
                url    : Ext.global.baseUrl,
                method : 'GET',
                hideMask: me.hideMask,
                params : {
                    action: 'invoke',
                    mth   : 'getDocsForSign',
                    obj   : 'docRoutes',
                    ids   : Ext.encode(documentIds)
                },
                success: function (response) {
                    var res = Ext.decode(response.responseText, true);
                    if (res) {
                        dfd.resolve(res);
                    } else {
                        dfd.reject(me.msgNoData);
                    }
                },
                failure: function (response) {
                    var msg = me.msgInvalidPacketData;
                    if (response.responseText) {
                        msg += ':<br>' + response.responseText;
                    }
                    dfd.reject(msg);
                }
            });
        } else {
            dfd.rejectImmediately(me.msgNoPacketsSelected);
        }
        return dfd;
    },

    /**
     * Отобразить окно с документами, к-рые нужно подписать,
     * если документов нет, то окно не отображать
     *
     * @private
     * @param res
     * @returns {Deferred|*}
     */
    step2ShowWindow: function (res) {
        var dfd = Ext.create('Ext.ux.Deferred');
        var me = this;

        if (res.length) {
            var data = [];
            Ext.each(res, function (packet) {
                Ext.each(packet.docs, function (doc) {
                    data.push({
                        id  : doc.id,
                        name: doc.name,
                        url : doc.details
                    });
                });
            });
            me.progressStep = data.length ? (1 / data.length) : 1;
            var win = Ext.create('COURIERONLINE.view.SendWin', {
                listeners: {
                    'ok_click'    : function () {
                        me.okClick();
                    },
                    'cancel_click': function () {
                        me.cancelClick();
                    },
                    'afterrender' : function (obj) {
                        var grid = obj.down('gridpanel');
                        if (grid) {
                            grid.getStore().loadData(data);
                        }
                    },
                    'show'        : function () {
                        me.getCryptoService().init();
                    }
                }
            });
            win.show();
            /**
             * используется в тестах, так как неохота мокать все окно
             */
            this.okClick = function () {
                me.msgSignErrorDetails = '';
                dfd.resolve(win, Ext.clone(res));
                win.close();
            };
            this.cancelClick = function () {
                win.close();
                dfd.lastDfd = false;
            };
        } else {
            me.msgSignErrorDetails = '';
            dfd.resolveImmediately(null, Ext.clone(res));
        }
        return dfd;
    },

    /**
     * Подписываем все пакеты и передаем дальше список id из подписанных пакетов
     * @param win
     * @param res
     * @param [dfd]
     * @param [processedPackets] - обработанные пакеты
     * @param [notProcessedPackets] - не обработанные пакеты
     * @returns {Deferred|*}
     * @private
     */
    step3Sign: function (win, res, dfd, processedPackets, notProcessedPackets) {
        var me = this;
        dfd = dfd || Ext.create('Ext.ux.Deferred');
        processedPackets = processedPackets || [];
        notProcessedPackets = notProcessedPackets || [];

        if (res && res.length) {

            me.signPacket(res.shift(), win).done(function (packet) {
                processedPackets.push(packet);
                // переходим к подписи следующего пакета
                me.step3Sign(win, res, dfd, processedPackets, notProcessedPackets);
            }).fail(function (packet) {
                notProcessedPackets.push(packet);
                // переходим к подписи следующего пакета
                me.step3Sign(win, res, dfd, processedPackets, notProcessedPackets);
            });
        } else {
            // если больше пакетов нет, то переходим к следующему этапу
            dfd.resolveImmediately(win, processedPackets, notProcessedPackets);
            if (win) {
                me.progressFinish();
            }
        }
        return dfd;
    },

    /**
     * Подписываем все документы в пакете
     * @param packet - Пакет, документы к-го нужно подписать
     * @param win
     * @param [dfd]
     * @returns {Deferred|*}
     * @private
     */
    signPacket: function (packet, win, dfd) {
        var me = this;
        dfd = dfd || Ext.create('Ext.ux.Deferred');
        if (packet && packet.docs && packet.docs.length) {

            me.signDoc(packet.docs.shift()).done(function () {
                me.progressNext();
                // переходим к подписи следующего документа
                me.signPacket(packet, win, dfd);
            }).fail(function () {
                // если один из документов не подписан,
                // то весь пакет нельзя отпавлять на подпись
                dfd.reject(packet);
            });

        } else {
            // если больше документов в пакете нет,
            // то переходим к следующему пакету
            dfd.resolveImmediately(packet);
        }
        return dfd;
    },

    /**
     * Подписываем документ и отправляем его подпись
     * на сервер: сначала получаем его содержимое,
     * затем подписываем на клиенте,
     * затем отправляем подпись
     * @param doc
     * @returns {Deferred|*}
     * @private
     */
    signDoc: function (doc) {
        var dfd = Ext.create('Ext.ux.Deferred');
        this.getDocContent(doc)
            .then(Ext.bind(this.getDockSign, this))
            .then(Ext.bind(this.sendDocSign, this))
            .done(function () {
                dfd.resolve();
            })
            .fail(function () {
                dfd.reject();
            });
        return dfd;
    },

    /**
     * Получаем содержимое документа
     * @param doc
     * @returns {Deferred|*}
     * @private
     */
    getDocContent: function (doc) {
        var me = this;
        var dfd = Ext.create('Ext.ux.Deferred');
        Ext.Ajax.request({
            url    : Ext.global.baseUrl,
            method : 'GET',
            hideMask: me.hideMask,
            params : {
                action: 'invoke',
                mth   : 'getDocContent',
                obj   : 'docRoutes',
                id    : doc.id
            },
            success: function (response) {
                var responseText = Ext.decode(response.responseText, true);
                if (responseText.data) {
                    dfd.resolve(doc, responseText.data);
                } else {
                    dfd.reject(doc);
                }
            },
            failure: function (response) {
                var msg = response.responseText || me.msgCannotFetchContent;
                Ext.Msg.error(msg, function () {
                    dfd.reject(doc);
                });
            }
        });
        return dfd;
    },

    /**
     * Вычисление подписи документа
     * @param doc
     * @param data
     * @returns {Deferred|*}
     * @private
     */
    getDockSign: function (doc, data) {
        var dfd = Ext.create('Ext.ux.Deferred');
        this.getCryptoService().generateSign(data, function (sign) {
            if (sign) {
                dfd.resolveImmediately(doc, sign);
            } else {
                dfd.rejectImmediately();
            }
        });
        return dfd;
    },

    /**
     * Отправка подписи документа
     * @param doc
     * @param sign
     * @returns {Deferred|*}
     * @private
     */
    sendDocSign: function (doc, sign) {
        var me = this;
        var dfd = Ext.create('Ext.ux.Deferred');

        Ext.Ajax.request({
            url    : Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                action: 'invoke',
                mth   : 'addDocSignature',
                obj   : 'docRoutes'
            })),
            method : 'POST',
            hideMask: me.hideMask,
            params : {
                id  : doc.id,
                data: sign
            },
            success: function (/*response*/) {
                dfd.resolve();
            },
            failure: function (response) {
                if (response.responseText) {
                    me.msgSignErrorDetails += '<br>' + response.responseText;
                }
                dfd.reject(doc);
            }
        });
        return dfd;
    },

    /**
     * Отправка идентификаторов подписанных пакетов
     * @param win
     * @param packets
     * @param failedPackets
     * @returns {Deferred|*}
     * @private
     */
    step4Send: function (win, packets, failedPackets) {
        var dfd = Ext.create('Ext.ux.Deferred'), me = this;

        if (packets && packets.length) {
            Ext.Ajax.request({
                url    : Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                    action: 'invoke',
                    mth   : 'sendPackets',
                    obj   : 'docRoutes'
                })),
                hideMask: me.hideMask,
                method : 'POST',
                params : {
                    ids: Ext.encode(Ext.pluck(packets, 'id'))
                },
                success: function (/*response*/) {
                    dfd.resolve(win); // все удачно подписалось
                },
                failure: function (response) {
                    var msg = me.msgSendError;
                    if (response.responseText) {
                        msg += ':<br>' + response.responseText;
                    }
                    dfd.reject(msg);// кажется, что-то пошло не так
                }
            });
        } else if (failedPackets && failedPackets.length) {
            // некоторые пакеты не смогли подписаться
            dfd.failedPackets = failedPackets;
            dfd.rejectImmediately(me.msgSignError + (me.msgSignErrorDetails ? ':<br>' + me.msgSignErrorDetails : ''), failedPackets);
        }
        return dfd;
    },

    initProgress: function () {
        if (!this.progress) {
            this.progress = Ext.MessageBox.progress('', '');
            if (this.progress) {
                this.progress.value = 0;
            }
        }
    },

    progressNext: function () {
        this.initProgress();
        if (this.progress) {
            this.progress.value = this.progressStep + this.progress.value;
            this.progress.updateProgress(this.progress.value, 'Отправка', true);
        }
    },

    progressFinish: function () {
        if (this.progress) {
            this.progress.updateProgress(1, 'Завершено', true);
            this.progress.close();
        }
    }

});