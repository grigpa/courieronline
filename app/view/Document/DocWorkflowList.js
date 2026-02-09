Ext.define('COURIERONLINE.view.Document.DocWorkflowList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.docWorkflowList',

    columns: [],
    newColumnWidth: 380,
    store: 'DocWorkflow',
    hideHeaders: true,
    disableSelection: true,
    trackMouseOver: false,
    cls: 'docs-grid',
    height: 350,
    width: 900,
    id: 'docWorkflowList',
    hideRow: false,
    hideTech: true,

    depth: 0,
    counter: 0,
    counterRow: 0,
    arrDoc: [],
    arrFields: [],
    arrColumns: [],
    newStore: null,
    newModel: null,
    packets: [],
    packets2: [],

    viewConfig: {
        stripeRows: false
    },

    initComponent: function () {
        var me = this;
        me.on('beforerender', function () {
            me.reconfigureGrid();
        }, this);


        var folderType = me.folderType;

        var classStr = '';

        switch (me.row.get('state')) {
            case 'Отправлен':
                classStr = 'document-status-sent-win';
                break;
            case 'Отвергнут':
                classStr = 'document-status-rejected-win';
                break;
            case 'Доставлен':
                classStr = 'document-status-delivered-win';
                break;
            case 'Принят':
                classStr = 'document-status-accepted-win';
                break;
            case 'Отправлен в ТОГС':
                classStr = 'document-status-sent-win';
                break;
            case 'Получен ТОГС':
                classStr = 'document-status-accepted-win';
                break;
            case 'Получен респондентом':
                classStr = 'document-status-accepted-win';
                break;
            case 'Требует уточнения':
                classStr = 'document-status-other-win';
                break;
            default:
                classStr = 'statusDoc';


        }

        Ext.apply(this, {
            tbar: [
                {text: Msg.print, iconCls: 'smallPrint', itemId: 'print', height: 40, margin: {right: 10, left: 10, top: 5, bottom: 5}},
                {text: Msg.exportMsg, iconCls: 'smallExport', itemId: 'export', height: 40, margin: {right: 10, left: 10, top: 5, bottom: 5}},
                {text: Msg.edit, iconCls: 'smallChange', itemId: 'edit', height: 40, margin: {right: 10, left: 10, top: 5, bottom: 5}},
                {text: Msg.hideReceipts, iconCls: 'hideReceipts', itemId: 'hideReceipts', height: 40, iconAlign: 'left', margin: {right: 10, left: 10, top: 5, bottom: 5}},
                {text: Msg.showReceipts, iconCls: 'showReceipts', itemId: 'showReceipts', height: 40, iconAlign: 'left', hidden: true, margin: {right: 10, left: 10, top: 5, bottom: 5}},
                {xtype: 'tbfill' },
                {xtype: 'label', text: folderType === 'draft' ? Msg.createDoc :
                    me.row.get('state'), height: 40, baseCls: classStr, margin: {right: 10, left: 10, top: 5, bottom: 5}}
            ]
        });


        Ext.getBody().on('click', function (a, link) {
            me.fireEvent('itemClick', link.getAttribute('ref'));
        }, this, {delegate: '.linkselector'});

        me.on('cellclick', function (view, cell/*, cellIdx, record*/) {

            Ext.get(Ext.DomQuery.select('#documentPackets .x-grid-row-selected')).removeCls('x-grid-row-selected');
            Ext.get(Ext.DomQuery.select('.shadow')).removeCls('shadow');
            var c = Ext.get(cell).down('div').down('div');
            if (c) {
                c.addCls('shadow');
            }
            if (Ext.DomQuery.select('.x-panel-documentOutbox')[0]) {
                Ext.DomQuery.select('.x-panel-documentOutbox')[0].style.boxShadow = 'none';
            }
            if (Ext.DomQuery.select('.x-panel-documentInbox')[0]) {

            }


            var firstA = Ext.DomQuery.select('.renderDocs a', cell)[0];
            var returnId = firstA && firstA.getAttribute('ref');
            if (Ext.isDefined(returnId)) {
                me.fireEvent('itemClick', returnId);
            }
        });
        me.callParent(arguments);
    },

    /**
     * Рекурсивная обработка всех объектов,
     * формуруются колонки и строки будущей таблицы
     * TODO: необходим срочный рефакторинг этого метода
     */
    logRecord: function (r, hideTech, isChild) {
        var me = this;
        me.logRecordShowHide(me, isChild, r);

        Ext.each(r.childNodes, function (record) {
            me.logRecord(record, hideTech, true);
        }, me);

        if (!isChild) {
            me.fillStore();
        }
    },

    logRecordShowHide: function (me, isChild, r) {
        if (r.data.depth > 1) {
            this.packets.push(r.data);
        }

        if (!isChild) {
            me.arrFields = [];
            me.arrColumns = [];
            me.arrDoc = [];
        }
        me.arrDoc[me.counterRow] = {};

        if (isChild && r.data.index === 0) {
            me.counterRow--;
        }
        me.arrDoc[me.counterRow]['C' + r.data.depth] = r.data;

        me.depth = Math.max(me.depth, r.data.depth);
        if (me.arrFields.indexOf('C' + me.depth) === -1) {
            me.counter++;
            me.arrFields.push('C' + me.depth);
            me.arrColumns.push({text: 'C' + me.counter, dataIndex: 'C' + me.counter});
        }

        me.counterRow++;
    },

    fillStore: function () {
        var me = this;
        me.newStore = Ext.create('Ext.data.ArrayStore', {
            autoLoad: false,
            data: [],
            model: Ext.extend(Ext.data.Model, {
                fields: me.arrFields
            })
        });
        Ext.each(me.arrDoc, function (record) {
            if (record && Ext.Object.getKeys(record).length > 0) {
                me.newStore.add(record);
            }
        });
    },

    reconfigureGrid: function () {
        var hideTech = this.hideTech;
        Ext.each(this.records, function (record) {
            this.logRecord(record, hideTech);
        }, this);
        this.arrColumns.shift(); // убираем первую колонку
        Ext.each(this.arrColumns, function (record) {
            record.width = this.newColumnWidth;
            record.renderer = this.renderCell;
        }, this);
        this.reconfigure(this.newStore, this.arrColumns);

    },

    /**
     * todo: переделать на использование templatecolumn
     */
    renderCell: function (obj) {
        if (!obj.name) {
            return '';
        }

        this.packets.push(obj);
        if (!obj.tech) {
            Ext.ComponentQuery.query('docWorkflowList #hideReceipts')[0].setText('Только протокол');
            Ext.ComponentQuery.query('docWorkflowList #showReceipts')[0].setText('Все квитанции');
            Ext.ComponentQuery.query('docWorkflowList #hideReceipts')[0].isReport = true;
            Ext.ComponentQuery.query('docWorkflowList #showReceipts')[0].isReport = true;
        }
        var ulDocs = null;

        if (Ext.isDefined(obj.docs)) {
            ulDocs = new Ext.Element(document.createElement('ul'));
            ulDocs.addCls('renderDocs').addCls('hidden');
            Ext.each(obj.docs, function (doc) {
                var liDoc = {
                    tag: 'li',
                    children: [
                        {tag: 'a', ref: doc.id, html: doc.name, 'class': 'linkselector'}
                    ]
                };
                ulDocs.appendChild(liDoc);
            }, this);
        }


        var isActive = this.getActiveState(obj.id);
        var mi = this.getMotionIcon(obj.depth, isActive);
        var className = mi[0] + (isActive ? ' active ' : ' conditional ');
        var divPacket = new Ext.Element(document.createElement('div'));
        divPacket.addCls('block').addCls(className);
        divPacket.appendChild(ulDocs);

        var a = (isActive ? ' ' : '-gray ');

        var divTime = {
            tag: 'div',
            'class': 'desc_block time_doc' + a,
            html: (obj.docs[0].createtime) ? obj.docs[0].createtime :
                (mi[1] === 'inbox' ? Msg.docNotDelivery : Msg.docNotSend)
        };
        divPacket.appendChild(divTime);


        var divName = {
            tag: 'div',
            'class': 'desc_block name_doc' + a,
            html: obj.name
        };
        divPacket.appendChild(divName);


        var divAuthor = {
            tag: 'div',
            'class': 'desc_block org_doc' + a,
            html: obj.author
        };
        if (obj.author) {
            divPacket.appendChild(divAuthor);
        }


        if (Ext.isDefined(obj.docs[0].signs[0].cert)) {
            var divCert = {
                tag: 'div',
                'class': 'desc_block cert_doc' + a,
                html: '<a class="document-certificate-link" href="#" ref="' + obj.docs[0].signs[0].cert.id
                    + '" onclick="return false;">' +
                    obj.docs[0].signs[0].cert.owner +
                    '</a>'
            };
            divPacket.appendChild(divCert);
        }

        var parentPacket = new Ext.Element(document.createElement('div'));
        parentPacket.appendChild(divPacket);
        return Ext.get(parentPacket).dom.innerHTML;
    },

    getMotionIcon: function (depth, isActive) {
        var str = '';
        var type = '';
        var a = (isActive ? ' ' : '-gray ');
        if (this.folderType === 'inbox') {
            if (depth % 2 !== 0) {
                str = ' inbox' + a;
                type = 'inbox';
            }
            else {
                str = ' outbox' + a;
                type = 'outbox';
            }
        } else {
            if (depth % 2 === 0) {
                str = ' inbox' + a;
                type = 'inbox';
            }
            else {
                str = ' outbox' + a;
                type = 'outbox';
            }
        }
        return [str, type];

    },

    getRootState: function (parent) {
        return parent === 'root' ? ' active' : ' conditional';
    },

    getActiveState: function (id) {
        if (id) {
            return true;
        }
        return false;
    }

});