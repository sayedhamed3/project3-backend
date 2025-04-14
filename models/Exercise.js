const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        maxlength: 300,
    },
    muscleGroup: {
        type: String,
        required: true,
    },
    bodyPart: {
        type: String,
        enum: ['lower_body', 'upper_body', 'core', 'full_body'],
        required: true,
    },
    equipment: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise;