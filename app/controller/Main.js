/**
 * Контролллер для главной страницы,
 * управляет общими свойствами различных разделов
 */
Ext.define('COURIERONLINE.controller.Main', {
    extend: 'COURIERONLINE.controller.Base',

    stores: ['Navigator', 'Notice', 'News'],

    requires: ['COURIERONLINE.model.Profile'],

    refs: [
        { ref: 'appMain', selector: 'appMain' },
        { ref: 'UserInfoPanel', selector: 'appHeader #userInfo' },
        { ref: 'importBtn', selector: 'appHeader #importform' }
    ],

    views: ['Viewport', 'Header'],

    init: function () {
        this.control({
            'appMain': {
                afterrender: this.loadUserData
            }
        });
        this.getApplication().on('login_success', this.onLoginSuccess, this);


    },

    loadNavNotifications: function (fn) {

        var me = this;
        Ext.Ajax.request({
            url: Ext.global.baseUrl,
            method: 'GET',
            hideMask: true,
            params: {
                mth: 'getFolderInfo',
                action: 'invoke',
                obj: 'docRoutes',
                folderId: 'inbox'
            },
            success: function (response) {
                var json = Ext.decode(response.responseText);
                var reject = json.rejectedCount;
                var accept = json.acceptedCount;

                var newStore = me.getNavigatorStore();
                newStore.getNodeById('input').data.counter = reject + accept;
                var input = newStore.getNodeById('input');
                if ((reject + accept) < 10) {
                    input.data.className = reject > 0 ? 'notification-counter notification-counter-red'
                        : 'notification-counter notification-counter-green';
                } else {
                    input.data.className = reject > 0 ? 'notification-counter notification-counter-red-long'
                        : 'notification-counter notification-counter-green-long';
                }


                Ext.Ajax.request({
                    url: Ext.global.baseUrl,
                    method: 'GET',
                    hideMask: true,
                    params: {
                        mth: 'getFolderInfo',
                        action: 'invoke',
                        obj: 'docRoutes',
                        folderId: 'outbox'
                    },
                    success: function (response) {
                        var json = Ext.decode(response.responseText);
                        var reject = json.rejectedCount;
                        var accept = json.acceptedCount;

                        newStore.getNodeById('output').data.counter = reject + accept;

                        if ((reject + accept) < 10) {
                            newStore.getNodeById('output').data.className = reject > 0 ? 'notification-counter notification-counter-red'
                                : 'notification-counter notification-counter-green';
                        } else {
                            newStore.getNodeById('output').data.className = reject > 0 ? 'notification-counter notification-counter-red-long'
                                : 'notification-counter notification-counter-green-long';
                        }


                        me.getNavigator().reconfigure(newStore);
                        if (Ext.isDefined(fn)) {
                            fn();
                        }

                    }
                });
            }
        });


    },

    loadNewDoc: function () {
        var me = this;

        Ext.Ajax.request({
            url: Ext.global.baseUrl,
            method: 'GET',
            hideMask: true,
            params: {
                mth: 'getDocsForDecrypt',
                action: 'invoke',
                obj: 'docRoutes'
            },
            success: function (response) {
                try {
                    var jsonDoc = Ext.decode(response.responseText);
                    var newDocCount = jsonDoc.length;
                    var jsonDocflowArr = Ext.pluck(jsonDoc, 'docflowId');

                    Ext.Ajax.request({
                        url: Ext.global.baseUrl,
                        method: 'GET',
                        hideMask: true,
                        params: {
                            mth: 'getResponsesForSign',
                            action: 'invoke',
                            obj: 'docRoutes'
                        },
                        success: function (response) {
                            try {
                                var jsonDocSign = Ext.decode(response.responseText);
                                var newPacketCount = jsonDocSign.length;
                                var newStore = me.getNoticeStore();
                                var jsonIdsArr = Ext.pluck(jsonDocSign, 'docflowId');
                                var jsonDocflowArrSign = Ext.pluck(jsonDocSign, 'docflowId');
                                var jsonIds = jsonIdsArr.join(',');

                                var elVisible = false;
                                var elDocVisible = false;

                                var isShow = false;

                                if ((newPacketCount > 0) && (Ext.Array.difference(jsonDocflowArr, jsonDocflowArrSign).length === 0)) {
                                    newStore.getNodeById('sendreceipt').data.counter = newPacketCount;
                                    newStore.getNodeById('sendreceipt').data.ids = jsonIds;
                                    elVisible = true;
                                    isShow = true;
                                }

                                if (newDocCount > 0) {
                                    newStore.getNodeById('newdoc').data.counter = newDocCount;
                                    elDocVisible = true;
                                    Ext.ComponentQuery.query('appNotice #notice')[0].reconfigure(newStore);
                                    isShow = true;
                                } else {
                                    elDocVisible = false;
                                }

                                if ((newPacketCount < 1)
                                    || (Ext.Array.difference(jsonDocflowArr, jsonDocflowArrSign).length === 0)) {
                                    elVisible = false;
                                }

                                if (isShow) {
                                    Ext.ComponentQuery.query('appNotice #notice')[0].show();
                                } else {
                                    Ext.ComponentQuery.query('appNotice #notice')[0].hide();
                                }

                                if (elVisible) {
                                    Ext.DomQuery.select('[data-recordid=sendreceipt]')[0].style.display = '';
                                } else {
                                    Ext.DomQuery.select('[data-recordid=sendreceipt]')[0].style.display = 'none';
                                }
                                if (elDocVisible) {
                                    Ext.DomQuery.select('[data-recordid=newdoc]')[0].style.display = '';
                                } else {
                                    Ext.DomQuery.select('[data-recordid=newdoc]')[0].style.display = 'none';
                                }

                                var d;
                                if (!document.getElementById('appNoticeCorner')) {
                                    d = document.createElement('div');
                                    d.className = 'appNoticeCorner';
                                    d.id = 'appNoticeCorner';
                                    d.innerHTML = ' ';
                                    Ext.ComponentQuery.query('appNotice #notice')[0].getEl().appendChild(new Ext.Element(d));
                                } else {
                                    d = document.getElementById('appNoticeCorner');
                                }
                                var cnt = 0;
                                if (Ext.DomQuery.select('[data-recordid=sendreceipt]')[0].style.display == '') {
                                    cnt += 50;
                                }
                                if (Ext.DomQuery.select('[data-recordid=newdoc]')[0].style.display == '') {
                                    cnt += 50;
                                }
                                d.style.top = cnt + 'px';

                            } catch (e) {

                            }
                        },
                        failure: function () {
                        }
                    });


                } catch (e) {

                }
            },
            failure: function () {
            }
        });
    },

    loadUserData: function () {
        var me = this;
        var Profile = Ext.ModelManager.getModel('COURIERONLINE.model.Profile');
        Profile.load({}, {
            success: function (record) {
                me.getUserInfoPanel().update(record.get('fullName'));
                me.getApplication().user = record;
                var navigatorProxy = record.getNavigatorProxy();
                if (navigatorProxy) {
                    me.getNavigatorStore().setProxy(navigatorProxy);
                    me.getNavigatorStore().load();
                    if (record.isClient()) {
                        me.getImportBtn().show();
                    }
                } else {
                    Ext.Msg.error(Msg.noRolesForCurrentUser);
                }
                var noticeProxy = record.getNoticeProxy();
                me.getApplication().user = record;

                if (noticeProxy) {
                    me.getNoticeStore().setProxy(noticeProxy);
                    me.getNoticeStore().load({
                        callback: function (records, options, success) {
                            var d;
                            if (!document.getElementById('appNoticeCorner')) {
                                d = document.createElement('div');
                                d.className = 'appNoticeCorner';
                                d.id = 'appNoticeCorner';
                                d.innerHTML = ' ';
                                Ext.ComponentQuery.query('appNotice #notice')[0].getEl().appendChild(new Ext.Element(d));
                            } else {
                                d = document.getElementById('appNoticeCorner');
                            }
                            var cnt = 0;
                            if (Ext.DomQuery.select('[data-recordid=sendreceipt]')[0].style.display == '') {
                                cnt += 50;
                            }
                            if (Ext.DomQuery.select('[data-recordid=newdoc]')[0].style.display == '') {
                                cnt += 50;
                            }
                            d.style.top = cnt + 'px';
                        }
                    });
                } else {
                    Ext.Msg.error(Msg.noRolesForCurrentUser);
                }


                var ProfileInfo;
                var user = Ext.global.APPLICATION && Ext.global.APPLICATION.user;
                if (user && user.isOperator()) {
                    ProfileInfo = Ext.ModelManager.getModel('COURIERONLINE.model.OperatorInfo');
                } else if (user && user.isClient()) {
                    ProfileInfo = Ext.ModelManager.getModel('COURIERONLINE.model.ClientInfo');
                }

                var isOperator = user.isOperator();
                var isAdmin = user.isAdmin();

                me.customizeInterface(isOperator, isAdmin);

                if (!ProfileInfo) {
                    return;
                }

                ProfileInfo.load({}, {
                    success: function (record) {
                        /**
                         * Отображаем только активные сертификаты
                         */
                        var filteredCertificates = Ext.Array.filter(record.get('certificates'), function (v) {
                            return v.isActive;
                        });
                        if (filteredCertificates.length === 1) {
                            Ext.util.Cookies.set('currentCert', filteredCertificates[0].hash.toUpperCase());
                            var certEl = Ext.ComponentQuery.query('appHeader #certificatesInfo')[0];
                            certEl.update(filteredCertificates[0].owner);
                        }
                        me.setCertWidth();
                        if (user && !user.isOperator()) {
                            me.loadNewDoc();
                        }
                    }
                });

            }
        });
    },

    onLoginSuccess: function (params) {
        params = params || {};
        if (!this.getAppMain()) {
            this.getViewportView().create();
            if (params.loadIndex !== false) {
                this.index();
            }
        }
    },

    loadNotifications: function () {
        this.loadNewDoc();
        this.loadNavNotifications();
    },


    customizeInterface: function (isOperator, isAdmin) {
        if ((!isOperator) && (!isAdmin)) {
            Ext.TaskManager.start({
                run: this.loadNotifications,
                interval: 60000,
                scope: this
            });
            Ext.ComponentQuery.query('appNotice')[0].show();
            Ext.ComponentQuery.query('appHeader #newDoc')[0].show();
            Ext.ComponentQuery.query('appHeader #show-menu-btn')[0].show();
        }
    },

    setCertWidth: function () {
        var userEl = Ext.ComponentQuery.query('appHeader #userInfo')[0];
        var certEl = Ext.ComponentQuery.query('appHeader #certificatesInfo')[0];
        var labelUser = userEl.getEl().dom.children[0].children[0].innerHTML;
        var labelCert = certEl.getEl().dom.children[0].children[0].innerHTML;
        var tm = new Ext.util.TextMetrics();
        var c = tm.getWidth(labelCert);
        var u = tm.getWidth(labelUser);
        if (c > u) {
            certEl.up().setWidth(c + 20);
        } else {
            userEl.up().setWidth(u + 20);
        }
    },

    index: function () {
        this.tryToInvoke(function () {
            return this.clickFirstMenuItem();
        });
    }

});