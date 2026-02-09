/**
 * Контролллер для управления компонентами связанными с организациями
 */
Ext.define('COURIERONLINE.controller.Tasks', {
    extend: 'COURIERONLINE.controller.Base',

    views: ['Task.Grid'],

    refs: [
        { ref: 'tasksGrid', selector: 'taskGrid'}
    ],

    stores: ['Tasks'],

    init: function () {
        this.control({});
    },

    tasks: function () {
        this.tryToInvoke(function () {
            if (!this.getWorkspace()) {
                return false;
            }
            this.getWorkspace().getLayout().setActiveItem('taskGrid');
            this.getTasksStore().load();
            return true;
        });
        this.tryToInvoke(function () {
            return this.selectMenuItem(Msg.tasks);
        });
    }

});