Ext.define('COURIERONLINE.view.Document.DocWorkflowRoot', {
    extend: 'Ext.container.Container',
    alias: 'widget.docWorkflowRoot',

    layout: 'border',
    border: false,
    style: {
        background: 'white'
    },
    width: 250,
    defaults: {
        margins: '10 20 10 10'
    },


    initComponent: function () {
        var me = this;
        this.on('afterrender', this.onAfterRender);

        Ext.apply(this, {
            items: [
                {
                    region: 'north',
                    xtype: 'panel',
                    ui: this.folderType === 'inbox' ? 'documentInbox' : 'documentOutbox',
                    height: 170,
                    layout: 'border',
                    items: [
                        {
                            region: 'center',
                            ui: '',
                            itemId: 'documentInfo',
                            tpl: new Ext.XTemplate(
                                '<ul class="document-info">',
                                '<li class="document-date">{date}</li>',
                                '<li class="document-name">{name}</li>',
                                '<li class="document-organization">{organization}</li>',
                                '<tpl if="showLink">',
                                '<li class="document-certificate">',
                                '<a class="document-certificate-link" href="#" ref="{certificateId}" onclick="return false;">',
                                '{certificate}',
                                '</a>',
                                '</li>',
                                '</tpl>',
                                '</ul>'
                            )
                        },
                        {
                            region: 'south',
                            xtype: 'container',

                            items: {
                                ui: 'form-action',
                                itemId: 'sendDoc',
                                hidden: this.folderType == 'inbox',
                                width: 100,
                                xtype: 'button',
                                text: 'Отправить'
                            }
                        }
                    ]
                },
                {
                    region: 'center',
                    margins: '10 0 0 10',
                    border: false,
                    bodyBorder: false,
                    xtype: 'grid',
                    lines: false,
                    cls: 'menu-navigator',
                    itemId: 'documentPackets',
                    id: 'documentPackets',
                    rowLines: true,
                    hideHeaders: true,
                    columns: [
                        {
                            xtype: 'templatecolumn',
                            text: 'Name',
                            dataIndex: 'name',
                            width: 220,
                            tpl: new Ext.XTemplate(
                                '<div class="menu-item-name {[this.getCls(values)]}">{[this.getName(values)]}</div>',
                                {
                                    getCls: function (values) {
                                        if (values.docType == 'STAT_DOC_LETTERAPPLICATION') {
                                            var ext = "";
                                            if (values.name.lastIndexOf('.') > -1) {
                                                ext = values.name.substr(values.name.lastIndexOf('.') + 1);
                                            } else {
                                                ext = values.origFileName.substr(values.origFileName.lastIndexOf('.') + 1);
                                            }
                                            return 'attach-' + ext;

                                        } else {
                                            return 'document-name';
                                        }

                                    }
                                },
                                {
                                    getName: function (values) {
                                        if (values.docType == 'STAT_DOC_LETTERAPPLICATION') {
                                            return values.origFileName;
                                        } else {
                                            return values.name;
                                        }
                                    }
                                }
                            )
                        },
                        {
                            xtype: 'templatecolumn',
                            width: 10,
                            minWidth: 10,
                            text: 'arrow',
                            tpl: ''
                        }
                    ],
                    displayField: 'name',
                    store: {
                        fields: ['id', 'name', 'docType', 'origFileName'],
                        proxy: {type: 'memory'}
                    }
                }
            ]
        });

        Ext.getBody().on('click', function (a, link) {
            me.fireEvent('certificateClick', link.getAttribute('ref'));
        }, this, {delegate: '.document-certificate-link'});

        this.callParent();
    },

    getCertFromStore: function () {
        var me = this;
        if (Ext.isDefined(me.document.data.docs[0].signs[0].cert)) {
            return me.document.data.docs[0].signs[0].cert;
        } else {
            return '';
        }
    },

    onAfterRender: function () {
        var me = this;
        if ((me.folderType == 'outbox') || (me.folderType == 'inbox')) {
            Ext.ComponentQuery.query('button[itemId=sendDoc]')[0].hide();
        }

        me.docflowType = me.document.data.docflowType;
        me.subject = me.document.data.docs[0].details;
        me.detailsId = me.document.data.docs[0].id;
        me.packetId = me.document.data.id;

        var documentDescription = me.down('#documentInfo');

        var cert = me.getCertFromStore(me.document.data.docs[0].signs[0].cert);


        var user = COURIERONLINE.getApplication().user;

        var html = documentDescription.tpl.apply({
            showLink: cert !== '' ? (me.folderType === 'outbox' || me.folderType === 'inbox') : false,
            date: (me.folderType === 'draft' ? 'документ не отправлен' : me.created),
            name: me.document.get('name'),
            organization: user.get('fullName'),
            certificate: cert !== '' ? cert.owner : '',
            certificateId: cert !== '' ? cert.id : ''
        });

        function formatSize(size) {
            var units = [' Б', ' Кб', ' Мб', ' Гб', ' Тб'];
            for (var i = 0; size >= 1024 && i < 4; i++) {
                size /= 1024;
            }
            return size.toFixed(2) + units[i];
        }


        var attachs = [];
        Ext.each(me.document.get('docs'), function (attach) {
            if (attach.docType == 'STAT_DOC_LETTERAPPLICATION') {
                attach.size = formatSize(attach.size);
                attachs.push(attach);
            }
        }, true);

        me.attachments = attachs;


        documentDescription.update(html);
        var packets = me.down('#documentPackets');

        packets.store.loadData(me.document.get('docs'));
        packets.getView().getNode(0).click();
    }

});