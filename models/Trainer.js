const mongoose = require('mongoose');

const trainerSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    expYears: {
        type: Number,
        required: true
    },

    phone: {
        type: Number,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    imgUrl : [],
    currentAppointments:[],
    type: {
        type: String,
        enum: ['Personal', 'Group', 'CrossFit', 'Physical therapy', 'Bodybuilding', 'Athleticism']
        },
    description: {
        type: String,
        required: true
    },
    }, {
        timestamps: true
    }
)
const Trainer = mongoose.model('Trainer', trainerSchema); // Use singular 'Trainer'

module.exports = Trainer;
