const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
    specialization: {
        type: String,
        required: true,
        enum: [  
            'strength_training',  
            'weight_loss',  
            'bodybuilding',  
            'functional_fitness',  
            'hiit',  
            'yoga',  
            'post_rehab',  
            'senior_fitness',  
            'sports_performance',  
            'nutrition_coaching'  
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