const mongoose = require('mongoose');
const stixCommons = require('./stix-commons');

const StixSchema = {
    id: String,
    created_by_ref: String,
    name: {
        type: String,
        required: [true, 'name is required'],
        index: true
    },
    description: {
        type: String
    },
    identity_class: {
        type: String,
        required: [true, 'identity class is required']
    },
    sectors: [String],
    contact_information: String,
    type: {
        type: String,
        enum: ['identity'],
        default: 'identity'
    }
};

const Identity = mongoose.model('Identity', stixCommons.makeSchema(StixSchema), 'stix');

module.exports = Identity;
