const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title for the review'],
        maxLength: 100
    },
    text: {
        type: String,
        required: [true, 'Please add some text']
    },
    rating: {
        type: String,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating between 1 to 10']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});


// Prevent user from submitting more than 1 review
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Static method to get avg Rating of Reviews
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: obj[0].averageRating
        })
    } catch (error) {
        console.error(error);
    }
}

// Calc Average Rating after save
ReviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.bootcamp);
})

// Calc Average Rating before remove
ReviewSchema.pre('remove', function () {
    this.constructor.getAverageRating(this.bootcamp);
})

module.exports = mongoose.model('Review', ReviewSchema);