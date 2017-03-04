const assert = require('assert');
const path = require('path');
const fs = require('fs');

const originalImplementations = {
    keys: Object.keys,
    defineProperty: Object.defineProperty,
    defineProperties: Object.defineProperties,
    prototype_hasOwnProperty: Object.prototype.hasOwnProperty
};

const callAndRestore = call => {
    var value;
    var exception;

    try {
        value = call();
    } catch (e) {
        exception = e;
    }

    Object.keys = originalImplementations.keys;
    Object.defineProperty = originalImplementations.defineProperty;
    Object.defineProperties = originalImplementations.defineProperties;
    Object.prototype.hasOwnProperty = originalImplementations.prototype_hasOwnProperty;

    if (exception) {
        throw exception;
    }

    return value;
};

function runSuite(startPath) {
    fs.readdirSync(path.join(__dirname, startPath)).forEach(name => {
        if (fs.statSync(path.join(__dirname, startPath, name)).isDirectory()) {
            suite(name, function () {
                runSuite(path.join(startPath, name));
            });
        } else {
            test(name, () => {
                const testCase = require(path.join(__dirname, startPath, name));
                assert[testCase.assertion](callAndRestore(testCase.actual), testCase.expected);
            });
        }
    });
}

runSuite(process.env.TEST_MODULES_ROOT);

