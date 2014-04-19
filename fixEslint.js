var fs = require('fs');
var esprima = require('esprima');
var escodegen= require('escodegen');

function fix(astNode) {
  if(astNode.type === 'Literal') {
    if(astNode.raw && astNode.raw[0] === '"') {
      astNode.raw[0] = '\'';
      astNode.raw[astNode.raw.length-1] = '\'';
    }
    return;
  }
  if(astNode.type === 'FunctionDeclaration' || astNode.type === 'FunctionExpression') {
    if(!astNode.body.body.length  ||
        astNode.body.body[0].type !== 'ExpressionStatement' ||
        astNode.body.body[0].expression.type !== 'Literal' ||
        astNode.body.body[0].expression.value !== 'use strict'
    ) {
      astNode.body.body.splice(0, 0, {
        type: 'ExpressionStatement',
        expression: {
          type: 'Literal',
          value: 'use strict'
        }
      });
    }
    return;
  }
  for(var prop in astNode){
    var child = astNode[prop];
    if(child && typeof child === 'object') {
      fix(child);
    }
  } 
}

var args = process.argv.slice(2);
var file = args[0]; 
 
console.log('Fixing ' + file);
var fileContent = fs.readFileSync(file, 'utf8');
var ast = esprima.parse(fileContent);
fix(ast);
fileContent = escodegen.generate(ast);
fs.writeFileSync(file, fileContent);
