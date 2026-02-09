module.exports.saveAuth = function (suite) {
    return function (err, res) {
        var cookie = res.headers['set-cookie'][0];
        suite.before('setAuth', function (outgoing) {
            outgoing.headers.Cookie = cookie;
            return outgoing;
        });
    };
};