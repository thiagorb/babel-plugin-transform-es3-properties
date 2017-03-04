module.exports = {
    actual: () => {
        var obj = {};
        var propertyValue = 12;

        Object.defineProperty(obj, 'property', {
            get: () => propertyValue,
            set: v => propertyValue = v
        });

        return obj.property++;
    },
    expected: 12,
    assertion: 'equal'
};