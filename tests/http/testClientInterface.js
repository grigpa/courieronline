var APIeasy = require('api-easy');
var assert = require('assert');

var suite = APIeasy.describe('api');
var helpers = require('../jstestdriver/helpers.js');
var port = process.argv[3] ? process.argv[3].split('=')[1] : 8080;

/**
 * Тестирование процедуры авторизации для
 * пользователя с ролью Клиента (Организация)
 */
suite
    .use('localhost', port)
    .path('ccwe/main')
    .setHeader('Content-Type', 'application/x-www-form-urlencoded')

    .discuss('Авторизуемся клиентом')
    .post({
        action  : 'authenticate',
        login   : 'NWUDC.12345667788990',
        password: 'NWUDC.12345667788990'
    })
    .expect(200)
    .expect('setAuth', helpers.saveAuth(suite))

    .next()

    .discuss('Проверяем что можем получить данные профиля')
    .post({
        action: 'invoke',
        obj   : 'profile',
        mth   : 'getInfo'
    })
    .expect(200, {
        orgType : 'Client',
        name    : null,
        surName : null,
        login   : 'NWUDC.12345667788990',
        fullName: 'Респондент',
        patrName: null
    })

    .discuss('Проверяем что имеем доступ к просмотру исходящих документов')
    .post({
        action      : 'invoke',
        obj         : 'docRoutes',
        mth         : 'getDocRouteList',
        folderType  : 'outbox',
        page        : 1,
        itemsPerPage: 10
    })
    .expect(200)
    .expect('is array', function (err, res, body) {
        var obj = JSON.parse(body);
        assert.isObject(obj);
        assert.isNumber(obj.total);
        assert.isArray(obj.items);
    })

    .discuss('Проверяем что имеем доступ к просмотру входящих документов')
    .post({
        action      : 'invoke',
        obj         : 'docRoutes',
        mth         : 'getDocRouteList',
        folderType  : 'inbox',
        page        : 1,
        itemsPerPage: 10
    })
    .expect(200)
    .expect('is array', function (err, res, body) {
        var obj = JSON.parse(body);
        assert.isObject(obj);
        assert.isNumber(obj.total);
        assert.isArray(obj.items);
    })

    .discuss('Проверяем что имеем доступ к просмотру черновиков документов')
    .post({
        action      : 'invoke',
        obj         : 'docRoutes',
        mth         : 'getDocRouteList',
        folderType  : 'draft',
        page        : 1,
        itemsPerPage: 10
    })
    .expect(200)
    .expect('is array', function (err, res, body) {
        var obj = JSON.parse(body);
        assert.isObject(obj);
        assert.isNumber(obj.total);
        assert.isArray(obj.items);
    })

    .export(module);