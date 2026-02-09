/**
 * Контроллер для управления новостями
 */
Ext.define('COURIERONLINE.controller.News', {
    extend: 'COURIERONLINE.controller.Base',

    stores: ['News'],

    refs: [

        { ref: 'selectLayoutNews', selector: 'newsLayout #selectLayoutNews' },
        { ref: 'newsGrid', selector: 'newsGrid' },
        { ref: 'newsGridToolbar', selector: 'newsGrid #crudToolbar' },
        { ref: 'newsLayoutSouth', selector: 'newsLayout #southNews' },
        { ref: 'newsLayoutEast', selector: 'newsLayout #eastNews' },
        { ref: 'newsLayoutSouth', selector: 'newsLayout #southNews' }
    ],
    views: ['Viewport'],
    init: function () {
        this.control({
            'appNews': {
                click: this.showNewsLayout
            },
            'newsLayout #selectLayoutNews': {
                change: this.selectLayoutNews
            },
            'newsGrid': {
                selectionchange: this.updateRegionNews,
                render: this.showhideToolbar
            }
        });
    },

    showhideToolbar: function () {
        var me = this;
        var user = Ext.global.APPLICATION && Ext.global.APPLICATION.user;
        if (user && user.isOperator()) {
            me.getNewsGridToolbar().show();
        }
    },

    updateRegionNews: function (sm, rows) {
        var me = this;
        var obj = {};
        me.getNewsLayoutSouth().update(rows[0].get('title'));
        me.getNewsLayoutEast().update(rows[0].get('title'));


        Ext.each(rows, function (row) {
            if (row.get('isNew') == true) {
                if (Ext.get(me.getNewsGrid().view.getNode(row)).hasCls('bold-row')) {
                    Ext.get(me.getNewsGrid().view.getNode(row)).removeCls('bold-row');
                    obj.id = row.get('id');
                }
            }
        });
        setTimeout(function () {
            if (obj.id) {
                me.sendNewsReaded(obj);
            }
        }, 2000);
    },

    sendNewsReaded: function (obj) {
        Ext.Ajax.request({
            url: Ext.global.baseUrl,
            method: 'POST',
            params: {
                action: 'invoke',
                mth: 'markNewsReaded',
                obj: 'respondent',
                id: obj.id
            },
            callback: function () {
            }
        });
    },

    selectLayoutNews: function (rb) {
        var val = rb.getValue();
        var me = this;
        if (val.rb == 1) {
            Ext.util.Cookies.set('rbNews', '1');
            me.getNewsLayoutSouth().show();
            me.getNewsLayoutEast().hide();
        } else {
            Ext.util.Cookies.set('rbNews', '2');
            me.getNewsLayoutSouth().hide();
            me.getNewsLayoutEast().show();
        }
    },

    showSouthPanel: function () {
        var me = this;
        me.getNewsLayoutSouth().show();
        me.getNewsLayoutEast().hide();
        Ext.ComponentQuery.query('newsLayout #selectLayoutNews')[0].setValue({rb: 1});
    },

    showEastPanel: function () {
        var me = this;
        me.getNewsLayoutSouth().hide();
        me.getNewsLayoutEast().show();
        Ext.ComponentQuery.query('newsLayout #selectLayoutNews')[0].setValue({rb: 2});
    },


    showNewsLayout: function () {
        var me = this;
        this.tryToInvoke(function () {
            if (!me.getWorkspace()) {
                return false;
            }

            me.getWorkspace().getLayout().setActiveItem('newsLayout');
            me.getNewsStore().load({
                callback: function () {
                    Ext.ComponentQuery.query('appNews')[0].addCls('appNewsSelected');
                    Ext.History.add('#news');
                    if (Ext.util.Cookies.get('rbNews') > 0) {
                        if (Ext.util.Cookies.get('rbNews') == 1) {
                            me.showSouthPanel();
                        } else {
                            me.showEastPanel();
                        }
                        return;
                    }
                    var size = screen;
                    if ((size.width / size.height) <= (4 / 3)) {
                        me.showSouthPanel();
                    } else {
                        me.showEastPanel();
                    }
                }
            });

            return true;
        });
    }


});
