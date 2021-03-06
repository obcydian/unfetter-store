const mongoose = require('mongoose');
const stixCommons = require('./stix-commons');

const AttackPatternSchema = {
    id: String,
    created_by_ref: {
        type: String,
        required: [true, 'created_by_ref is required']
    },
    name: {
        type: String,
        required: [true, 'name is required'],
        index: true
    },
    description: {
        type: String
    },
    kill_chain_phases: [stixCommons.kill_chain_phases],
    x_unfetter_sophistication_level: {
        type: Number
    },
    type: {
        type: String,
        enum: ['attack-pattern'],
        default: 'attack-pattern'
    }
};

const AttackPattern = mongoose.model('AttackPattern', stixCommons.makeSchema(AttackPatternSchema), 'stix');

module.exports = AttackPattern;
