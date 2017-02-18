const assert = require('assert');
const path = require('path');

const originalImplementations = {
    keys: Object.keys,
    defineProperty: Object.defineProperty,
    defineProperties: Object.defineProperties,
    prototype_hasOwnProperty: Object.prototype.hasOwnProperty
};

const restoreOriginalImplementations = () => {
    Object.keys = originalImplementations.keys;
    Object.defineProperty = originalImplementations.defineProperty;
    Object.defineProperties = originalImplementations.defineProperties;
    Object.prototype.hasOwnProperty = originalImplementations.prototype_hasOwnProperty;
};

function describeClassTests (className, methods) {
    suite(className, () => {
        Object.keys(methods).forEach(method => {
            suite(method, () => {
                methods[method].forEach(testDescription => {
                    test(testDescription, () => {
                        try {
                            const testCase = require('./' + path.join(process.env.TEST_MODULES_ROOT, className, method, testDescription));
                            var actual = testCase.actual();
                            restoreOriginalImplementations();
                            assert[testCase.assertion](actual, testCase.expected);
                        } catch (e) {
                            restoreOriginalImplementations();
                            throw e;
                        }
                    });
                });
            });

        });
    });
}

/*
describeClassTests('object', {
    keys: [
        'should-not-return-properties'
    ]
});
*/

const fs = require('fs');

function runSuite(path) {
    fs.readdirSync('./tests/' + path).forEach(name => {
        if (fs.statSync('./tests/' + path + '/' + name).isDirectory()) {
            suite(name, function () {
                runSuite(path + '/' + name);
            });
        } else {
            test(name, () => {
                try {
                    const testCase = require('./' + path + '/' + name);
                    var actual = testCase.actual();
                    restoreOriginalImplementations();
                    assert[testCase.assertion](actual, testCase.expected);
                } catch (e) {
                    restoreOriginalImplementations();
                    throw e;
                }
            });
        }
    });
}

runSuite(process.env.TEST_MODULES_ROOT);

