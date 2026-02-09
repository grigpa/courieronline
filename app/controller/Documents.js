/**
 * Контроллер для управления документами
 */
Ext.define('COURIERONLINE.controller.Documents', {
    extend: 'COURIERONLINE.controller.Base',

    stores: ['Documents', 'DocWorkflow', 'Navigator'],

    requires: ['COURIERONLINE.services.SignAndSend'],

    refs: [
        { ref: 'DocumentsGrid', selector: 'documentGrid' },
        { ref: 'counterPanel', selector: 'documentGrid #counterPanel' },
        { ref: 'counterPanelOutbox', selector: 'documentGridOutbox #counterPanel' },
        { ref: 'counterPanelDrafts', selector: 'documentDraftsGrid #counterPanel' },
        { ref: 'DocumentsGridOutbox', selector: 'documentGridOutbox' },
        { ref: 'DraftsGrid', selector: 'documentDraftsGrid' },
        { ref: 'DraftWindow', selector: 'documentWinDraft' },
        { ref: 'OutboxGrid', selector: 'documentGridOutbox' },
        { ref: 'WinLetter', selector: 'documentWinLetter' },
        { ref: 'WinLetterForm', selector: 'documentWinLetter #letterForm' },
        { ref: 'WinLetterFormAttach', selector: 'documentWinLetter #letterForm #attachFiles' },
        { ref: 'EDSGrid', selector: 'appWorkspace gridpanel' },
        { ref: 'Navigator', selector: 'appNavigator  #navigator' },
        { ref: 'importform', selector: 'appHeader #importform' }
    ],

    views: ['Viewport'],

    sendEDS: null,

    init: function () {
        var me = this;
        this.control({
            'documentGrid': {
                selectionchange: me.sendDeleteTags,
                itemdblclick: me.showDocument,
                'itemclick': me.deselectOnClick,
                render: function () {
                    me.setFolderType('inbox');
                    me.getDocumentsStore().load();
                }
            },

            'documentGrid #test': {
                'click': this.test
            },

            'documentGrid #export': {
                'click': this.exportRecordData
            },

            'documentGrid #print': {
                'click': this.printRecordData
            },

            'documentGrid #sign': {
                'click': this.signAndSend
            },
            'documentGrid #remove': {
                click: me.removeDocuments
            },

            'documentGrid #filterDocs menuitem[action=allDocs]': {
                click: function () {
                    this.filterDocumentGrid(false);
                }
            },

            'documentGrid #filterDocs menuitem[action=onlyNewDocs]': {
                click: function () {
                    this.filterDocumentGrid(true);
                }
            },

            'documentWinDraft #export': {
                click: function (button) {
                    var win = button.up('window');
                    this.exportDataFromWin(win);
                }
            },

            'documentWinDraft #print': {
                click: function (button) {
                    var win = button.up('window');
                    this.printDataFromWin(win);
                }
            },

            'documentWin #close': {
                click: function (button) {
                    button.up('window').close();
                }
            },
            'documentWinDraft #close': {
                click: function (button) {
                    button.up('window').close();
                }
            },
            'documentWinLetter #save': {
                click: this.saveLetter
            },
            'documentWinLetter #addLetterFile': {
                change: this.sendAttachFile
            },
            'documentWinLetter #close': {
                click: function (button) {
                    button.up('window').close();
                }
            },
            'appHeader #importXml': {
                change: this.importFile
            },
            'appHeader #newDoc menuitem[action=create]': {
                click: this.newDoc
            },
            'appHeader #newDoc menuitem[action=import]': {
                click: this.importXmlClick
            }
        });
    },


    sendDeleteTags: function (sm, rows) {
        var me = this;
        setTimeout(function () {
            var tags = [];
            Ext.each(rows, function (row) {
                    if (row.get('hasAcceptedTag') || row.get('hasRejectedTag')) {
                        if (Ext.get(me.getActiveGrid().view.getNode(row)).hasCls('bold-row')) {
                            Ext.get(me.getActiveGrid().view.getNode(row)).removeCls('bold-row');
                            me.updateNotifications();
                            var obj = {};
                            obj.id = row.get('id');
                            obj.tag = row.get('hasAcceptedTag') ? 'ACCEPTED' : (row.get('hasRejectedTag') ? 'REJECTED' : '');
                            tags.push(obj);
                        }
                    }
                }
            );
            me.sendTags(tags);
        }, 2000);
    },

    sendTags: function (tags) {
        Ext.Ajax.request({
            url: Ext.global.baseUrl,
            method: 'POST',
            params: {
                action: 'invoke',
                mth: 'removeTag',
                obj: 'docRoutes',
                tags: Ext.encode(tags)
            },
            callback: function () {
                COURIERONLINE.getApplication().getController('Main').loadNavNotifications();
            }
        });
    },

    filterDocumentGrid: function (isImportant) {
        var me = this;
        me.getDocumentsStore().clearFilter(true);
        var filters = [
            new Ext.util.Filter({
                filterFn: function (item) {
                    return item.get('hasRejectedTag') || item.get('hasAcceptedTag');
                }
            })
        ];

        if (isImportant) {
            me.getDocumentsStore().filter(filters);
        }

        me.getDocumentsStore().load({
            params: {filter: null},
            callback: function () {
                var gridName = me.getFolderType() === 'outbox' ? 'documentGridOutbox' : 'documentGrid';
                var totalCount = isImportant ? me.getDocumentsStore().data.length : me.getDocumentsStore().getTotalCount();
                Ext.ComponentQuery.query(gridName + ' #counterPanel')[0].show();
                if (totalCount === 0) {
                    Ext.ComponentQuery.query(gridName + ' #rowCounterLabel')[0].update(Msg.noneDocsLabel);
                    Ext.ComponentQuery.query(gridName + ' #rowCounter')[0].update('');
                } else {
                    Ext.ComponentQuery.query(gridName + ' #rowCounterLabel')[0].update(isImportant ? (Msg.onlyNewDocs + ':')
                        : (Msg.allDocsLabel + ':'));
                    Ext.ComponentQuery.query(gridName + ' #rowCounter')[0].update(totalCount);
                }
                Ext.apply(me.getDocumentsStore().getProxy().extraParams, {
                    isImportant: 'false'
                });
            }
        });

    },

    importXmlClick: function () {
        var fireOnThis = Ext.get('importXmlBtn-fileInputEl').dom || document.getElementById('importXmlBtn-fileInputEl');
        var evObj;
        if (document.createEvent) {
            evObj = document.createEvent('MouseEvents');
            evObj.initEvent('click', true, false);
            fireOnThis.dispatchEvent(evObj);
        } else if (document.createEventObject) {
            evObj = document.createEventObject();
            fireOnThis.fireEvent('onclick', evObj);
        }
    },

    getActiveGrid: function () {
        return this.getDocumentsGrid().isVisible() ? this.getDocumentsGrid() : (this.getDraftsGrid().isVisible() ?
            this.getDraftsGrid() : this.getDocumentsGridOutbox());
    },

    removeDocuments: function () {
        Ext.Msg.confirm(Msg.attention, Msg.confirmRemoveRecords, function (btn) {
            if (btn === 'yes') {
                var records = this.getActiveGrid().getSelectionModel().getSelection();
                var store = this.getDocumentsStore();
                store.remove(records);
                store.sync({
                    failure: function () {
                        store.load();
                    }
                });
            }
        }, this);
    },

    setFolderType: function (folderType) {
        Ext.apply(this.getDocumentsStore().proxy.extraParams, {folderType: folderType});
    },

    getFolderType: function () {
        return this.getDocumentsStore().proxy.extraParams.folderType;
    },

    deselectOnClick: function (data, record, item, index, e) {
        var theRow = Ext.get(e.target).parent('tr');
        var id = record.get('id');
        var me = this;

        setTimeout(function () {
            if (theRow.hasCls('bold-row')) {
                theRow.removeCls('bold-row');
                var tag = record.get('hasAcceptedTag') ? 'ACCEPTED' : (record.get('hasRejectedTag') ? 'REJECTED' : '');
                var obj = {};
                obj.id = id;
                obj.tag = tag;
                var tags = [];
                tags.push(obj);
                me.sendTags(tags);
            }
        }, 2000);

    },

    updateNotifications: function () {
        var me = this;
        var newStore = me.getNavigatorStore();
        var gridName = me.getFolderType() === 'outbox' ? 'documentGridOutbox' : 'documentGrid';

        if (Ext.ComponentQuery.query(gridName + ' #rowCounterLabel')[0].html.indexOf(Msg.onlyNewDocs) > -1) {
            var c = Ext.ComponentQuery.query(gridName + ' #rowCounter')[0].html;
            if (c > 0) {
                c--;
                Ext.ComponentQuery.query(gridName + ' #rowCounter')[0].update(c);
            }
        }
        var nodeId = (me.getFolderType === 'inbox' ? 'input' : 'output');
        if (newStore.getNodeById(nodeId).data.counter > 0) {
            newStore.getNodeById(nodeId).data.counter--;
            me.getNavigator().reconfigure(newStore);
        }

    },

    showDocument: function (data, record, item, index, e) {

        var selected = this.getActiveGrid().getSelectionModel().getLastSelected();
        var me = this;


        if (selected) {

            var theRow = Ext.get(e.target).parent('tr');
            if (theRow.hasCls('bold-row')) {
                me.updateNotifications();
                theRow.removeCls('bold-row');
                var tag = record.get('hasAcceptedTag') ? 'ACCEPTED' : (record.get('hasRejectedTag') ? 'REJECTED' : '');
                var obj = {};
                obj.id = selected.get('id');
                obj.tag = tag;
                var tags = [];
                tags.push(obj);

                me.sendTags(tags);
            }

            this.getDocWorkflowStore().load({
                params: {
                    mth: 'getDocflowSchema',
                    action: 'invoke',
                    obj: 'docRoutes',
                    id: selected.get('id')
                },
                callback: function (records) {
                    records[0].folderType = me.getFolderType();
                    var props = {
                        record: records[0],
                        docFlowId: selected.get('id'),
                        docFlowType: records[0].data.docflowType,
                        folderType: me.getFolderType(),
                        created: selected.get('created'),
                        row: selected
                    };

                    var win = Ext.create('COURIERONLINE.view.Document.WinDraft', props);
                    win.show();
                }
            });
        }
    },

    exportRecordData: function () {
        var selections = this.getActiveGrid().getSelectionModel().getSelection();
        if (!selections.length) {
            return;
        }
        var documentIds = Ext.pluck(Ext.pluck(selections, 'data'), 'id');
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
                { name: 'mth', value: 'export' },
                { name: 'obj', value: 'docRoutes' },
                { name: 'ids', value: Ext.encode(documentIds) }
            ]
        });
        form.getEl().dom.submit();
    },

    printRecordData: function () {
        var selections = this.getActiveGrid().getSelectionModel().getSelection();
        if (!selections.length || selections.length > 1) {
            return;
        }
        var documentIds = Ext.pluck(Ext.pluck(selections, 'data'), 'id');
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
                { name: 'mth', value: 'printReport' },
                { name: 'obj', value: 'docRoutes' },
                { name: 'id', value: documentIds[0] }
            ]
        });
        form.getEl().dom.submit();
    },


    exportDataFromWin: function (win) {

        var documentIds = [];
        documentIds.push(win.docFlowId);

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
                { name: 'mth', value: 'export' },
                { name: 'obj', value: 'docRoutes' },
                { name: 'ids', value: Ext.encode(documentIds) }
            ]
        });
        form.getEl().dom.submit();
    },


    printDataFromWin: function (win) {
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
                { name: 'mth', value: 'printReport' },
                { name: 'obj', value: 'docRoutes' },
                { name: 'id', value: win.docFlowId }
            ]
        });
        form.getEl().dom.submit();
    },

    /**
     * используется для отладки новых серверных методов
     */
    test: function () {
        var selections = this.getActiveGrid().getSelectionModel().getSelection();
        if (!selections.length) {
            return;
        }
        var documentIds = Ext.pluck(Ext.pluck(selections, 'data'), 'id');
        Ext.Ajax.request({
            url: Ext.global.baseUrl,
            method: 'POST',
            params: {
                action: 'invoke',
                mth: 'test',
                obj: 'docRoutes',
                ids: Ext.encode(documentIds)
            }
        });
    },

    newDoc: function () {
        var win = Ext.create('COURIERONLINE.view.Document.WinLetter');
        win.show();
    },


    saveLetter: function () {
        var me = this;
        var form = me.getWinLetterForm().getForm();
        var wl = me.getWinLetter();
        var editWin = Ext.isDefined(wl.subject);
        if (form.isValid()) {

            Ext.Ajax.request({
                url: Ext.global.baseUrl,
                method: 'POST',
                params: {
                    action: 'invoke',
                    obj: 'docRoutes',
                    subject: form.getValues().subject,
                    message: form.getValues().message,
                    mth: editWin ? 'updateLetter' : 'createLetter',
                    id: Ext.isDefined(wl.docflowId) ? wl.docflowId : ''
                },
                success: function (fp, o, resp) {
                    var formAttach = me.getWinLetterFormAttach().items.items[0].getForm();
                    var documentsIds = fp && Ext.decode(fp.responseText || '{"id":"da966bea-bd43-4ed3-b792-020416b6a170"}', true);
                    var itemsToSelect = documentsIds.id;

                    if (me.getWinLetterFormAttach().items.items[0].items.items.length === 1) {
                        me.getWinLetterForm().up('window').close();
                        if (Ext.isDefined(me.getDraftWindow())) {
                            me.getDraftWindow().close();
                        }
                        me.draft(itemsToSelect);
                        return;
                    }

                    if (formAttach.isValid()) {
                        var baseParams = {
                            action: 'invoke',
                            obj: 'docRoutes',
                            mth: 'createLetterAttach',
                            id: itemsToSelect
                        };
                        formAttach.submit({
                            url: Ext.global.baseUrl + '?' + Ext.Object.toQueryString(baseParams),
                            waitMsg: Msg.fileUploading,
                            success: function (fp, o) {
                                me.getWinLetterForm().up('window').close();
                                me.getDraftWindow().close();
                                me.draft(itemsToSelect);
                                return;
                            },
                            failure: function (fp, o) {
                                Ext.log(arguments);
                                var response = o.response && Ext.decode(o.response.responseText, true);
                                var msg = Msg.importSend +
                                    (response && response.msg ? (':<br>' + response.msg) : '');
                                Ext.Msg.error(msg);
                                return;
                            }
                        });
                    }
                    me.draft();
                },
                failure: function (fp, o, resp) {
                    me.getWinLetterForm().up('window').close();
                    Ext.log(arguments);
                    var response = resp && Ext.decode(resp.responseText, true);
                    var msg = Msg.importSend +
                        (response && response.msg ? (':<br>' + response.msg) : '');
                    Ext.Msg.error(msg);
                }

            });
        }

    },

    sendAttachFile: function () {
        /*
         var me = this;
         var form = me.getWinLetterForm().getForm();
         if (form.isValid()) {
         var baseParams = {
         action: 'invoke',
         obj: 'docRoutes',
         mth: 'createLetterAttachTemp'
         };
         form.submit({
         url: Ext.global.baseUrl + '?' + Ext.Object.toQueryString(baseParams),
         waitMsg: Msg.fileUploading,
         success: function (fp, o) {
         Ext.log(arguments);
         },
         failure: function (fp, o) {
         Ext.log(arguments);
         }
         });
         }
         */
    },

    importFile: function () {
        var me = this;
        var form = this.getImportform().getForm();
        if (form.isValid()) {
            var baseParams = {
                action: 'invoke',
                obj: 'docRoutes',
                mth: 'importFile'
            };
            form.submit({
                url: Ext.global.baseUrl + '?' + Ext.Object.toQueryString(baseParams),
                waitMsg: Msg.fileUploading,
                success: function (fp, o) {
                    Ext.log(arguments);
                    var documentsIds = o.response && Ext.decode(o.response.responseText, true);
                    var itemsToSelect = Ext.pluck(documentsIds, 'id');
                    me.draft(itemsToSelect);
                },
                failure: function (fp, o) {
                    Ext.log(arguments);
                    var response = o.response && Ext.decode(o.response.responseText, true);
                    var msg = Msg.importFail +
                        (response && response.msg ? (':<br>' + response.msg) : '');
                    Ext.Msg.error(msg);
                }
            });
        }
    },

    /**
     *
     * @param [itemsToSelect] - массив id пакетов,
     * к-рые мы хотим выделить
     */
    outbox: function (itemsToSelect) {
        this.getDocumentsStore().clearFilter(true);
        this.tryToInvoke(function () {
            if (!this.getWorkspace()) {
                return false;
            }
            var me = this;
            me.getCounterPanelOutbox().hide();
            this.getWorkspace().getLayout().setActiveItem('documentGridOutbox');
            this.setFolderType('outbox');
            this.getDocumentsStore().loadData([], false);

            var newStore = me.getNavigatorStore();
            var cnt = newStore.getNodeById('output').data.counter;

            this.getDocumentsStore().load({
                callback: function (records, operation, success) {
                    var totalCount = me.getDocumentsStore().getTotalCount();
                    me.getCounterPanelOutbox().show();
                    if (totalCount === 0) {
                        Ext.ComponentQuery.query('documentGridOutbox #rowCounterLabel')[0].update(Msg.noneDocsLabel);
                        Ext.ComponentQuery.query('documentGridOutbox #rowCounter')[0].update('');
                    } else {
                        Ext.ComponentQuery.query('documentGridOutbox #rowCounterLabel')[0].update(Msg.allDocsLabel + ':');
                        Ext.ComponentQuery.query('documentGridOutbox #rowCounter')[0].update(totalCount);
                    }

                    if (success && itemsToSelect && itemsToSelect.length) {
                        /**
                         * выделяем строки в таблице, для отображения документов,
                         * которые были только что импортированы
                         */
                        var recordsToSelect = Ext.Array.filter(records, function (record) {
                            return itemsToSelect.indexOf(record.get('id')) !== -1;
                        });
                        me.getOutboxGrid().getSelectionModel().select(recordsToSelect);
                    }
                    Ext.apply(me.getDocumentsStore().getProxy().extraParams, {
                        isImportant: 'false'
                    });
                }
            });

            return true;
        });
        this.tryToInvoke(function () {
            return this.selectMenuItem(Msg.outbox, 'outbox');
        });
    },


    inbox: function () {
        this.getDocumentsStore().clearFilter(true);
        this.tryToInvoke(function () {
            if (!this.getWorkspace()) {
                return false;
            }
            var me = this;
            me.getCounterPanel().hide();


            this.getWorkspace().getLayout().setActiveItem('documentGrid');
            this.setFolderType('inbox');
            this.getDocumentsStore().loadData([], false);
            var newStore = me.getNavigatorStore();
            var cnt = newStore.getNodeById('input').data.counter;
            this.getDocumentsStore().load({
                callback: function () {
                    var totalCount = me.getDocumentsStore().getTotalCount();
                    me.getCounterPanel().show();
                    if (totalCount === 0) {
                        Ext.ComponentQuery.query('documentGrid #rowCounterLabel')[0].update(Msg.noneDocsLabel);
                        Ext.ComponentQuery.query('documentGrid #rowCounter')[0].update('');
                    } else {
                        Ext.ComponentQuery.query('documentGrid #rowCounterLabel')[0].update(Msg.allDocsLabel + ':');
                        Ext.ComponentQuery.query('documentGrid #rowCounter')[0].update(totalCount);
                    }
                }
            });

            return true;
        });
        this.tryToInvoke(function () {
            return this.selectMenuItem(Msg.inbox, 'inbox');
        });
    },

    /**
     * Открытие раздела с черновиками документов
     * @param [itemsToSelect] - массив id пакетов,
     * к-рые были импортированы, и мы хотим их выделить
     */
    draft: function (itemsToSelect) {
        this.getDocumentsStore().clearFilter(true);
        Ext.apply(this.getDocumentsStore().getProxy().extraParams, {
            isImportant: 'false'
        });
        this.tryToInvoke(function () {
            var me = this;
            me.getCounterPanelDrafts().hide();

            if (!this.getWorkspace()) {
                return false;
            }
            this.getWorkspace().getLayout().setActiveItem('documentDraftsGrid');
            this.setFolderType('draft');
            this.getDocumentsStore().loadData([], false);
            this.getDocumentsStore().load({
                callback: function (records, operation, success) {
                    var totalCount = me.getDocumentsStore().getTotalCount();
                    me.getCounterPanelDrafts().show();
                    if (totalCount === 0) {
                        Ext.ComponentQuery.query('documentDraftsGrid #rowCounterLabel')[0].update(Msg.noneDocsLabel);
                        Ext.ComponentQuery.query('documentDraftsGrid #rowCounter')[0].update('');
                    } else {
                        Ext.ComponentQuery.query('documentDraftsGrid #rowCounterLabel')[0].update(Msg.allDocsLabel + ':');
                        Ext.ComponentQuery.query('documentDraftsGrid #rowCounter')[0].update(totalCount);
                    }

                    if (success && itemsToSelect && itemsToSelect.length) {
                        /**
                         * выделяем строки в таблице, для отображения документов,
                         * которые были только что импортированы
                         */
                        var recordsToSelect = Ext.Array.filter(records, function (record) {
                            return itemsToSelect.indexOf(record.get('id')) !== -1;
                        });
                        me.getDraftsGrid().getSelectionModel().select(recordsToSelect);
                    }
                }
            });
            return true;
        });
        this.tryToInvoke(function () {
            return this.selectMenuItem(Msg.draft, 'draft');
        });
    },
    /**
     * Подписать и отправить выбранные документы
     */
    signAndSend: function () {
        var me = this;

        var selections = this.getDraftsGrid().getSelectionModel().getSelection();
        if (!selections.length) {
            return;
        }
        var documentIds = Ext.pluck(Ext.pluck(selections, 'data'), 'id');
        var signSendService = Ext.create('COURIERONLINE.services.SignAndSend');
        Ext.Ajax.initLoadMask();
        Ext.Ajax.loadMask.show();
        signSendService.signAndSend(documentIds)
            .done(function (msg) {
                Ext.Ajax.loadMask.hide();
                if (msg) {
                    Ext.Msg.alert(Msg.attention, msg);
                }
                me.outbox(documentIds);
            })
            .fail(function (err) {
                Ext.Ajax.loadMask.hide();
                Ext.Msg.error(err);
            });
    }

});
