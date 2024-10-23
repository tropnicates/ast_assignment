class Node {
    constructor(type, left = null, right = null, value = null) {
        this.type = type;
        this.left = left;
        this.right = right;
        this.value = value;
    }
}

const evaluateRule = (node, data) => {
    if (!node) {
        throw new Error("Invalid AST node: null node encountered");
    }

    if (node.type === 'condition') {
        const { attribute, operator, value } = node.value;

        // Ensure value is treated as a numeric value when appropriate
        const numericValue = isNaN(value) ? value.replace(/'/g, '') : Number(value);
        const dataValue = data[attribute];

        switch (operator) {
            case '>': return dataValue > numericValue;
            case '<': return dataValue < numericValue;
            case '>=': return dataValue >= numericValue;
            case '<=': return dataValue <= numericValue;
            case '=': // Handle '=' as a valid equality operator
            case '==':
                return dataValue == numericValue;
            case '!=': return dataValue != numericValue;
            default: throw new Error(`Unsupported operator: ${operator}`);
        }
    }

    if (node.type === 'operator') {
        // Initialize the result of left and right nodes as true (since AND/OR with null is problematic)
        const leftResult = node.left ? evaluateRule(node.left, data) : true;
        const rightResult = node.right ? evaluateRule(node.right, data) : true;

        if (node.value === 'AND') return leftResult && rightResult;
        if (node.value === 'OR') return leftResult || rightResult;
    }

    throw new Error(`Invalid node type: ${node.type}`);
};

module.exports = { Node, evaluateRule };