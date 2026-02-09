var APIeasy = require('api-easy');
var assert = require('assert');
var helpers = require('../jstestdriver/helpers.js');

var suite = APIeasy.describe('api');
var port = process.argv[3] ? process.argv[3].split('=')[1] : 8080;

/**
 * Тестирование процедуры авторизации для пользователя admin
 */
suite
    .use('localhost', port)
    .path('ccwe/main')
    .setHeader('Content-Type', 'application/x-www-form-urlencoded')

    .discuss('Авторизуемся админом')
    .post({
        action  : 'authenticate',
        login   : 'admin',
        password: 123
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
        orgType : 'Admin',
        name    : null,
        surName : null,
        login   : 'admin',
        fullName: 'Администратор системы',
        patrName: null
    })

    .discuss('Получаем инспекции')
    .post({
        mth         : 'getInspections',
        action      : 'invoke',
        obj         : 'admin',
        page        : 1,
        itemsPerPage: 10
    })
    .expect(200)
    .expect('is array', function (err, res, body) {
        assert.isArray(JSON.parse(body));
    })

    .discuss('Получаем операторов')
    .post({
        mth         : 'getOperators',
        action      : 'invoke',
        obj         : 'admin',
        page        : 1,
        itemsPerPage: 10
    })
    .expect(200)
    .expect('is array', function (err, res, body) {
        assert.isArray(JSON.parse(body));
    })

    .export(module);