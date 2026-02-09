var APIeasy = require('api-easy');
var assert = require('assert');
var helpers = require('../jstestdriver/helpers.js');

var port = process.argv[3] ? process.argv[3].split('=')[1] : 8080;

var suite = APIeasy.describe('api');
var inspectionId;

/**
 * Тестирование раздела инспекции оператором
 * (создание, удаление, изменение записей)
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

    .discuss('Получаем список ТОГС')
    .post({
        action: 'invoke',
        obj   : 'operator',
        mth   : 'getAllTogs',
        page  : 1,
        start : 0,
        limit : 25
    })
    .expect('get togs id', function (err, res, body) {
        var togs = JSON.parse(body)[0];
        suite.before('save_togs', function (outgoing) {
            var inspection = JSON.stringify({
                id          : togs.id,
                systemName  : togs.systemName,
                name        :  togs.name,
                email       : 'test@mail.ru'
            });
            outgoing.body += '&inspection=' + inspection;
            suite.unbefore('save_togs');
            return outgoing;
        });
    })

    .next()

    .discuss('Создаем новую инспекцию')
    .post({
        mth: 'addInspection',
        action: 'invoke',
        obj: 'operator'
    })
    .expect('update_inspection', function (err, res, body) {
        assert.isObject(JSON.parse(body));

        inspectionId = JSON.parse(body).id;

        suite.before('update_inspection', function (outgoing) {
            var inspection = JSON.stringify({
                id          : inspectionId,
                email       : 'new@mail.ru'
            });
            outgoing.body += '&inspection=' + inspection;
            suite.unbefore('update_inspection');
            return outgoing;
        });
    })
    .expect(200)

    .next()

    .discuss('изменяем инспекцию')
    .post({
        mth   : 'updateInspection',
        action: 'invoke',
        obj   : 'operator'
    })
    .expect('update', function (err, res, body) {
        assert.isEmpty(body);
    })
    .expect(200)

    .next()

    .discuss('Проверяем созданную инспекцию')
    .post({
        mth         : 'getInspections',
        action      : 'invoke',
        obj         : 'operator',
        page        : 1,
        itemsPerPage: 10
    })
    .expect('is array', function (err, res, body) {
        var inspections = JSON.parse(body);
        var inspection = inspections.filter(function (item) {
            return item.id === inspectionId;
        })[0];
        assert.ok(!!inspection);
        assert.ok(inspection.name);
        assert.ok(inspection.systemName);
        assert.equal(inspection.email, 'new@mail.ru');

        suite.before('save operator id', function (outgoing) {
            outgoing.body += '&id=' + inspectionId;
            suite.unbefore('save operator id');
            return outgoing;
        });
    })
    .expect(200)

    .next()

    .discuss('Удаляем созданную инспекцию')
    .post({
        mth: 'deleteInspection',
        action: 'invoke',
        obj: 'operator'
    })
    .expect(200)

    .next()

    .discuss('Проверяем удаленную инспекцию')
    .post({
        mth         : 'getInspections',
        action      : 'invoke',
        obj         : 'operator',
        page        : 1,
        itemsPerPage: 10
    })
    .expect('is array', function (err, res, body) {
        var inspections = JSON.parse(body);
        var inspection = inspections.filter(function (item) {
            return item.id === inspectionId;
        });
        assert.equal(inspection.length, 0); // удаленная инспекция не найдена
    })
    .expect(200)

    .export(module);