module.exports = {
    actual: () => {
        var obj = {
            'field 1': 'field 1 value',
            'field 2': 'field 2 value'
        };

        Object.defineProperty(obj, 'property', {
            'value': 'property value'
        });

        return Object.keys(obj);
    },
    expected: ['field 1', 'field 2'],
    assertion: 'deepEqual'
};