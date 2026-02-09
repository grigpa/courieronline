var APIeasy = require('api-easy');
var assert = require('assert');

var suite = APIeasy.describe('api');
var port = process.argv[3] ? process.argv[3].split('=')[1] : 8080;

/**
 * Тестирование процедуры авторизации для пользователя admin
 */
suite
    .use('localhost', port)
    .path('ccwe/main')
    .setHeader('Content-Type', 'application/x-www-form-urlencoded')

    .discuss('Проверяем что не авторизованы')
    .post({action: 'checkAuth'})
    .expect(200, {success: false})

    .discuss('Пробуем авторизоваться с неверным паролем')
    .post({
        action  : 'authenticate',
        login   : 'wrong_login',
        password: 'wrong_pass'
    })
    .expect(500)
    .expect('check message', function (err, res, body) {
        assert.equal(body, 'Неверный логин либо пароль');
    })

    .discuss('Проверяем что не можем получить данные пользователя')
    .post({
        action: 'invoke',
        obj   : 'profile',
        mth   : 'getInfo'
    })
    .expect(500)
    .expect('error', function (err, res, body) {
        assert.equal(body, 'Сессия не содержит информации о пользователе');
    })

    .discuss('Авторизуемся с правильными данными')
    .post({
        action  : 'authenticate',
        login   : 'admin',
        password: 123
    })
    .expect(200)
    .expect('body should be empty', function (err, res, body) {
        assert.equal(body, '');
        /**
         * Сохраняем идентификатор сессии между запросами
         */
        var cookie = res.headers['set-cookie'][0];
        suite.before('setAuth', function (outgoing) {
            outgoing.headers.Cookie = cookie;
            return outgoing;
        });
    })

    .next()

    .discuss('Проверяем что авторизовались')
    .post({action: 'checkAuth'})
    .expect(200, {success: true})

    .discuss('Выходим из приложения')
    .post({
        action: 'invoke',
        obj   : 'profile',
        mth   : 'logout'
    })
    .expect('unsetAuth', function (err, res, body) {
        assert.equal(body, '');
        suite.unbefore('setAuth');
    })

    .next()

    .discuss('Снова проверяем что не авторизованы')
    .post({action: 'checkAuth'})
    .expect(200, {success: false})

    .export(module);