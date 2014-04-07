module.exports = function(context) {
    return {
        AssignmentExpression: function(node) {
            if (node.operator === '=' &&
                node.left.type === 'MemberExpression' &&
                node.left.object.type === 'Identifier' &&
                node.left.property.name=== 'prototype' &&
                node.right.type !== 'NewExpression') {
                context.report(node, 'Expecting prototype to be a new-upped object');
            }
        }            
    };
};
