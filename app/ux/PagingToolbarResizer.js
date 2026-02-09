/**
 * @class Ext.ux.PagingToolbarResizer
 *
 * Creates new PagingToolbarResizer plugin
 * @constructor
 * @param {Object} config The config object
 *
 * How to use
 *
 Just instatiate a new PagingToolbarResizer inside PagingToolbar plugins option:

 bbar: new Ext.PagingToolbar({
            pageSize: 25,
            store: store,
            displayInfo: true,
            displayMsg: 'Displaying topics {0} - {1} of {2}',
            emptyMsg: "No topics to display",
            plugins : [Ext.create('Ext.ux.PagingToolbarResizer', {options : [ 50, 100, 500 ] })]
    })
 */
Ext.define('Ext.ux.PagingToolbarResizer', {
    extend: 'Ext.AbstractPlugin',
    alias : 'plugin.pagingtoolbarresizer',

    /**
     * @cfg {Ext.data.Store} options
     * The {@link Ext.data.Store} combobox should use as its data source (required).
     * You can also use an array of integers.
     * Defaults to [5, 10, 15, 20, 25, 30, 50, 75, 100, 200, 300, 500, 1000]
     */
    options: [10, 20, 30, 50],

    /**
     * @cfg {String} mode Acceptable values are:
     *
     *
     'remote' : Default
     *
     Automatically loads the {@link #store} the first time the trigger
     * is clicked. If you do not want the store to be automatically loaded the first time the trigger is
     * clicked, set to 'local' and manually load the store.  To force a requery of the store
     * every time the trigger is clicked see {@link #lastQuery}.
     *
     'local' :
     *
     ComboBox loads local data
     *
     *
     */
    mode: 'remote',

    /**
     * @cfg {String} displayText
     * The message to display before the combobox (defaults to 'Records per Page')
     */
    displayText: 'Строк на странице',

    constructor: function (config) {

        Ext.apply(this, config);

        this.callParent(arguments);
    },

    init: function (pagingToolbar) {

        var comboStore = Ext.Array.map(this.options, function (item) {
            return {text: item};
        });

        var ptStore = pagingToolbar.store;

        var stateName = 'itemsPerPage::' + ptStore.model.$className;
        ptStore.pageSize = Ext.state.Manager.get(stateName, ptStore.pageSize);

        var combo = {
            arrowCls : 'double-arrow',
            text     : ptStore.pageSize,
            width    : 60,
            menu     : {
                xtype        : 'menu',
                minWidth     : 60,
                width        : 60,
                showSeparator: false,
                plain        : true,
                items        : comboStore
            },
            listeners: {
                render: function () {
                    this.mon(this.menu, {
                        scope: this,
                        click: function (menu, menuItem/*, e*/) {
                            var pageSize = menuItem && menuItem.text;
                            if (pageSize) {
                                this.setText(pageSize);
                                Ext.state.Manager.set(stateName, pageSize);
                                ptStore.pageSize = pageSize;
                                ptStore.load();
                            }
                        }
                    });
                }
            }
        };

        var index = pagingToolbar.items.indexOf(pagingToolbar.refresh);
        pagingToolbar.insert(++index, this.displayText);
        pagingToolbar.insert(++index, combo);
        pagingToolbar.insert(++index, '->');

        //destroy combobox before destroying the paging toolbar
        pagingToolbar.on({
            beforedestroy: function () {
                combo.destroy();
            }
        });

    }
});