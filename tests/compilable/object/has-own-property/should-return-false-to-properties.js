module.exports = {
    actual: () => {
        var obj = {
            'field 1': 'field 1 value'
        };

        Object.defineProperty(obj, 'property', {
            'value': 'property value'
        });

        return Object.hasOwnProperty(obj, 'property');
    },
    expected: false,
    assertion: 'equal'
};