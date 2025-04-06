const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    specialization: {
        type: String,
        required: true,
        enum: ['Strength Training', 'Cardio', 'Yoga', 'Pilates', 'CrossFit', 'Other'], // Change Specialization later
    },
    certifications: [
        {
            type: String,
        },
    ],
    experience: {
        type: Number, // years of experience
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
});

const Trainer = mongoose.model('Trainer', trainerSchema);

module.exports = Trainer;