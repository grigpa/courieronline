/**
 * Контролллер для управления компонентами связанными с документооборами
 */
Ext.define('COURIERONLINE.controller.Docflows', {
    extend: 'COURIERONLINE.controller.Base',

    refs: [
        {ref: 'docflowsGrid', selector: 'docflowGrid'}
    ],

    views: ['Docflow.Grid'],

    stores: ['Docflows'],

    init: function () {

    },

    docflows: function () {
        this.tryToInvoke(function () {
            if (!this.getWorkspace()) {
                return false;
            }
            this.getWorkspace().getLayout().setActiveItem('docflowGrid');
            this.getDocflowsStore().load();
            return true;
        });
        this.tryToInvoke(function () {
            return this.selectMenuItem(Msg.docflows);
        });
    }

});