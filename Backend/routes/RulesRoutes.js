const express = require('express');
const router = express.Router();
const {createRule, rulesList, updatingExistingRule, evaluateUserEligibility} = require('../controllers/RuleController');

router.post('/create-rule',createRule);
router.post('/evaluate-rule', evaluateUserEligibility);
router.put('/update-rule/:id', updatingExistingRule);
router.get('/rule-list', rulesList);
// router.get('/combine-rules', testCombine);    // for testing 

module.exports = router;