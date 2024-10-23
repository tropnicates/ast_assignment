const mongoose = require("mongoose");

const RuleSchema = new mongoose.Schema({
    rule: {type: String, required: true},
    ast: {type: Object, required: true},
});

module.exports = mongoose.model('Rule',RuleSchema);