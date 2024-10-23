const { Node } = require('../utils/astEvaluator');

const createAST = (ruleString) => {
    const operators = {
        'AND': 2,
        'OR': 1,
    };
    
    const toPostfix = (tokens) => {
        const outputQueue = [];
        const operatorStack = [];
        
        tokens.forEach((token) => {
            if (token === '(') {
                operatorStack.push(token);
            } else if (token === ')') {
                while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.pop(); // Remove the '('
            } else if (operators[token]) {
                while (
                    operatorStack.length > 0 &&
                    operators[operatorStack[operatorStack.length - 1]] >= operators[token]
                ) {
                    outputQueue.push(operatorStack.pop());
                }
                operatorStack.push(token);
            } else {
                outputQueue.push(token);
            }
        });

        // Pop all the remaining operators in the stack
        while (operatorStack.length > 0) {
            outputQueue.push(operatorStack.pop());
        }
        
        return outputQueue;
    };
    
    const buildAST = (postfixTokens) => {
        const stack = [];
    
        postfixTokens.forEach((token) => {
            if (operators[token]) { // If it's an operator
                const rightNode = stack.pop();
                const leftNode = stack.pop();
                stack.push(new Node('operator', leftNode, rightNode, token));
            } else {
                // Here, we need to parse the condition token to differentiate between attribute and value
                const conditionParts = token.split(/\s*[\>\<\=]\s*/);
                const operator = token.match(/[\>\<\=]/)[0]; // Match operator like >, <, or =
                stack.push(new Node('condition', null, null, {
                    attribute: conditionParts[0].trim(),
                    operator: operator,
                    value: conditionParts[1].trim()
                }));
            }
        });
    
        return stack.pop();
    };    
    
    // Tokenize the rule string
    const tokens = ruleString.match(/\(|\)|AND|OR|[^\s()]+(\s*[\>\<\=]\s*[^\s()]+)/g);
    const postfixTokens = toPostfix(tokens);
    const astRoot = buildAST(postfixTokens);
    
    return astRoot;
};

module.exports = { createAST };