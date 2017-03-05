module.exports = {
    actual: () => {
        var obj = {};
        var wasCalled = false;

        Object.defineProperty(obj, 'property', {
            get: () => {
                wasCalled = true;
                return 'value';
            }
        });

        var returnValue = obj.property;

        return {
            wasCalled: wasCalled,
            returnValue: returnValue
        };
    },
    expected: {
        wasCalled: true,
        returnValue: 'value'
    },
    assertion: 'deepEqual'
};