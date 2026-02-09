var route = function (req, res, next) {
    var url = req.url.toLowerCase();
    if (url === '/ccwe/main?action=invoke&obj=navigator&mth=getItems&node=root'.toLowerCase()) {
        req.url = '/data/navigator.json';
    }
    if (req.body.action === 'checkAuth') {
        res.statusCode = 200;
        if (req.session.login) {
            res.end('{"success": true}');
        } else {
            res.end('{"success": false}');
        }
        return;
    }
    if (req.url === '/ccwe/main?mth=addInspection') {
        res.end('{"success": true}');
        return;
    }
    if (req.body.action === 'authenticate') {
        if (req.body.login === 'admin' || req.body.login === 'nwudc' || req.body.login === 'NWUDC.12345667788990') {
            res.statusCode = 200;
            req.session.login = req.body.login;
            res.end('');
        } else {
            res.statusCode = 500;
            res.end('Неверный логин либо пароль');
        }
        return;
    }
    if (url === '/ccwe/data/navigatorOperator.json?node=root'.toLowerCase()) {
        req.url = '/data/navigatorOperator.json';
    }
    if (url === '/ccwe/data/navigatorClient.json?node=root'.toLowerCase()) {
        req.url = '/data/navigatorClient.json';
    }
    if (req.body.mth === 'getInfo' || url === '/ccwe/main?action=invoke&obj=profile&mth=getInfo'.toLowerCase()) {
        if (!req.session.login) {
            res.statusCode = 500;
            res.end('Сессия не содержит информации о пользователе');
            return;
        }
        req.method = 'GET';

        req.url = {
            'admin': '/data/profileAdmin.json',
            'nwudc': '/data/profileOperator.json',
            'NWUDC.12345667788990': '/data/profileClient.json'
        }[req.session.login];
    }
    if (req.body.mth === 'logout' || url === '/ccwe/main?action=invoke&obj=profile&mth=logout'.toLowerCase()) {
        delete req.session.login;
        res.statusCode = 200;
        res.end('');
        return;
    }
    if (req.body.mth === 'getDocRouteList' || url === '/ccwe/main?action=invoke&obj=docRoutes&mth=getDocRouteList&folderType=inbox&page=1&itemsPerPage=10'.toLowerCase()) {
        req.method = 'GET';
        req.url = '/data/documents.json';
    }
    if (req.body.mth === 'getClients' || url === '/ccwe/main?mth=getClients&action=invoke&obj=operator&page=1&itemsPerPage=10'.toLowerCase()) {
        req.method = 'GET';
        req.url = '/data/organizations.json';
    }
    if (req.body.mth === 'getInspections' || url === '/ccwe/main?mth=getInspections&action=invoke&obj=operator&page=1&itemsPerPage=10'.toLowerCase()) {
        req.method = 'GET';
        req.url = '/data/statebodies.json';
    }
    if (req.body.mth === 'getAllTogs' || url === '/ccwe/main?action=invoke&obj=operator&mth=getAllTogs&query=&page=1&start=0&limit=25'.toLowerCase()) {
        req.method = 'GET';
        res.end('[{"id":"f25e56f8-9511-4f2a-adf7-4fb6633cec83","name":"ТОГС 77-00","systemName":"77-00"}]');
        return;
    }
    if (req.body.mth === 'getInspections' || url === '/ccwe/main?mth=getInspections&action=invoke&obj=admin&page=1&itemsPerPage=10'.toLowerCase()) {
        req.method = 'GET';
        res.statusCode = 200;
        res.end('[]');
        return;
    }
    if (req.body.mth === 'getOperators' || url === '/ccwe/main?mth=getOperators&action=invoke&obj=admin&page=1&itemsPerPage=10'.toLowerCase()) {
        req.method = 'GET';
        res.statusCode = 200;
        res.end('[]');
        return;
    }
    next();
};

var httpProxy = require('http-proxy');
httpProxy.createServer({
    pathnameOnly: true,
    router: {
        '/web': 'localhost:3000',// frontend
        '': 'localhost:8080' // backend
    }
}).listen(4000);

var connect = require('connect'),
 http = require('http'),
 fs   = require('fs'),
 app = connect()
 .use(connect.urlencoded())
 .use(connect.json())
 .use(connect.cookieParser())
 .use(connect.session({ secret: 'extjs app', key: 'sid',
         cookie: { path: '/', httpOnly: false, maxAge: null } }))
 .use(connect.query())
 .use(route)
 .use(connect.static(__dirname + '/'));

http.createServer(app).listen(process.env.PORT || 3000);
fs.writeFileSync(__dirname + '/pid.txt', process.pid, 'utf-8');
