const attributeCatalog = require('./attributeCatalog');

const validateRuleString = (ruleString) => {
    try {
        // Check for unmatched parentheses
        const openingParenthesesCount = (ruleString.match(/\(/g) || []).length;
        const closingParenthesesCount = (ruleString.match(/\)/g) || []).length;
        if (openingParenthesesCount !== closingParenthesesCount) {
            throw new Error("Mismatched parentheses in rule string");
        }

        // Define allowed operators
        const allowedLogicalOperators = ["AND", "OR"];

        // Regular expression to match complete conditions like "age > 30" or "department = 'Sales'"
        const conditionRegex = /^[a-zA-Z_][a-zA-Z0-9_]*\s*(>|<|=|>=|<=)\s*('[^']*'|\d+)$/;

        // Split the rule into parts using parentheses and logical operators as delimiters
        const expressions = ruleString
            .replace(/[()]/g, "") // Remove parentheses
            .split(/\s+(AND|OR)\s+/); // Split by logical operators

        for (const expression of expressions) {
            const trimmedExpression = expression.trim();
            
            // Check if the expression is a logical operator (AND, OR)
            if (allowedLogicalOperators.includes(trimmedExpression)) {
                continue; // Valid logical operator, move to the next expression
            }
            
            // Check if the expression is a valid condition
            if (conditionRegex.test(trimmedExpression)) {
                const attribute = trimmedExpression.split(/\s+/)[0]; // Extract the attribute name
            
                // Check if the attribute exists in the catalog
                if (!attributeCatalog.includes(attribute)) {
                    throw new Error(`Invalid attribute '${attribute}' in rule string. It must be part of the attribute catalog: [${attributeCatalog.join(', ')}].`);
                }
            } else {
                // If it is not a valid condition or logical operator, throw an error
                throw new Error(`Invalid condition in rule string: '${trimmedExpression}'`);
            }
        }
        return { isValid: true, message: "Rule string is valid" };
    } catch (error) {
        return { isValid: false, message: error.message };
    }
};

module.exports = validateRuleString;