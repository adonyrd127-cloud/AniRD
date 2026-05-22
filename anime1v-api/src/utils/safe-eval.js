const acorn = require("acorn");

function evaluateAst(node, depth = 0) {
  if (!node) return null;
  if (depth > 50) return null; // Prevent max call stack size exceeded (Event loop blocking)

  switch (node.type) {
    case "Program":
      return node.body.length > 0 ? evaluateAst(node.body[0], depth + 1) : null;
    case "ExpressionStatement":
      return evaluateAst(node.expression, depth + 1);
    case "Literal":
      return node.value;
    case "Identifier":
      if (node.name === "undefined") return undefined;
      if (node.name === "NaN") return NaN;
      if (node.name === "Infinity") return Infinity;
      return null;
    case "ArrayExpression":
      return node.elements.map(el => evaluateAst(el, depth + 1));
    case "ObjectExpression": {
      const obj = Object.create(null); // Prevent prototype pollution at the root
      for (const prop of node.properties) {
        if (prop.type === "Property") {
          let key;
          if (prop.key.type === "Identifier") {
            key = prop.key.name;
          } else if (prop.key.type === "Literal") {
            key = prop.key.value;
          } else {
            key = evaluateAst(prop.key, depth + 1);
          }

          if (key === "__proto__" || key === "constructor" || key === "prototype") {
            continue; // explicit prototype pollution prevention
          }
          obj[key] = evaluateAst(prop.value, depth + 1);
        }
      }
      return obj;
    }
    case "UnaryExpression": {
      const arg = evaluateAst(node.argument, depth + 1);
      if (node.operator === "-") return -arg;
      if (node.operator === "+") return +arg;
      if (node.operator === "!") return !arg;
      if (node.operator === "void") return undefined;
      return null;
    }
    default:
      return null;
  }
}

function safeEvaluate(expression) {
  try {
    const ast = acorn.parse(expression, { ecmaVersion: 2020 });
    return evaluateAst(ast);
  } catch (_error) {
    return null;
  }
}

module.exports = { safeEvaluate, evaluateAst };
