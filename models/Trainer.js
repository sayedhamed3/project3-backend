const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
    specialization: {
        type: String,
        required: true,
        enum: [  
            'strength_training',  
            'weight_loss',  
            'bodybuilding',  
            'hiit',  
            'yoga',  
            'swimming',  
            'senior_fitness',  
            'sports_performance',  
            'dance_fitness',  ,
            "boxing",
            "crossfit",
            "mma",
            "pilates",

          ]
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