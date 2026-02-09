var APIeasy = require('api-easy');
var assert = require('assert');
var helpers = require('../jstestdriver/helpers.js');

var port = process.argv[3] ? process.argv[3].split('=')[1] : 8080;

var suite = APIeasy.describe('api');

/**
 * Тестирование процедуры авторизации
 * для пользователя с ролью оператор
 */
suite
    .use('localhost', port)
    .path('ccwe/main')
    .setHeader('Content-Type', 'application/x-www-form-urlencoded')

    .discuss('Авторизуемся оператором')
    .post({
        action  : 'authenticate',
        login   : 'nwudc',
        password: 'nwudc'
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
        orgType : 'Operator',
        name    : null,
        surName : null,
        login   : 'nwudc',
        fullName: 'Удостоверяющий центр',
        patrName: null
    })

    .discuss('Проверяем что имеем доступ к просмотру инспекций')
    .post({
        mth         : 'getInspections',
        action      : 'invoke',
        obj         : 'operator',
        page        : 1,
        itemsPerPage: 10
    })
    .expect(200)
    .expect('is array', function (err, res, body) {
        assert.isArray(JSON.parse(body));
    })

    .discuss('Проверяем что имеем доступ к просмотру организаций')
    .post({
        mth         : 'getClients',
        action      : 'invoke',
        obj         : 'operator',
        page        : 1,
        itemsPerPage: 10
    })
    .expect(200)
    .expect('is array', function (err, res, body) {
        assert.isArray(JSON.parse(body));
    })

    .export(module);