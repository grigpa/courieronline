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
        { waitFor : 'CQ', args : 'userlogin' },
        {
            action: 'type',
            target: '>>userlogin textfield[name=login]',
            text: login
        },
        {
            action: 'type',
            target: '>>userlogin textfield[name=password]',
            text: password
        },
        { action: 'click', target: '>>userlogin button' },
        { waitFor : 'CQ', args : 'appHeader' },
        function (next) {
            t.ok(t.cq1('appHeader').isVisible(), 'Авторизация прошла успешно!');
            next();
        },
        { waitFor: 500 },

        {
            action: 'click',
            target: '>>appHeader button[itemId=userInfo]'
        },
        { waitFor : 'CQ', args : 'operatorInfoWin' },
        function (next) {
            t.ok(t.cq1('operatorInfoWin').isVisible(), 'Просмотр атрибутов доступен!');
            next();
        },
        { waitFor: 500 },
        {
            action: 'click',
            target: '>>operatorInfoWin button[itemId=close]'
        },
        { waitFor: 500 },
        function (next) {
            t.notOk(t.cq1('operatorInfoWin'), 'Окно просмотра аттрибутов закрыто!');
            next();
        },
        {
            action : 'click',
            target: '>>appNavigator treepanel'
        },
        { waitFor: 500 },
        function (next) {
            var menu = t.cq1('#navigator');
            t.ok(menu);
            var menuItems = menu ? menu.el.query('.x-tree-node-text').map(function (item) {
                return item.innerText;
            }) : [];
            var inspections = ('и'.toUpperCase() + 'нспекции');
            t.isDeeply(menuItems, ['Организации', inspections],
                'Оператору доступен просмотр разделов Организации, инспекции');
            next();
        },

        { action : 'click', target: 'appNavigator treepanel => .x-grid-row:nth-child(2)' },
        { waitFor: 500 },
        { action: 'click', target: '>>inspectionGrid button[itemId=add]' },
        { waitFor : 'CQ', args : 'inspectionAddWin' },
        {
            action: 'type',
            target: '>>inspectionAddWin textfield[name=email]',
            text: 'example@mail.ru'
        },
        function (next) {
            var cmb = t.cq1('inspectionAddWin combobox');
            t.click(cmb.el.query('.x-trigger-cell')[0], function () {
                t.click(cmb.getPicker().getNode(0), next);
            });
            next();
        },
        { waitFor: 500 },
        { action: 'click', target: '>>inspectionAddWin button[itemId=save]' },
        { waitFor: 500 },
        function (next) {
            t.notOk(t.cq1('inspectionAddWin'), 'Окно добавления записи закрыто!');
            next();
        },
        { waitFor: 500 },
        { action : 'doubleClick', target : 'inspectionGrid => .x-grid-cell' },
        { waitFor : 'CQ', args : 'inspectionWin' },
        { action: 'click', target: '>>inspectionWin button[itemId=close]' },
        { waitFor: 500 },
        function (next) {
            t.notOk(t.cq1('inspectionWin'), 'Окно редактирования записи закрыто!');
            next();
        },

        {
            action : 'click',
            target: 'appNavigator treepanel => .x-grid-row:nth-child(1)'
        },

/*
        { waitFor: 500 },
        {
            action: 'click',
            target: '>>organizationGrid button[itemId=add]'
        },
        { waitFor : 'CQ', args : 'organizationWin' },
        {
            action: 'type',
            target: '>>organizationWin textfield[name=email]',
            text: 'example@mail.ru'
        },
        { waitFor: 500 },
        {
            action: 'click',
            target: '>>organizationWin button[itemId=save]'
        },
        { waitFor: 500 },
        function (next) {
            t.notOk(t.cq1('organizationWin'), 'Окно добавления записи закрыто!');
            next();
        },
*/
        { waitFor: 1500 },
        { action : 'doubleClick', target : 'organizationGrid => .x-grid-cell' },
        { waitFor: 1000 },
        { waitFor : 'CQ', args : 'organizationWin' },
        {
            action: 'click',
            target: '>>organizationWin button[itemId=close]'
        },
        { waitFor: 1000 },
        function (next) {
            t.notOk(t.cq1('organizationWin'), 'Окно редактирования записи закрыто!');
            next();
        }

    );
});