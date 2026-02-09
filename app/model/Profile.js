Ext.define('COURIERONLINE.model.Profile', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'orgType', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'surName', type: 'string'},
        {name: 'login', type: 'string'},
        {name: 'fullName', type: 'string'},
        {name: 'patrName', type: 'string'}
    ],

    proxy: {
        type: 'ajax',
        url: Ext.global.baseUrl,
        extraParams   : {
            action: 'invoke',
            obj: 'profile'
        },
        writer: {
            root: 'data',
            encode: true
        },
        api: {
            read: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'getInfo'
            })),
            update: Ext.urlAppend(Ext.global.baseUrl, Ext.Object.toQueryString({
                mth: 'updateInfo'
            }))
        }
    },

    isOperator: function () {
        return this.get('orgType').toLowerCase() === 'operator';
    },

    isAdmin: function () {
        return this.get('login').toLowerCase() === 'admin';
    },

    isClient: function () {
        return this.get('orgType').toLowerCase() === 'client';
    },

    getNavigatorProxy: function () {
        var path = Ext.global.rootUrl + 'data/';
        if (this.isClient()) {
            return {
                type: 'ajax',
                url: path + 'navigatorClient.json'
            };
        }
        if (this.isOperator()) {
            return {
                type: 'ajax',
                url: path + 'navigatorOperator.json'
            };
        }
        if (this.isAdmin()) {
            return {
                type: 'ajax',
                url: path + 'navigatorAdmin.json'
            };
        }
        return false;
    },

    getNoticeProxy: function () {
        var path = Ext.global.rootUrl + 'data/';
        return {
            type: 'ajax',
            url: path + 'noticeAll.json'
        };
    }

});