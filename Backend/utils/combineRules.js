const { Node } = require('../utils/astEvaluator');
const { createAST } = require('../utils/parseRule');
const Rule = require('../models/AbtRules');

const fetchRulesFromDatabase = async()=>{
    try{
        if (!Rule) {
            throw new Error('Rule model is undefined');
        }
        const rules = await Rule.find({});
        return rules.map((fetchedRule) => fetchedRule.rule);
    }catch (error) {
        console.error('Error fetching rules from database:', error);
        return [];
    }
};

const getMostFrequentOperator = (rules) => {
    const operatorFrequency = { AND: 0, OR: 0 };
    rules.forEach((rule) => {
        if (rule.includes('AND')) operatorFrequency.AND++;
        if (rule.includes('OR')) operatorFrequency.OR++;
    });
    return operatorFrequency.AND >= operatorFrequency.OR ? 'AND' : 'OR';
};

const extractConditions = (node, conditionSet) => {
    if (node.type === 'condition') {
        conditionSet.add(JSON.stringify(node.value)); // Store unique condition
    } else if (node.type === 'operator') {
        extractConditions(node.left, conditionSet);
        extractConditions(node.right, conditionSet);
    }
};

const combine_rules_with_optimization = (rules) => {
    const conditionSet = new Set(); // To track unique conditions
    const asts = rules.map(rule => {
        const ast = createAST(rule);
        extractConditions(ast, conditionSet);
        return ast;
    });

    // Use the most frequent operator heuristic to decide the root operator
    const rootOperator = getMostFrequentOperator(rules);
    const combinedRoot = new Node('operator', null, null, rootOperator);

    let currentNode = combinedRoot;
    asts.forEach((ast, index) => {
        if (index === 0) {
            currentNode.left = ast;
        } else {
            const rightNode = new Node('operator', currentNode.right, ast, rootOperator);
            currentNode.right = rightNode;
            currentNode = rightNode;
        }
    });

    return combinedRoot;
};

const combineStoredRules = async () => {
    const ruleStrings = await fetchRulesFromDatabase();
    if (ruleStrings.length === 0) {
        console.log('No rules found in the database.');
        return null;
    }

    const combinedAST = combine_rules_with_optimization(ruleStrings);
    console.log('Combined AST:', JSON.stringify(combinedAST, null, 2));
    return combinedAST;
};

module.exports = {combineStoredRules};