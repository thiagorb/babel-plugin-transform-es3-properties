const t = require('babel-types');
const fs = require('fs');
const path = require('path');

function getPropExpression(memberExpression) {
    if (memberExpression.property.type === 'Identifier' && !memberExpression.computed) {
        return t.stringLiteral(memberExpression.property.name);
    }

    if (memberExpression.property.type === 'StringLiteral') {
        return t.stringLiteral(memberExpression.property.value);
    }

    return memberExpression.property;
}

module.exports = {
    visitor: {
        Program: {
            enter: function (program) {
                const runtime = fs.readFileSync(path.join(__dirname, 'runtime.js'));
                const runtimeStatement = t.expressionStatement(t.identifier(runtime));
                program.node.body.unshift(runtimeStatement);
            }
        },

        AssignmentExpression: {
            enter: function (expression) {
                if (expression.node.left.type === 'MemberExpression') {
                    expression.replaceWith(
                        t.callExpression(
                            t.identifier('callSetter'),
                            [
                                expression.node.left.object,
                                getPropExpression(expression.node.left),
                                expression.node.right
                            ]
                        )
                    );
                }
            }
        },

        UpdateExpression: {
            exit: function (expression) {
                if (expression.node.argument.type === 'CallExpression' &&
                    expression.node.argument.callee.type === 'Identifier' &&
                    expression.node.argument.callee.name === 'callGetter') {

                    var args = [
                        expression.node.argument.arguments[0],
                        expression.node.argument.arguments[1]
                    ];
                    expression.replaceWith(
                        t.callExpression(
                            t.identifier(expression.node.operator === '++' ? 'doIncrement' : 'doDecrement'),
                            args
                        )
                    );
                }
            }
        },

        MemberExpression: {
            enter: function (expression) {
                if (expression.node.property.type === 'Identifier' &&
                    expression.node.property.name === 'constructor') {
                    return;
                }

                if (expression.node.object.type === 'Identifier' &&
                    expression.node.property.type === 'Identifier' &&
                    expression.node.object.name === 'Object' &&
                    expression.node.property.name === 'defineProperty'
                ) {
                    /*
                    expression.replaceWith(
                        t.identifier('Object__defineProperty')
                    );
                    */
                    return;
                }

                if (expression.node.object.type === 'Identifier' &&
                    expression.node.property.type === 'Identifier' &&
                    expression.node.object.name === 'Object' &&
                    expression.node.property.name === 'defineProperties'
                ) {
                    /*
                    expression.replaceWith(
                        t.identifier('Object__defineProperties')
                    );
                    */
                    return;
                }

                expression.replaceWith(
                    t.callExpression(
                        t.identifier('callGetter'),
                        [
                            expression.node.object,
                            getPropExpression(expression.node)
                        ]
                    )
                );
            }
        },

        CallExpression: {
            exit: function (expression) {
                if (expression.node.callee.type === 'CallExpression' &&
                    expression.node.callee.callee.type === 'Identifier' &&
                    expression.node.callee.callee.name === 'callGetter') {
                    var args = [
                        expression.node.callee.arguments[0],
                        expression.node.callee.arguments[1],
                        t.arrayExpression(expression.node.arguments)
                    ];
                    expression.replaceWith(
                        t.callExpression(
                            t.identifier('invokeGetter'),
                            args
                        )
                    );
                }
            }
        }
    }
};
