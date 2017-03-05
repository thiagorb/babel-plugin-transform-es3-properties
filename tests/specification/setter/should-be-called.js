module.exports = {
    actual: () => {
        var obj = {};
        var propertyValue = 12;
        var wasCalled = false;

        Object.defineProperty(obj, 'property', {
            get: () => propertyValue,
            set: v => {
                wasCalled = true;
                propertyValue = v;
            }
        });

        var valueBefore = obj.property;
        obj.property = 21;
        var valueAfter = obj.property;

        return {
            wasCalled: wasCalled,
            valueBefore: valueBefore,
            valueAfter: valueAfter
        };
    },
    expected: {
        wasCalled: true,
        valueBefore: 12,
        valueAfter: 21
    },
    assertion: 'deepEqual'
};