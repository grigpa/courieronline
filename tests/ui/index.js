var Harness = Siesta.Harness.Browser;

function isEmpty(map) {
    for (var key in map) {
        if (map.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

new Role('Siesta.Test.OverridedExtJS', {
    isa: Siesta.Test.ExtJS,

    override: {
        /**
         * An alias for Ext.ComponentQuery.query
         *
         * @param {String} selector The selector to perform a component query with
         */
        cq : function (selector) {
            var result = [];
            try {
                result = this.Ext().ComponentQuery.query(selector);
            } catch (ex) {}
            return result;
        },

        /**
         * An shorthand method to get the first result of any Ext.ComponentQuery.query
         *
         * @param {String} selector The selector to perform a component query with
         */
        cq1 : function (selector) {
            return this.Ext().ComponentQuery.query(selector)[0];
        }
    }
});

Harness.configure({
    title     : 'Sencha UI Test Demo - Application Tests',

    overrideSetTimeout: false,

    testClass   : Siesta.Test.OverridedExtJS,

    viewportWidth     : 800,
    viewportHeight    : 600,
    runCore           : 'sequential',

    autoRun: true,
    viewDOM: true,

    generateJSONReport: function () {
        var allPassed       = true;
        var me              = this;

        if (isEmpty(me.testsByURL)) {
            return 0;
        }

        var report = {};

        Joose.A.each(me.flattenDescriptors(me.descriptors), function (descriptor) {
            // if at least one test is missing then something is wrong
            report[descriptor.url] = false;
            if (descriptor.isMissing) {
                allPassed = false;
                return false;
            }

            var test    = me.getTestByURL(descriptor.url);

            // ignore missing tests (could be skipped by test filtering
            if (!test) {
                return;
            }
            report[descriptor.url] = test.isPassed();
            allPassed = allPassed && test.isPassed();
        });

        return {
            status: allPassed,
            report: JSON.stringify(report)
        };
    }
});

var hostPageUrl = '/';
var path = document.location.pathname;
if (path.indexOf('ccwe') !== -1) {
    hostPageUrl = '/ccwe/';
} else if (path.indexOf('web') !== -1) {
    hostPageUrl = '/web/';
}

Harness.start(
    {
        group: '1',
        items: [
            {
                title: 'Test Authorization',
                hostPageUrl: hostPageUrl,
                url: 'suits/testAuthenticate.js'
            },
            {
                title: 'Test Operator Interface',
                hostPageUrl: hostPageUrl,
                url: 'suits/testOperator.js'
            },
            {
                title: 'Test Client Interface',
                hostPageUrl: hostPageUrl,
                url: 'suits/testClient.js'
            }
        ]
    }

);