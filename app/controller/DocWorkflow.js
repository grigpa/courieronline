Ext.define('COURIERONLINE.controller.DocWorkflow', {
    extend: 'Ext.app.Controller',
    views: [
        'Document.DocWorkflowList',
        'Document.DocWorkflowRoot'
    ],
    stores: [
        'DocWorkflow'
    ],
    models: ['DocWorkflowPacket', 'DocWorkflowCert', 'DocWorkflowAttach', 'DocWorkflow'],
    requires: ['COURIERONLINE.services.SignAndSend'],

    init: function () {
        var me = this;
        this.control({
            'docWorkflowRoot #documentPackets': {
                itemclick: function (obj, record, item, index, e/*, eOpts */) {
                    var el = e.getTarget();
                    while (el.tagName !== 'TR') {
                        el = el.parentNode;
                    }
                    if (!Ext.get(el).hasCls('x-grid-row-selected')) {
                        Ext.get(el).addCls('x-grid-row-selected');
                    }
                    if (Ext.DomQuery.select('.x-panel-documentOutbox')[0]) {
                        Ext.DomQuery.select('.x-panel-documentOutbox')[0].style.boxShadow = '2px 4px 10px -4px #808080';
                    }
                    if (Ext.DomQuery.select('.x-panel-documentInbox')[0]) {
                        Ext.DomQuery.select('.x-panel-documentInbox')[0].style.boxShadow = '2px 4px 10px -4px #808080';
                    }
                    Ext.get(Ext.DomQuery.select('.shadow')).removeCls('shadow');
                    if (record.get('docType') != 'STAT_DOC_LETTERAPPLICATION') {
                        me.showDocument(record.get('id'));
                    } else {
                        me.getAttachLetter(record.get('id'));
                    }

                }
            },

            'docWorkflowRoot #sendDoc': {
                click: this.sendDoc
            },

            'docWorkflowRoot #documentInfo': {
                click: function () {
                    Ext.get(Ext.DomQuery.select('.shadow')).removeCls('shadow');
                    if (Ext.DomQuery.select('.x-panel-documentOutbox')[0]) {
                        Ext.DomQuery.select('.x-panel-documentOutbox')[0].style.boxShadow = '2px 4px 10px -4px #808080';
                    }
                    if (Ext.DomQuery.select('.x-panel-documentInbox')[0]) {
                        Ext.DomQuery.select('.x-panel-documentInbox')[0].style.boxShadow = '2px 4px 10px -4px #808080';
                    }
                    Ext.ComponentQuery.query('#documentPackets')[0].getView().getNode(0).click();
                }
            },

            'docWorkflowRoot': {
                certificateClick: this.showCertificate
            },
            docWorkflowList: {
                itemClick: this.showDocument,
                afterrender: this.hideRecipient
            },
            'docWorkflowList #edit': {
                click: function (button) {
                    var win = button.up('window');
                    this.editDocflow(win);
                }
            },
            'docWorkflowList #hideReceipts': {
                click: function (button) {
                    this.showhideList(button);
                }
            },
            'docWorkflowList #showReceipts': {
                click: function (button) {
                    this.showhideList(button);
                }
            }
        });
    },

    hideRecipient: function () {
        var docWorkflowList = Ext.getCmp('docWorkflowList');
        var me = this;
        var btn = {};

        if (docWorkflowList.docFlowType == 'STAT_DOCFLOW_LETTER') {
            btn.isReport = false;
        } else {
            btn.isReport = true;
        }

        var maskList = new Ext.LoadMask(Ext.getCmp('docWorkflowList').up(), {ui: 'docflow'});
        maskList.show();
        maskList.getEl().prev().dom.className += ' x-mask-docflow-base';
        setTimeout(function () {
            me.showhideList(btn);
            maskList.hide();
        }, 100);
    },

    getAttachLetter: function (id) {
        var form = Ext.create('Ext.form.Panel', {
            renderTo: Ext.getBody(),
            autoEl: {
                tag: 'form',
                action: Ext.global.baseUrl,
                target: 'loginframe'
            },
            standardSubmit: true,
            method: 'GET',
            defaults: {
                xtype: 'hiddenfield'
            },
            items: [
                { name: 'action', value: 'invoke' },
                { name: 'mth', value: 'getAttachLetter' },
                { name: 'obj', value: 'docRoutes' },
                { name: 'id', value: id }
            ]
        });
        form.getEl().dom.submit();
    },

    editDocflow: function (w) {
        var parent = w;
        var root = parent.down('docWorkflowRoot');
        if ((root.docflowType !== 'STAT_DOCFLOW_LETTER') || (root.folderType !== 'draft')) {
            return;
        }

        Ext.Ajax.request({
            url: Ext.global.baseUrl,
            method: 'POST',
            params: {
                action: 'invoke',
                mth: 'getDetailsLetter',
                obj: 'docRoutes',
                id: root.detailsId
            },
            callback: function (fp, o, resp) {
                var props = {
                    subject: root.subject,
                    attachments: root.attachments,
                    detailsId: root.detailsId,
                    packetId: root.packetId,
                    docflowId: parent.docFlowId,
                    details: resp.responseText
                };

                var win = Ext.create('COURIERONLINE.view.Document.WinLetter', props);
                win.show();
            }
        });


    },

    showhideListSimple: function (viewDocumentList) {
        if (viewDocumentList.counterRow > 0) {
            if (viewDocumentList.hideRow) {
                for (var i = 0; i < viewDocumentList.counterRow; i++) {
                    viewDocumentList.view.removeRowCls(i, 'hidden');
                }
                viewDocumentList.hideRow = false;
                viewDocumentList.setHeight(350);
                Ext.ComponentQuery.query('docWorkflowList #hideReceipts')[0].show();
                Ext.ComponentQuery.query('docWorkflowList #showReceipts')[0].hide();
            } else {
                for (var j = 0; j < viewDocumentList.counterRow; j++) {
                    viewDocumentList.view.addRowCls(j, 'hidden');
                }
                viewDocumentList.hideRow = true;
                viewDocumentList.setHeight(70);
                Ext.ComponentQuery.query('docWorkflowList #hideReceipts')[0].hide();
                Ext.ComponentQuery.query('docWorkflowList #showReceipts')[0].show();
            }
        }
    },

    showhideList: function (btn) {
        var viewDocumentList = Ext.getCmp('docWorkflowList');
        var me = this;
        var obj = null;

        if (!btn.isReport) {
            me.showhideListSimple(viewDocumentList);
            return;
        }

        for (var i = 0; i < viewDocumentList.packets.length; i++) {
            if (viewDocumentList.packets[i].tech == false) {
                obj = {};
                obj.index = viewDocumentList.packets[i].index;
                obj.depth = viewDocumentList.packets[i].depth;
            }
        }

        if (obj == null) {
            me.showhideListSimple(viewDocumentList);
            return;
        }


        if (viewDocumentList.counterRow > 0) {
            if (viewDocumentList.hideRow) {
                for (var i = 0; i < viewDocumentList.packets.length; i++) {
                    if (viewDocumentList.packets[i].depth != obj.depth) {
                        viewDocumentList.columnManager.headerCt.items.get((viewDocumentList.packets[i].depth - 2)).setVisible(true);
                    }

                    if ((obj.depth - 2 + obj.index) != (viewDocumentList.packets[i].depth - 2 + viewDocumentList.packets[i].index)) {
                        viewDocumentList.view.removeRowCls((viewDocumentList.packets[i].depth - 2 + viewDocumentList.packets[i].index), 'hidden');
                    }
                }
                viewDocumentList.hideRow = false;
                viewDocumentList.setHeight(350);
                Ext.ComponentQuery.query('docWorkflowList #hideReceipts')[0].show();
                Ext.ComponentQuery.query('docWorkflowList #showReceipts')[0].hide();
            } else {
                for (var i = 0; i < viewDocumentList.packets.length; i++) {
                    if (viewDocumentList.packets[i].depth != obj.depth) {
                        viewDocumentList.columnManager.headerCt.items.get((viewDocumentList.packets[i].depth - 2)).setVisible(false);
                    }

                    if ((obj.depth - 2 + obj.index) != (viewDocumentList.packets[i].depth - 2 + viewDocumentList.packets[i].index)) {
                        viewDocumentList.view.addRowCls((viewDocumentList.packets[i].depth - 2 + viewDocumentList.packets[i].index), 'hidden');
                    }
                }
                viewDocumentList.hideRow = true;
                viewDocumentList.setHeight(200);
                Ext.ComponentQuery.query('docWorkflowList #hideReceipts')[0].hide();
                Ext.ComponentQuery.query('docWorkflowList #showReceipts')[0].show();
            }

        }


    },

    /**
     * Скачать сертификат
     * @param id - идентификатор сертификата
     */
    showCertificate: function (id) {
        if (!id) {
            return;
        }
        var form = Ext.create('Ext.form.Panel', {
            renderTo: Ext.getBody(),
            autoEl: {
                tag: 'form',
                action: Ext.global.baseUrl,
                target: 'loginframe'
            },
            standardSubmit: true,
            method: 'GET',
            defaults: {
                xtype: 'hiddenfield'
            },
            items: [
                { name: 'action', value: 'invoke' },
                { name: 'mth', value: 'exportCertificate' },
                { name: 'obj', value: 'docRoutes' },
                { name: 'id', value: id }
            ]
        });
        form.getEl().dom.submit();
    },

    sendDoc: function (btn) {
        var documentIds = [btn.up('docWorkflowRoot').docFlowId];
        var signSendService = Ext.create('COURIERONLINE.services.SignAndSend');
        signSendService.signAndSend(documentIds)
            .done(function (msg) {
                if (msg) {
                    Ext.Msg.alert(Msg.attention, msg);
                }
                btn.up('window').close();
                COURIERONLINE.app.getController('Documents').outbox();
            })
            .fail(function (err) {
                Ext.Msg.error(err);
            });
    },

    showDocument: function (docId) {
        var viewDocumentArea = Ext.getCmp('docWindowContent');
        if (docId) {
            viewDocumentArea.getLoader().load({
                params: {
                    action: 'invoke',
                    mth: 'renderDocument',
                    obj: 'docRoutes',
                    id: docId
                }
            });
        } else {
            viewDocumentArea.update(Msg.docNotFound);
        }
    }

});