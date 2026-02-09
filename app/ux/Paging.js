Ext.define('Ext.ux.Paging', {
    extend: 'Ext.toolbar.Paging',
    require: ['Ext.ux.PagingToolbarResizer'],

    alias: 'widget.custompaging',

    plugins: [
        {ptype: 'pagingtoolbarresizer'}
    ],
    defaults: {
        scale: 'medium'
    },

    margin: '20 0 0 0',

    defaultButtonUI: 'paging',

    maxPagesCount: 7,

    /**
     * Gets the standard paging items in the toolbar
     * @private
     */
    getPagingItems: function () {
        var me = this;

        var btns = Ext.Array.map(this.getPossiblePages(), function (item, index) {
            return {
                itemId: 'item' + index,
                text: item,
                width: 40,
                hidden: true,
                disabled: false,
                handler: me.movePrevious,
                scope: me
            };
        });

        var beginItems = [
            {
                itemId: 'first',
                tooltip: me.firstText,
                overflowText: me.firstText,
                iconCls: Ext.baseCSSPrefix + 'tbar-page-first',
                disabled: true,
                handler: me.moveFirst,
                scope: me
            },
            {
                itemId: 'prev',
                tooltip: me.prevText,
                overflowText: me.prevText,
                iconCls: Ext.baseCSSPrefix + 'tbar-page-prev',
                disabled: true,
                handler: me.movePrevious,
                scope: me
            },
            '',
            ''
        ];
        var endItems = [
            '',
            '',
            {
                itemId: 'next',
                tooltip: me.nextText,
                overflowText: me.nextText,
                iconCls: Ext.baseCSSPrefix + 'tbar-page-next',
                disabled: true,
                handler: me.moveNext,
                scope: me
            },
            {
                itemId: 'last',
                tooltip: me.lastText,
                overflowText: me.lastText,
                iconCls: Ext.baseCSSPrefix + 'tbar-page-last',
                disabled: true,
                handler: me.moveLast,
                scope: me
            }
        ];
        return [].concat(beginItems, btns, endItems);
    },

    moveTo: function (index) {
        if (this.fireEvent('beforechange', this, index) !== false) {
            this.store.loadPage(index);
        }
    },

    getAvailablePages: function () {
        var pageCount = this.store.getTotalCount ? this.getPageData().pageCount : 0;
        var currentPage = this.store.getTotalCount ? this.getPageData().currentPage : 0;
        return this.generatePages(currentPage, pageCount, this.maxPagesCount);
    },

    generatePages: function (currentPage, pageCount, maxPagesCount) {
        var startIndex = Math.max(1, currentPage - 1);
        var endIndex = Math.min(startIndex + maxPagesCount - 1, pageCount);
        startIndex = Math.max(endIndex - maxPagesCount + 1, 1);

        var result = this.generateArray(Math.min(maxPagesCount, endIndex - startIndex + 1));
        var returnArr = Ext.Array.map(result, function (v) {
            return v + startIndex;
        });
        return this.truncateArrayForNavigation(returnArr, pageCount);
    },

    truncateArrayForNavigation: function (arr, pageCount) {
        var currentPage = this.store.getTotalCount ? this.getPageData().currentPage : 0;
        if (arr[0] > 1) {
            arr[0] = 1;
        }
        if (arr[arr.length - 1] < pageCount) {
            arr[arr.length - 1] = pageCount;
        }

        if (currentPage == 3) {
            for (var i = 1; i <= 5; i++) {
                if (pageCount >= (i + 1)) {
                    arr[i] = i + 1;
                }
            }
        }

        if ((currentPage > 3) && (currentPage < (pageCount - 3))) {
            for (var i = 1; i <= 5; i++) {
                arr[i] = currentPage + (i-3);
            }
        }

        return arr;
    },

    /**
     *  Массив, содержащий количество элементов
     * */
    generateArray: function (count) {
        var returnArr = Ext.Array.map(Array.apply(null, new Array(count)), Number.call, Number);
        return returnArr;
    },

    /**
     *  Прибавляем к значениям массива по одному, выходя из нуля
     * */
    getPossiblePages: function () {
        var result = this.generateArray(this.maxPagesCount);
        var returnArr = Ext.Array.map(result, function (v) {
            return v + 1;
        });
        return returnArr;
    },

    onLoad: function () {
        var me = this;
        this.callOverridden();

        Ext.each(this.getPossiblePages(), function (item, index) {
            var element = me.child('#item' + index);
            element.hide();
        });
        var availablePages = this.getAvailablePages();
        var pageCount = this.store.getTotalCount ? this.getPageData().pageCount : 0;
        var currentPage = this.store.getTotalCount ? this.getPageData().currentPage : 0;
        var maxPagesCount = this.maxPagesCount;
        if (availablePages.length) {
            me.show();
            Ext.each(availablePages, function (item, index) {

                var itemText = item;

                var element = me.child('#item' + index);

                if (item === me.getPageData().currentPage) {
                    element.addClsWithUI('focus');
                } else {
                    element.removeClsWithUI('focus');
                }

                if (
                    (pageCount > maxPagesCount) && (
                        ( (index == 1) && (currentPage > 3) )
                            ||
                            ((index == (maxPagesCount - 2)) && (currentPage < (pageCount - 3)) )
                        )
                    ) {
                    itemText = '...';

                    element.handler = null;
                    element.disabledOnClick = true;
                    element.addCls('noImg');
                } else {
                    element.removeCls('noImg');
                    element.disabledOnClick = false;
                    element.handler = Ext.bind(me.moveTo, me, [item]);
                }

                element.setText(itemText);
                element.show();
            });
        } else {
            me.hide();
        }
    }

});