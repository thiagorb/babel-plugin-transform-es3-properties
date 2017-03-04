module.exports = {
    actual: () => {
        var obj = {};
        var propertyValue = 12;

        Object.defineProperty(obj, 'property', {
            get: () => propertyValue,
            set: v => propertyValue = v
        });

        obj.property++;

        return obj.property;
    },
    expected: 13,
    assertion: 'equal'
};