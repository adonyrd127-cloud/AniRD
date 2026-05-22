const acorn = require("acorn");
const { safeEvaluate, evaluateAst } = require("./safe-eval.js");

console.log("Testing with Parentheses:");
const resultWithParens = safeEvaluate('({"foo": "bar"})');
console.log("Result for '({\"foo\": \"bar\"})':", resultWithParens);

console.log("\nTesting without Parentheses:");
const resultWithoutParens = safeEvaluate('{"foo": "bar"}');
console.log("Result for '{\"foo\": \"bar\"}':", resultWithoutParens);

console.log("\nAST structure for '({\"foo\": \"bar\"})':");
const ast = acorn.parse('({"foo": "bar"})', { ecmaVersion: 2020 });
console.log(JSON.stringify(ast, null, 2));
