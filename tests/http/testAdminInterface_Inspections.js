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
        login   : 'admin',
        password: '123'
    })
    .expect(200)
    .expect('setAuth', helpers.saveAuth(suite))

    .next()

    .discuss('Создаем новую инспекцию')
    .post({
        mth: 'addInspection',
        action: 'invoke',
        obj: 'admin',
        data: JSON.stringify({
            name      : '111',
            systemName: '222'
        })
    })
    .expect('create_inspection', function (err, res, body) {
        assert.isObject(JSON.parse(body));
        inspectionId = JSON.parse(body).id;

        suite.before('update_inspection', function (outgoing) {
            var inspection = JSON.stringify({
                id          : inspectionId,
                name      : '333',
                systemName: '444'
            });
            outgoing.body += '&data=' + inspection;
            console.log(outgoing.body);
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
        obj   : 'admin'
    })
    .expect('update', function (err, res, body) {
        console.log(body);
        assert.isEmpty(body);
    })
    .expect(200)

    .next()

    .discuss('Проверяем созданную инспекцию')
    .post({
        mth         : 'getInspections',
        action      : 'invoke',
        obj         : 'admin',
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

        suite.before('save admin id', function (outgoing) {
            outgoing.body += '&id=' + inspectionId;
            suite.unbefore('save admin id');
            return outgoing;
        });
    })
    .expect(200)

    .next()

    .discuss('Удаляем созданную инспекцию')
    .post({
        mth: 'deleteInspection',
        action: 'invoke',
        obj: 'admin'
    })
    .expect(200)

    .next()

    .discuss('Проверяем удаленную инспекцию')
    .post({
        mth         : 'getInspections',
        action      : 'invoke',
        obj         : 'admin',
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