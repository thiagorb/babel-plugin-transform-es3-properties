module.exports = {
    actual: () => () => (null).property,
    expected: TypeError,
    assertion: 'throws'
};