var mongoose = require('mongoose');

var QuestionSchema = new mongoose.Schema({
    body: String,
    customer: String,
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }
});

mongoose.model('Question', QuestionSchema);