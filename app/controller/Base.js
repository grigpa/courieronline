Ext.define('COURIERONLINE.controller.Base', {
    extend: 'Ext.app.Controller',
    stores: ['Notice'],
    requires: ['COURIERONLINE.services.SignAndSend'],

    init: function () {
        this.control({
            'appNavigator #navigator': {
                itemclick: this.onMenuItemClick
            },
            'appNotice #notice': {
                itemclick: this.onNoticeItemClick
            },
            'appNotice': {
                afterrender: this.addNoticeCorner
            }
        });
    },

    addNoticeCorner: function() {
        var d = document.createElement('div');
        d.className = 'appNoticeCorner';
        d.id = 'appNoticeCorner';
        d.innerHTML = ' ';
        Ext.ComponentQuery.query('appNotice #notice')[0].getEl().appendChild(new Ext.Element(d));

    },


    getDocsForSign: function (docflowIds, footerPb, footerPbTT) {
        var me = this;

        footerPb.updateProgress(1, 'Идет отправка пакетов');

        var signSendService = Ext.create('COURIERONLINE.services.SignAndSend');
        signSendService.hideMask = true;
        var mAlert = function (msg) {
            footerPb.updateProgress(1, msg || 'Обработка закончена');
            Ext.ComponentQuery.query('appNotice #notice')[0].hide();
            setTimeout(function () {
                footerPb.updateProgress(0, '');
                footerPb.updateText('');
                footerPbTT.hide();
                COURIERONLINE.getApplication().getStore('Documents').reload({callback: function () {
                    COURIERONLINE.getApplication().getController('Main').loadNavNotifications();
                }});
            }, 2000);
        };
        Ext.Ajax.request({
            url: Ext.global.baseUrl,
            method: 'POST',
            hideMask: true,
            params: {
                mth: 'getDocsForSign',
                action: 'invoke',
                ids: Ext.encode(docflowIds),
                obj: 'docRoutes'
            },
            success: function (response) {
                var res = Ext.decode(response.responseText, true);
                var dfd = Ext.create('Ext.ux.Deferred');


                signSendService.step3Sign(null, res)
                    .then(Ext.bind(signSendService.step4Send, signSendService))
                    .done(function (win, msg) {
                        dfd.resolve(msg);
                        COURIERONLINE.getApplication().getController('Main').loadNavNotifications(function () {
                            signSendService.progressFinish();
                            mAlert(msg);
                        });
                    }).fail(function (err, packets) {
                        dfd.reject(err, packets);
                        var newPacketCount = packets.length;
                        var newStore = me.getNoticeStore();
                        newStore.getNodeById('sendreceipt').data.counter = newPacketCount;
                        Ext.ComponentQuery.query('appNotice #notice')[0].reconfigure(newStore);
                        COURIERONLINE.getApplication().getController('Main').loadNavNotifications(function () {
                            signSendService.progressFinish();
                            mAlert(err);
                        });
                    });
            },
            failure: function () {
                signSendService.progressFinish();
                mAlert(Msg.error);
            }
        });

    },

    sendEncryptedDoc: function (i, countNewDoc, footerPb, footerPbTT, EDSService, docs, docflowIds) {
        var me = this;
        Ext.Ajax.request({
            url: Ext.global.baseUrl,
            method: 'POST',
            hideMask: true,
            params: {
                mth: 'getDocEncryptedData',
                action: 'invoke',
                id: docs[i].id,
                obj: 'docRoutes'
            },
            success: function (response) {
                var base64Doc = Ext.decode(response.responseText);
                var encData = base64Doc.data;

                var f = function () {
                    var pos = ((i + 1) / countNewDoc);
                    footerPb.updateProgress(pos, (i + 1) + ' из ' +
                        countNewDoc + ' документ(ов) обработано');
                    if ((i + 1) < countNewDoc) {
                        i++;
                        me.sendEncryptedDoc(i, countNewDoc, footerPb, footerPbTT, EDSService, docs, docflowIds);
                    } else {
                        me.getDocsForSign(docflowIds, footerPb, footerPbTT);
                    }
                };

                var edsDataDoc = EDSService._decryptContent(encData, EDSService._getFirstCert());
                if (edsDataDoc) {
                    Ext.Ajax.request({
                        url: Ext.global.baseUrl,
                        hideMask: true,
                        method: 'POST',
                        params: {
                            action: 'invoke',
                            mth: 'setDocDecryptedData',
                            id: docs[i].id,
                            data: edsDataDoc,
                            obj: 'docRoutes'
                        },
                        success: function () {
                            f();
                        },
                        failure: function () {
                            f();
                        }
                    });
                } else {
                    f();
                }
            },
            failure: function () {
            }
        });
    },

    onNoticeItemClickNewDoc: function () {
        var me = this;
        var footerPb = Ext.ComponentQuery.query('appMain #footerpb')[0];
        var footerPbTT = Ext.ComponentQuery.query('appMain #footerpbTooltip')[0];//.showAt([Ext.getBody().getWidth(), Ext.getBody().getHeight() - 100]);

        Ext.Ajax.request({
            url: Ext.global.baseUrl,
            method: 'GET',
            hideMask: true,
            params: {
                mth: 'getDocsForDecrypt',
                action: 'invoke',
                obj: 'docRoutes'
            },
            success: function (response) {
                var jsonDoc = Ext.decode(response.responseText);
                if (jsonDoc.length === 0) {
                    return;
                }
                var docs = [];

                Ext.Array.each(jsonDoc, function (record) {
                    docs = docs.concat(record.docs);
                });

                var countNewDoc = docs.length;
                var i = 0;

                var EDSService;

                EDSService = Ext.create('COURIERONLINE.services.EDSService');
                EDSService._initPlugin();
                EDSService._initPluginObjects();

                if (!EDSService._checkPlugin()) {
                    return;
                }

                footerPbTT.showAt([Ext.getBody().getWidth(), Ext.getBody().getHeight() - 100]);
                var docflowIds = [];//Ext.pluck(jsonDoc, 'docflowId');
                Ext.Array.each(jsonDoc, function (record) {
                    docs = docs.concat(record.docs);
                });
                me.sendEncryptedDoc(i, countNewDoc, footerPb, footerPbTT, EDSService, docs, docflowIds);

            },
            failure: function () {
            }
        });
    },

    onNoticeItemClickSendReceipt: function () {
        var me = this;
        if (me.getNoticeStore().getById('sendreceipt').get('ids') === '') {
            return;
        }
        var documentIds = me.getNoticeStore().getById('sendreceipt').get('ids').split(',');

        var signSendService = Ext.create('COURIERONLINE.services.SignAndSend');
        signSendService.signAndSend(documentIds)
            .done(function (msg) {
                if (msg) {
                    Ext.Msg.alert(Msg.attention, msg);
                }
                me.outbox(documentIds);
            })
            .fail(function (err) {
                Ext.Msg.error(err);
            });
    },

    onNoticeItemClickNewMsg: function () {
        return false;
    },

    onNoticeItemClickNewNews: function () {
        return false;
    },


    onNoticeItemClick: function (obj, record) {
        if (record.data.id === 'newdoc') {
            this.onNoticeItemClickNewDoc();
        }
        if (record.data.id === 'sendreceipt') {
            this.onNoticeItemClickSendReceipt();
        }
        if (record.data.id === 'newmsg') {
            this.onNoticeItemClickNewMsg();
        }
        if (record.data.id === 'newnews') {
            this.onNoticeItemClickNewNews();
        }

    },

    onMenuItemClick: function (obj, record/*, item, index, e, eOpts */) {
        Ext.ComponentQuery.query('appNews')[0].removeCls('appNewsSelected');
        var filterParams = record.get('js').split(',');
        var filterValue = filterParams[1];
        if (filterValue) {
            Ext.ux.Router.pause = false;
            Ext.History.add('#' + filterValue);
        }
    },

    getNavigator: function () {
        return Ext.ComponentQuery.query('#navigator')[0];
    },

    getWorkspace: function () {
        return Ext.ComponentQuery.query('appWorkspace')[0];
    },

    clickFirstMenuItem: function () {
        try {
            this.getNavigator().getView().getNode(0).click();
        } catch (ex) {
            return false;
        }
        return true;
    },

    selectMenuItem: function (text, key) {
        var navigator = this.getNavigator();
        var item = navigator && navigator.getRootNode().findChild('name', text);
        if (!item) {
            return false;
        }
        try {
            navigator.getSelectionModel().select(item);
            if (key) {
                Ext.ux.Router.pause = true;
                Ext.History.add('#' + key);
            }
        } catch (ex) {
            return false;
        }
        return true;
    },

    tryToInvoke: function (fn, ctx) {
        var me = ctx || this;
        var func = function () {
            func.executeCount = func.executeCount || 0;
            func.executeCount++;
            if (func.executeCount > 10) {
                Ext.log(Msg.cannotPerformRequest);
                Ext.log({dump: true}, fn);
                return;
            }
            var result = false;
            try {
                result = fn.call(me);
            } catch (ex) {
                Ext.log(ex);
            }
            if (!result) {
                Ext.defer(func, 500, me); // попробуем выполнить операцию позже
            }
        };
        func();
    }

});