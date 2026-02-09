/*
 * Сервис для электронной цифровой подписи
 * EDS - Electronic Digital Sign
 * */
Ext.define('COURIERONLINE.services.EDSService', {

    //requires: ['COURIERONLINE.model.OperatorInfo', 'COURIERONLINE.model.ClientInfo'],

    /**
     * Ссообщения об ошибках (могут быть переопределены в locale\ru.js)
     */
    msgPluginIsLoadedOld      : 'Плагин загружен, но есть более свежая версия',
    msgPluginNotDeclared      : 'Плагин не подключен.',
    msgPluginNotWorked        : 'Плагин не загружен. Скачайте и установите плагин',
    msgErrorOpenStore         : 'Ошибка при открытии хранилища.',
    msgErrorListStore         : 'Ошибка при перечислении сертификатов',
    msgErrorGetName           : 'Ошибка при получении свойства SubjectName',
    msgErrorGetThumb          : 'Ошибка при получении свойства Thumbprint',
    msgNotCreateObjectCPSigner: 'Не удается создать объект CPSigner',
    msgNotCreateSign          : 'Не удалось создать подпись из-за ошибки',
    msgNotFound               : 'Сертификат не найден',
    msgNotEncrypt             : 'Не удалось расшифровать контент',

    /**
     * Доступные сертификаты CAPICOM
     */
    certificateStore     : null,
    /**
     *  Хранилище сертификатов
     */
    oStore               : null,
    /**
     * Объект, задающий параметры создания и
     * содержащий информацию об усовершенствованной подписи.
     */
    oSigner              : null,
    /**
     * Подписанные данные.
     * Объект CadesSignedData предоставляет свойства
     * и методы для работы с усовершенствованной подписью.
     */
    oSignedData          : null,

    /**
     * Расшифровывает данные.
     */
    oEnvelopedData          : null,

    /**
     * Описывает текущую версию библиотеки
     */
    oAbout               : null,
    /**
     * Ссылка на плагин объявляемый тегом
     * <object id="cadesplugin" type="application/x-cades" class="hiddenObject"></object>
     */
    cadesplugin          : null,
    /**
     * Минммально допустимая версия плагина
     */
    requiredPluginVersion: '1.5.1400',

    CAPICOM_ENCODE_BASE64: 0,

    CADESCOM_CADES_BES: 1,
    CADESCOM_BASE64_TO_BINARY: 1,

    /**
     * инициализация необходимого окружения для работы плагина
     */
    init: function () {
        if (!this._getCurrentCertName()) {
            this.showCertWin();
        }
    },

    /**
     * @public
     * Генерация подписи
     * @param content
     * @returns String
     * @param [callback]
     */
    generateSign: function (content, callback) {
        callback = callback || Ext.emptyFn;
        try {
            this._initPluginObjects();
            var signContent = this._signContent(content);
            callback(signContent);
            return signContent;
        } catch (e) {
            Ext.Msg.error(this._getErrorMessage(e), function () {
                callback('');
            });
            return '';
        }
    },

    /**
     * @public
     * Отображение окна для выбора активного сертификата
     */
    showCertWin: function () {
        try {
            this._initPluginObjects();
            this._checkPlugin();
            this._fillCertList();
        } catch (e) {
            Ext.Msg.error(this._getErrorMessage(e));
            return null;
        }

        var win = Ext.create('COURIERONLINE.view.CertWin');
        var grid = win.down('gridpanel');
        var gridStore = grid.getStore();
        var currentCert = this._getCurrentCertName();

        this._fillGridStore(gridStore, function () {
            if (currentCert) {
                var rowIndex = gridStore.find('hash', currentCert.toLowerCase());
                grid.getSelectionModel().select(rowIndex); // выделяем текущий сертификат если он есть
            }
        });

        win.show();

        return win;
    },

    _fillGridStore: function (store, callback) {
        var ProfileInfo, me = this;
        var user = Ext.global.APPLICATION && Ext.global.APPLICATION.user;
        if (user && user.isOperator()) {
            ProfileInfo = Ext.ModelManager.getModel('COURIERONLINE.model.OperatorInfo');
        } else if (user && user.isClient()) {
            ProfileInfo = Ext.ModelManager.getModel('COURIERONLINE.model.ClientInfo');
        }
        var localCerts = this.getCertificateStore();
        if (ProfileInfo) {
            ProfileInfo.load({}, {
                success: function (record) {
                    /**
                     * Отображаем только активные сертификаты
                     */
                    var filteredCertificates = Ext.Array.filter(record.get('certificates'), function (v) {
                        return v.isActive;
                    });
                    /**
                     * помечаем сертификаты доступные локально
                     */
                    Ext.Array.each(filteredCertificates, function (v, i, all) {
                        var cert = localCerts.findRecord('value', v.hash.toUpperCase());
                        all[i].isLocal = !!cert;
                        all[i].hasPrivateKey = false;
                        if (cert) {
                            var localCert = me._getCurrentCert(v.hash);
                            try {
                                all[i].hasPrivateKey = localCert.HasPrivateKey();
                            } catch (ex) {
                                Ext.Msg.error(me._getErrorMessage(ex));
                            }
                        }
                    });

                    store.loadData(filteredCertificates);
                    callback();
                }
            });
        }
    },

    getCertificateStore: function () {
        return this.certificateStore;
    },

    getOAbout: function () {
        return this.oAbout;
    },

    getOStore: function () {
        return this.oStore;
    },

    getRequiredPluginVersion: function () {
        return this.requiredPluginVersion;
    },

    getOSigner: function () {
        return this.oSigner;
    },

    getOSignedData: function () {
        return this.oSignedData;
    },

    setCertificateStore: function (nstore) {
        this.certificateStore = nstore;
    },

    setOAbout: function (oabout) {
        this.oAbout = oabout;
    },

    setOEnvelopedData: function (oEnvelopedData) {
        this.oEnvelopedData = oEnvelopedData;
    },

    getOEnvelopedData: function () {
        return this.oEnvelopedData;
    },

    setOStore: function (ostore) {
        this.oStore = ostore;
    },

    setOSigner: function (osigner) {
        this.oSigner = osigner;
    },

    setOSignedData: function (osigneddata) {
        this.oSignedData = osigneddata;
    },

    _initPlugin: function () {
        if (!this.cadesplugin) {
            if (Ext.get('cadesplugin')) {
                this.cadesplugin = Ext.get('cadesplugin').dom;
            } else {
                throw new Error(this.msgPluginNotDeclared);
            }
        }
        return this.cadesplugin;
    },

    /**
     * Создание всех необходимых для работы объектов плагина
     * @private
     */
    _initPluginObjects: function () {
        this.setOSigner(this._createPluginObject('CAdESCOM.CPSigner'));
        this.setOSignedData(this._createPluginObject('CAdESCOM.CadesSignedData'));
        this.setOStore(this._createPluginObject('CAPICOM.store'));
        this.setOAbout(this._createPluginObject('CAdESCOM.About'));
        this.setOEnvelopedData(this._createPluginObject('CAdESCOM.CPEnvelopedData'));
    },

    /**
     * Фабричный метод для создания объектов плагина
     * @private
     */
    _createPluginObject: function (name) {
        if (Ext.isIE) {
            return new ActiveXObject(name);
        } else {
            var cadesobject = this._initPlugin();
            return cadesobject.CreateObject(name);
        }
    },

    /**
     *
     * @param oCert
     * @private
     */
    _createOSigner: function (oCert) {
        var oSigner = this.getOSigner();
        if (!oSigner) {
            throw new Error(this.msgNotCreateObjectCPSigner);
        }

        oSigner.Certificate = oCert;
        oSigner.Options = 1;
        return oSigner;
    },


    _encryptContent: function (content, certificate) {
        if (content === null) {
            return null;
        }
        var currentCert = certificate || this._getCurrentCert();
        if (!currentCert) {
            throw new Error(this.msgNotFound);
        }

        this.oEnvelopedData.Recipients.Clear();
        this.oEnvelopedData.Content = content;
        this.oEnvelopedData.Recipients.Add(certificate);

        try {
            return this.oEnvelopedData.Encrypt();
        }
        catch (e) {
            return null;
        }
        return null;
    },


    _decryptContent: function (content, certificate) {
        if (content === null) {
            return null;
        }

        var currentCert = certificate || this._getCurrentCert();
        if (!currentCert) {
            throw new Error(this.msgNotFound);
        }

        var oEData = this.oEnvelopedData;
        oEData.Recipients.Clear();
        oEData.ContentEncoding = this.CADESCOM_BASE64_TO_BINARY;
        oEData.Content = content;
        oEData.Recipients.Add(certificate);
        oEData.Decrypt(content);

        try {
            return oEData.Content;
        }
        catch (e) {
            return null;
        }
        return null;
    },

    /**
     *
     * @param content
     * @returns {string}
     * @private
     * @param [certificate]
     */
    _signContent: function (content, certificate) {
        var currentCert = certificate || this._getCurrentCert();
        if (!currentCert) {
            throw new Error(this.msgNotFound);
        }
        var oSigner = this._createOSigner(currentCert);
        var oSignedData = this.getOSignedData();
        oSignedData.ContentEncoding = this.CADESCOM_BASE64_TO_BINARY;
        oSignedData.Content = content;
        return oSignedData.SignCades(oSigner, this.CADESCOM_CADES_BES, true, this.CAPICOM_ENCODE_BASE64);
    },

    /**
     * Получение объекта текущего сертификата
     */
    _getCurrentCert: function (key) {
        key = key || this._getCurrentCertName();
        if (!key) {
            return null;
        }

        var thumbprint = key.split(' ').reverse().join('').replace(/\s/g, '').toUpperCase();

        var oStore = this.getOStore();
        this._openOStore(oStore);

        var oCerts = oStore.Certificates;
        var certCnt = oCerts.Count;
        for (var i = 1; i <= certCnt; i++) {
            try {
                var cCert = oCerts.Item(i);
                if (cCert.Thumbprint === thumbprint) {
                    return cCert;
                }
            } catch (e) {
                throw new Error(this.msgErrorGetThumb + ': ' + this._getErrorMessage(e));
            }
        }
        return null;
    },


    /**
     * Получение объекта первого сертификата
     */
    _getFirstCert: function () {
        var oStore = this.getOStore();
        this._openOStore(oStore);

        var oCerts = oStore.Certificates;

        try {
            var cCert = oCerts.Item(1);
            return cCert;
        } catch (e) {
            throw new Error(this.msgErrorGetThumb + ': ' + this._getErrorMessage(e));
        }

        return null;
    },


    /**
     * Проверка работоспособности плагина и его версии
     * @private
     */
    _checkPlugin: function () {
        var oAbout = this.getOAbout();
        if (!oAbout) {
            throw new Error(this.msgPluginNotWorked);
        }

        var isActualVersion = this.getRequiredPluginVersion() <= oAbout.Version;

        if (!isActualVersion) {
            throw new Error(this.msgPluginIsLoadedOld);
        }
        return true;
    },

    /**
     *
     * @param oStore
     * @private
     */
    _openOStore: function (oStore) {
        try {
            oStore.Open();
        } catch (e) {
            throw new Error(this.msgErrorOpenStore + ':<br> ' + this._getErrorMessage(e));
        }
    },

    /**
     * Заполнение списка доступных сертификатов
     * @private
     */
    _fillCertList: function () {
        var cert, oStore = this.getOStore();

        this._openOStore(oStore);
        var certCnt = oStore.Certificates.Count;
        var certStore = this._createCertStore();
        this.setCertificateStore(certStore);

        for (var i = 1; i <= certCnt; i++) {
            try {
                cert = oStore.Certificates.Item(i);
            } catch (e) {
                throw new Error(this.msgErrorListStore + ': ' + this._getErrorMessage(e));
            }
            var arg = {  };
            try {
                arg.text = cert.SubjectName;
            } catch (e) {
                throw new Error(this.msgErrorGetName + ': ' + this._getErrorMessage(e));
            }
            try {
                arg.value = cert.Thumbprint;
            } catch (e) {
                throw new Error(this.msgErrorGetThumb + ': ' + this._getErrorMessage(e));
            }
            certStore.add(arg);
        }

        oStore.Close();
        return true;
    },


    /**
     * Получение списка доступных сертификатов
     * @private
     */
    _getCertList: function () {
        var cert, oStore = this.getOStore();
        this._openOStore(oStore);
        var certCnt = oStore.Certificates.Count;
        var certStore = this._createCertStore();
        this.setCertificateStore(certStore);

        for (var i = 1; i <= certCnt; i++) {
            try {
                cert = oStore.Certificates.Item(i);
            } catch (e) {
                throw new Error(this.msgErrorListStore + ': ' + this._getErrorMessage(e));
            }
            var arg = {  };

            try {
                arg.text = cert.GetInfo(0);
            } catch (e) {
                throw new Error(this.msgErrorGetName + ': ' + this._getErrorMessage(e));
            }


            try {
                arg.value = cert.Thumbprint;
            } catch (e) {
                throw new Error(this.msgErrorGetThumb + ': ' + this._getErrorMessage(e));
            }
            certStore.add(arg);

        }

        oStore.Close();
        return certStore;
    },

    /**
     *
     * @returns {Ext.data.ArrayStore}
     * @private
     */
    _createCertStore: function () {
        return Ext.create('Ext.data.ArrayStore', {
            autoLoad: false,
            fields  : ['text', 'value'],
            data    : []
        });
    },

    /**
     *
     * @param e
     * @returns {string}
     * @private
     */
    _getErrorMessage: function (e) {
        if (!e.message) {
            return e;
        }
        var err = e.message;
        if (e.number) {
            err += ' (0x' + this._decimalToHexString(e.number) + ')';
        }
        return err;
    },

    /**
     *
     * @param number
     * @returns {string}
     * @private
     */
    _decimalToHexString: function (number) {
        if (number < 0) {
            number = 0xFFFFFFFF + number + 1;
        }
        return number.toString(16).toUpperCase();
    },

    /**
     *
     * @returns {string}
     * @private
     */
    _getCurrentCertName: function () {
        return Ext.util.Cookies.get('currentCert');
    },

    updateCurrentCert: function (data, callback) {
        var item = data[0];
        var thumb = item.hash.toUpperCase();
        var msg = this.validateCertificate(item);

        if (msg) {
            Ext.Msg.show({
                msg    : msg,
                title  : 'Внимание',
                buttons: Ext.Msg.OKCANCEL,
                icon   : Ext.Msg.QUESTION,
                fn     : function (buttonId) {
                    if (buttonId === 'ok') {
                        Ext.util.Cookies.set('currentCert', thumb);
                        callback();
                    }
                }
            });
        } else {
            Ext.util.Cookies.set('currentCert', thumb);
            callback();
        }
    },

    validateCertificate: function (item) {
        var msg = '';
        if (!item.hasPrivateKey) {
            msg += 'Данный сертификат не имеет закрытого ключа, <br>';
        }
        var today = new Date();
        var format = 'd.m.Y H:i:s';
        var isActual = Ext.Date.parse(item.validFrom, format) < today
            && Ext.Date.parse(item.validThrough, format) > today;
        if (!isActual) {
            msg += 'Данный сертификат имеет не актуальный срок действия, <br>';
        }

        if (msg) {
            msg += 'вы действительно хотите установить его текущим?';
        }

        return msg;
    },

    encode: function (content) {
        this._initPluginObjects();
        var envData = this.getOEnvelopData();
        var cert = this._getCurrentCert();
        if (!cert) {
            throw new Error(this.msgNotFound);
        }
        envData.Recipients.Clear();
        envData.Recipients.Add(cert);
        envData.Content = content;
        return envData.Encrypt();
    },

    decode: function (content) {
        var envData = this.getOEnvelopData();
        envData.Decrypt(content);
        return envData.Content;
    }

});