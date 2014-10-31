var mongoose = require('mongoose');

var ListingSchema = new mongoose.Schema({
    title: String,
    description: String,
    likes: {type: Number, default: 0},
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
});

mongoose.model('Listing', ListingSchema);