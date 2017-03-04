module.exports = {
    actual: () => () => (undefined).property,
    expected: TypeError,
    assertion: 'throws'
};