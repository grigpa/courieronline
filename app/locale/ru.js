Ext.define('COURIERONLINE.locale.ru', {
    extend: 'Ext.Base'
});

Ext.define('COURIERONLINE.locale.statusbar.StatusBar', {
    override: 'Ext.ux.statusbar.StatusBar',

    busyText: 'Loading...',
    emptyText: 'Данные валидны&#160;&#160;&#160;&#160;&#160;&#160;&#160;'
});

Ext.define('COURIERONLINE.locale.statusbar.ValidationStatus', {
    override: 'Ext.ux.statusbar.ValidationStatus',

    showText: 'Форма содержит ошибки',
    hideText: 'Скрыть список ошибок',
    submitText: 'Отправка данных'
});

Ext.define('COURIERONLINE.locale.MessageBox', {
    override: 'Ext.window.MessageBox',

    errorMsg: 'Ошибка'
});

Ext.define('COURIERONLINE.locale.EDSService', {
    override: 'COURIERONLINE.services.EDSService',

    msgPluginIsLoadedOld: 'Плагин загружен, но есть более свежая версия<br><a href="certsrv/cadesplugin.exe">скачать</a>',
    msgPluginNotWorked: 'Плагин не загружен. <br><a href="certsrv/cadesplugin.exe">скачайте</a> и установите плагин',
    msgErrorOpenStore: 'Ошибка при открытии хранилища. Пожалуйста, проверьте наличие сертификатов и выберите действующий в настройках',
    msgErrorListStore: 'Ошибка при перечислении сертификатов',
    msgErrorGetName: 'Ошибка при получении свойства SubjectName',
    msgErrorGetThumb: 'Ошибка при получении свойства Thumbprint',
    msgNotCreateObjectCPSigner: 'Не удается создать объект CPSigner',
    msgNotCreateSign: 'Не удалось создать подпись из-за ошибки'
});

/**
 * Строковые константы
 *
 * В АЛФАВИТНОМ ПОРЯДКЕ ПО ПЕРВОЙ БУКВЕ
 */
var Msg = {};
Msg = {
    authProgress: 'Авторизация...',
    authError: 'Авторизация не успешна',
    tasks: 'Автоматическая обработка',
    templates: 'Шаблоны',


    docNotDelivery: 'Документ не получен',
    docNotSend: 'Документ не отправлен',

    exit: 'Выход',
    inbox: 'Входящие',
    exitConfirm: 'Выйти из кабинета?',
    attention: 'Внимание',
    confirmRemoveRecords: 'Вы действительно хотите удалить выделенные записи?',
    confirmRemoveAttach: 'Вы действительно хотите удалить вложение письма?',
    selectSignRow: 'Выберите подпись для документа',
    selectCertRow: 'Выберите сертификат',

    noRolesForCurrentUser: 'Для текущего пользователя не задано ни одной роли',
    add: 'Добавить',

    fileUploading: 'Загрузка файла...',
    letterSend: 'Отправка письма...',

    change: 'Изменить',
    edit: 'Редактировать',
    importMsg: 'Импорт',
    newDoc: 'Новый документ',
    news: 'Новости',
    inspection: 'Инспекция',
    inspections: 'Инспекции',
    togsName: 'Имя ТОГС',
    pfrName: 'Имя УПФР',
    login: 'Имя пользователя',
    importSuccess: 'Импорт успешно завершен',
    inn: 'ИНН',
    regNum: 'Регистрационный номер',

    docflows: 'Документообороты',

    innInvalidText: 'ИНН должен содержать 10 или 12 символов',
    ogrnInvalidText: 'ОГРН должен содержать строго 13 цифр (для ЮЛ) или строго 15 цифр (для ИП)',
    okpdInvalidText: 'ОКПО должен содержать 10 или 12 символов',
    kppInvalidText: 'КПП должен содержать 9 символов',

    hideReceipts: 'Скрыть квитанции',
    showReceipts: 'Показать квитанции',

    cannotPerformRequest: 'Невозможно завершить запрос',

    outbox: 'Отправленные',
    organizations: 'Организации',
    operators: 'Операторы',
    importFail: 'Ошибка при импорте',
    importSend: 'Ошибка при отправке',
    error: 'Ошибка',
    requestError: 'Ошибка запроса',

    print: 'Печать',
    certPluginIsLoaded: 'Плагин загружен',
    details: 'Подробности',
    documentFileName: 'Имя файла',

    edoTitle: 'Оператор',
    editKey: 'Редактирование ключа',
    editOperator: 'Редактирование оператора',
    editOrganization: 'Редактирование организации',

    start: 'Старт',
    create: 'Создать',
    stop: 'Стоп',
    msgTitle: 'Сообщение',

    createDoc: 'Создан',
    activeDoc: 'Документ активен',
    decline: 'Отвергнут',

    docNotFound: 'Документ отсутствует',

    togsTable: 'Таблица E-mail ТОГС для исходящих сообщений',

    remove: 'Удалить',
    successOperation: 'Успешная операция',

    draft: 'Черновики',
    exportMsg: 'Экспорт',
    download: 'Экспорт',
    email: 'Электронный адрес',

    allDocs: 'Все документы',
    onlyNewDocs: 'Непросмотренные',

    allDocsLabel: 'Всего документов в папке',
    noneDocsLabel: 'Документы отсутствуют',
    onlyNewDocsLabel: 'Всего непросмотренных документов',

    docSuccessProcessed: 'Документы успешно обработаны'
};