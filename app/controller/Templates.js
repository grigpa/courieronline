/**
 * Контролллер для управления компонентами связанными с организациями
 */
Ext.define('COURIERONLINE.controller.Templates', {
    extend: 'COURIERONLINE.controller.Base',

    views: ['Templates.Grid'],

    refs: [
        { ref: 'templatesGrid', selector: 'templatesGrid'},
        { ref: 'templatesForm', selector: 'templatesGrid #importform'}
    ],

    stores: ['Templates'],

    init: function () {
        var me = this;
        me.control({
            'templatesGrid #add'          : {
                click: me.importTemplateClick
            },
            'templatesGrid #remove'  : {
                click: me.removeTemplate
            },
            'templatesGrid #importTemplate': {
                change: this.importTemplate
            }
        });
    },


    importTemplate: function () {
        var me = this;
        var form = this.getTemplatesForm().getForm();
        if (form.isValid()) {
            var baseParams = {
                action: 'invoke',
                obj: 'stat',
                mth: 'importTemplate'
            };
            form.submit({
                url: Ext.global.baseUrl + '?' + Ext.Object.toQueryString(baseParams),
                waitMsg: Msg.fileUploading,
                success: function () {
                    me.getTemplatesStore().reload();
                },
                failure: function () {
                    me.getTemplatesStore().reload();
                }
            });
        }
    },

    importTemplateClick: function () {
        var fireOnThis = Ext.get('importTemplateBtn-fileInputEl').dom;
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

    removeTemplate: function () {
        var me = this;
        Ext.Msg.confirm(Msg.attention, Msg.confirmRemoveRecords, function (btn) {
            if (btn === 'yes') {
                var store = me.getTemplatesStore();
                var selections = me.getTemplatesGrid().getSelectionModel().getSelection();
                if (!selections.length) {
                    return;
                }
                var documentIds = Ext.pluck(Ext.pluck(selections, 'data'), 'id');
                Ext.Ajax.request({
                    url: Ext.global.baseUrl,
                    method: 'POST',
                    params: {
                        action: 'invoke',
                        mth: 'deleteTemplates',
                        obj: 'stat',
                        ids: Ext.encode(documentIds)
                    },
                    success: function () {
                        store.reload();
                    }
                });
            }
        }, this);
    },

    templates: function () {
        this.tryToInvoke(function () {
            if (!this.getWorkspace()) {
                return false;
            }
            this.getWorkspace().getLayout().setActiveItem('templatesGrid');
            this.getTemplatesStore().load();
            return true;
        });
        this.tryToInvoke(function () {
            return this.selectMenuItem(Msg.templates);
        });
    }

});