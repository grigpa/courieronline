Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false
});

Ext.data.proxy.Server.prototype.noCache = false;
Ext.Ajax.disableCaching = false;

// TODO: добавить тест для сценария подписи документа

// TODO: добавить тест для случая когда отстутствует плагин
// cadesplugin на странице - должно выводиться соответсьвующее сообщение

new TestCase('EDSService', {


    setUp: function () {
        Ext.global.baseUrl = '/';
        this.service = Ext.create('COURIERONLINE.services.EDSService', {});
        Ext.util.Cookies.clear('currentCert');
        this.documentId = 'testIdDocument';
        this.service.cadesplugin = {
            CreateObject: function (name) {
                if (name === 'CAPICOM.store') {
                    return {
                        Open: function () {
                        },
                        Close: function () {
                        },
                        Certificates: {
                            Find: function () {
                                return {
                                    Count: 1
                                };
                            },
                            Count: 1,
                            Item: function () {
                                return {
                                    Thumbprint: '111111'
                                };
                            }
                        }
                    };
                } else if (name === 'CAdESCOM.About') {
                    return {
                        Version: '1.5.1400'
                    };
                } else {
                    return name;
                }
            }
        };
    },

    testCreate: function () {
        assertNotUndefined(this.service);
        assertNotNull(this.service);
        assertInstanceOf(COURIERONLINE.services.EDSService, this.service);
    },

    // TODO: тест для случая когда отстутствует плагин cadesplugin на странице -
    // должно выводиться соответсьвующее сообщение
    testIsPlugin: function () {
        var fakeOAbout = {
            Version: this.service.requiredPluginVersion
        };
        this.service.setOAbout(fakeOAbout);
        var checkPlugin = this.service._checkPlugin();
        assertTrue(checkPlugin);
    },

    testIsShowMsgBox: function () {
        var win = this.service.showCertWin();
        assertTrue(win.isVisible());
    },

    testCurrentCert: function () {

        var testKey = '111111';
        var fakeOSigner = {
            Certificate: {},
            Options: 1
        };
        var fakeOStore = {
            Open: function () {
            },
            Certificates: {
                Find: function () {
                    return {
                        Count: 1
                    };
                },
                Count: 1,
                Item: function () {
                    return {
                        Thumbprint: '111111'
                    };
                }
            }
        };

        var fakeOSignedData = {
            Content: '1',
            SignCades: function () {
                return '1';
            }
        };

        this.service.setOStore(fakeOStore);
        this.service.setOSigner(fakeOSigner);
        this.service.setOSignedData(fakeOSignedData);
        var testCert = this.service._getCurrentCert(testKey);
        assertNotNull(testCert);
    },

    testFillCertList: function () {
        var fakeOStoreFill = {
            Open: function () {
            },
            Certificates: {
                Count: 1,
                Item: function (i) {
                    return {
                        id: i,
                        SubjectName: '111',
                        Thumbprint: '222'
                    };
                },
                Find: function () {
                    return {
                        Count: 1,
                        Item: function (i) {
                            return {
                                id: i,
                                SubjectName: '111',
                                Thumbprint: '222'
                            };
                        }
                    };
                }
            },
            Close: function () {

            }
        };
        this.service.setOStore(fakeOStoreFill);
        var fill = this.service._fillCertList();
        assertTrue(fill);
    },

    testSignContent: function () {
        var fakeOSigner = {
            Certificate: {},
            Options: 1
        };
        var fakeOSignedData = {
            Content: '1',
            SignCades: function () {
                return true;
            }
        };

        this.service.setOSigner(fakeOSigner);
        this.service.setOSignedData(fakeOSignedData);

        var fakeCertificate = '1111';
        var sign = this.service._signContent('', fakeCertificate);

        assertFalse(!!this.service._getCurrentCertName());
        assertNotNull(sign);
        assertTrue(sign);
    },

    testDecimalToHexString: function () {
        var dec = this.service._decimalToHexString(22);
        assertNotNull(dec);
    },

    testGetErrorMessage: function () {
        var err = this.service._getErrorMessage('err');
        assertNotNull(err);
    }

});

