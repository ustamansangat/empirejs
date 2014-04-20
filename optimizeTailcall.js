var fs = require('fs');
var esprima = require('esprima');
var escodegen = require('escodegen');

function findChildrenOfType(node, type) {
    var retPoints = [];
    if (!node) return retPoints;
    for (var prop in node) {
        if (!node.hasOwnProperty(prop)) return;
        var subNodes = node[prop];
        if (!subNodes || typeof subNodes !== 'object') continue;
        if (!(subNodes instanceof Array)) subNodes = [subNodes];
        for (var i = 0; i < subNodes.length; i += 1) {
            var subNode = subNodes[i];
            if (!subNode || typeof subNode !== 'object') continue;
            if (subNode.type === type) {
                retPoints.push(subNode);
            } else if (subNode.type !== 'FunctionDeclaration') {
                retPoints = retPoints.concat(findChildrenOfType(subNode, type));
            }
        }
    }
    return retPoints;
}


function find(node) {
    var retPoints = [];
    if (!node) return retPoints;
    if (node.type === 'FunctionDeclaration') {
        var returnPoints = findChildrenOfType(node.body, 'ReturnStatement');
        if (returnPoints.length > 0) {
            retPoints.push({
                node: node,
                returnPoints: returnPoints
            });
        }
    }
    //let's assume that the recursive function is visible throughout
    for (var prop in node) {
        if (!node.hasOwnProperty(prop)) return;
        var subNodes = node[prop];
        if (!subNodes || typeof subNodes !== 'object') continue;
        if (!(subNodes instanceof Array)) subNodes = [subNodes];
        for (var i = 0; i < subNodes.length; i += 1) {
            var subNode = subNodes[i];
            if (!subNode || typeof subNode !== 'object') continue;
            retPoints = retPoints.concat(find(subNode));
        }
    }
    for (var j = 0; j < retPoints.length; j += 1) {
        retPoints[j].callPoints = []
        for (var k = 0; k < retPoints[j].returnPoints.length; k += 1) {
            retPoints[j].callPoints = retPoints[j].callPoints.concat(findChildrenOfType(retPoints[j].returnPoints[k], 'CallExpression'));
        }
    }
    return retPoints;
}

var args = process.argv.slice(2);
var file = args[0];

console.log('Fixing ' + file);
var fileContent = fs.readFileSync(file, 'utf8');
var ast = esprima.parse(fileContent);
var res = find(ast);

//Assume no name collision for TailCall and thrower
if (res.length === 2) {
    var tailCallClassDeclaration = esprima.parse("function TailCall(args) { this.args = args;}");
    var thrower = esprima.parse("function thrower() { throw new TailCall(arguments); }");
    var looper = esprima.parse("function looper() {" +
        "  var args = arguments;" +
        "  while (args) {" +
        "    try { return " + res[1].node.id.name + ".apply(null, args); }" +
        "    catch (e) { " +
        "      if (e.constructor === TailCall) { args = e.args;}" +
        "    }" +
        "  }" +
        "}");
    //assume res[1] is a direct child or res[0]
    res[0].node.body.body.splice(0, 0, tailCallClassDeclaration, thrower);
    res[0].node.body.body.splice(res[0].node.body.body.length - 1, 0, looper);
    for (var i = 0; i < res[1].callPoints.length; i += 1) {
        if (res[1].callPoints[i].callee.name === res[1].node.id.name) res[1].callPoints[i].callee.name = 'thrower';
    }
    for (i = 0; i < res[0].callPoints.length; i += 1) {
        if (res[0].callPoints[i].callee.name === res[1].node.id.name) res[0].callPoints[i].callee.name = 'looper';
    }
}
console.log(JSON.stringify(res, ' ', ' '));
fileContent = escodegen.generate(ast);
fs.writeFileSync(file, fileContent);
