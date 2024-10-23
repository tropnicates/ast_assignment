const Rule = require('../models/AbtRules');
const { evaluateRule } = require('../utils/astEvaluator');
const { combineStoredRules } = require('../utils/combineRules');
const { createAST } = require('../utils/parseRule');
const validateRuleString = require('../utils/validateRule');

const createRule = async(req,res) => {
    const { rule } = req.body;
    if (!rule) {
        return res.status(400).json({ error: "Rule string is required" });
    }
    
    const validationResult = validateRuleString(rule);
    
    if (validationResult.isValid){
        try{
            const ast = createAST(rule);
            const newRule = new Rule({rule, ast});
            await newRule.save();
            res.status(202).json({
                message: 'Rule created succesfully',
                ast: ast
            });
        }catch(err){
            res.status(500).json({error: err.message});
        }
    } else {
        return res.status(400).json({ error: validationResult.message });
    }
}; 

const rulesList = async(req,res) => {
    try {
        const rules = await Rule.find();
        res.json({ rules });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch rules' });
    }
};

const updatingExistingRule = async(req,res)=>{
    const { id } = req.params;
    const { rule } = req.body;

    // Validating new rule string before updating
    const validation = validateRuleString(rule);
    if (!validation.isValid) {
        return res.status(400).json({ error: validation.message });
    }

    try {
        const rules = await Rule.find();

        if (rules.length === 0) {
            return res.status(404).json({ message: 'No rules found. Please create a new rule.' });
        }

        const ast = createAST(rule); 

        // Update the rule in the database after checking if there is atleast one rule in database
        const updatedRule = await Rule.findByIdAndUpdate(id, { rule, ast }, { new: true });

        if (!updatedRule) {
            return res.status(404).json({ error: 'Rule not found' });
        }

        res.json({ message: 'Rule updated successfully', updatedRule });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update the rule' });
    }
};

// for testing the combined rules function 
// const testCombine = async(req,res) => {
//     try {
//         const combinedAST = await combineStoredRules();
//         if (!combinedAST) {
//             return res.status(404).json({ message: 'No rules found.' });
//         }
//         return res.status(200).json({ combinedAST });
//     } catch (error) {
//         console.error('Error combining rules:', error);
//         return res.status(500).json({ error: error.message });
//     }
// };

const evaluateUserEligibility = async(req,res) => {
    const {data, rule} = req.body;

    try{
        let ast;
        if(rule){
            const validation = validateRuleString(rule);
            if (!validation.isValid) {
                // return an error response if the rule validation fails
                return res.status(400).json({ error: validation.message });
            }
            // rule is provided by the user then use that only
            ast = createAST(rule);
        }
        else{
            // when no rule is provided, fetch and combine already created rules form database 
            const combinedAST = await combineStoredRules();
            if (!combinedAST) {
                return res.status(404).json({ error: 'No combined rules available.' });
            }
            ast = combinedAST;
        }
        const eligibility = evaluateRule(ast,data);
        res.status(200).json({eligibility});
    }catch(err){
        console.log('Error evaluating rule: ', err);
        res.status(500).json({error: err.message});
    }
}

module.exports = {createRule, rulesList, updatingExistingRule, evaluateUserEligibility};