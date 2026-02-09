new StartTest(function (t) {
    var login = 'NWUDC.12345667788990';
    var password = 'NWUDC.12345667788990';

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
        { waitFor : 'CQ', args : 'userlogin' },
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
        { waitFor: 1000 },
        { waitFor: 'CQ', args: 'appMain' },
        function (next) {
            var menu = t.cq1('#navigator');
            t.ok(menu);
            var menuItems = menu ? menu.el.query('.x-tree-node-text').map(function (item) {
                return item.innerText;
            }) : [];

            t.isDeeply(menuItems, ['Входящие', 'Отправленные', 'Черновики'],
                'Клиенту доступен просмотр разделов Входящие, Отправленные, Черновики'
            );
            next();
        },
        { waitFor: 1000 },
        function (next) {
            var grid = t.cq1('appWorkspace documents');

            t.ok(grid);
            t.ok(grid.el); // проверяем что таблица документов отобразилась

            var rows = grid && grid.el ? grid.el.query('.x-grid-cell-first div').map(function (item) {
                return item.innerText;
            }) : [];
            t.diag(rows.length);
            next();
        }
    );

});