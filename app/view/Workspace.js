Ext.define('COURIERONLINE.view.Workspace', {
    extend: 'Ext.panel.Panel',

    requires: [
        'COURIERONLINE.view.Document.Grid',
        'COURIERONLINE.view.Document.OutboxGrid',
        'COURIERONLINE.view.Document.DraftsGrid',
        'COURIERONLINE.view.News.Layout',
        'COURIERONLINE.view.News.Grid',
        'COURIERONLINE.view.Organization.Grid',
        'COURIERONLINE.view.SuperInspection.Grid',
        'COURIERONLINE.view.Inspection.Grid',
        'COURIERONLINE.view.Templates.Grid',
        'COURIERONLINE.view.Docflow.Grid'
    ],
    alias: 'widget.appWorkspace',
    layout: {
        type: 'card',
        deferredRender: true
    },

    border: false,

    defaults: {
        border: false,
        bodyBorder: false
    },

    items: [
        {
            xtype: 'panel' // пустой элемент по-умолчанию
        },
        {
            itemId: 'documentGrid',
            xtype: 'documentGrid'
        },
        {
            itemId: 'documentGridOutbox',
            xtype: 'documentGridOutbox'
        },
        {
            itemId: 'organizationGrid',
            xtype: 'organizationGrid'
        },
        {
            itemId: 'inspectionGrid',
            xtype: 'inspectionGrid'
        },
        {
            itemId: 'docflowGrid',
            xtype: 'docflowGrid'
        },
        {
            itemId: 'operatorGrid',
            xtype: 'operatorGrid'
        },
        {
            itemId: 'superInspectionGrid',
            xtype: 'superInspectionGrid'
        },
        {
            itemId: 'taskGrid',
            xtype: 'taskGrid'
        },
        {
            itemId: 'templatesGrid',
            xtype: 'templatesGrid'
        },
        {
            itemId: 'documentDraftsGrid',
            xtype: 'documentDraftsGrid'
        },
        {
            itemId: 'newsLayout',
            xtype: 'newsLayout'
        }
    ]
});