module.exports = {
    actual: () => {
        var obj = {
            'field 1': 'field 1 value'
        };

        Object.defineProperty(obj, 'property', {
            'value': 'property value'
        });

        return obj.hasOwnProperty('field 1');
    },
    expected: true,
    assertion: 'equal'
};