new StartTest(function (t) {
    var login = 'nwudc';
    var password = 'nwudc';

    t.chain(
        function (next) {
            var path = document.location.pathname;
            if (path.indexOf('ccwe') !== -1) {
                document.location = '/ccwe/tests/ui/clearCookie.html#/ccwe/';
            } else if (path.indexOf('web') !== -1) {
                document.location = '/ccwe/tests/ui/clearCookie.html#/web/';
            } else {
                document.location = '/tests/ui/clearCookie.html#/';
            }
            next();
        },
        { waitFor: 1000 },
        { waitFor: 'CQ', args: 'userlogin' },
        function (next) {
            var login = t.cq1('userlogin textfield[name=login]');
            var pass = t.cq1('userlogin textfield[name=password]');

            t.is(login && login.getValue(), '', 'Поле логин пусто');
            t.is(pass && pass.getValue(), '', 'Поле пароля пусто');
            next();
        },
        {
            action: 'type',
            target: '>>userlogin textfield[name=login]',
            text  : 'bond'
        },
        {
            action: 'type',
            target: '>>userlogin textfield[name=password]',
            text  : 'james'
        },
        {
            action: 'click',
            target: function () {
                return t.cq1('userlogin button');
            }
        },
        { waitFor: 1000 },
        function (next) {
            var mainScreen = t.cq1('appMain');
            t.notOk(mainScreen);

            var msg = t.cq1('statusbar');
            t.is(msg.getText(), 'Неверный логин либо пароль');
            next();
        },
        function (next) {
            var login = t.cq1('userlogin textfield[name=login]');
            var pass = t.cq1('userlogin textfield[name=password]');

            t.is(login && login.getValue(), '', 'Поле логин очищено');
            t.is(pass && pass.getValue(), '', 'Поле пароля очищено');
            next();
        },
        {
            action: 'type',
            target: '>>userlogin textfield[name=login]',
            text  : login
        },
        {
            action: 'type',
            target: '>>userlogin textfield[name=password]',
            text  : password
        },
        {
            action: 'click',
            target: '>>userlogin button'
        },
        {
            waitFor: 1000
        },
        function (next) {
            var msg = t.cq1('statusbar');
            t.is(msg.getText(), 'Авторизация...');

            var mainScreen = t.cq1('appMain');
            t.ok(mainScreen);
            next();
        }
    );

});