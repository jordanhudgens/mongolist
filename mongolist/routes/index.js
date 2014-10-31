var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
    res.render('index', { title: 'MongoList' });
});

var mongoose = require('mongoose');
var Listing = mongoose.model('Listing');
var Question = mongoose.model('Question');

router.get('/listings', function(req, res, next) {
    Listing.find(function(err, listings) {
        if (err) { return next(err); }
        res.json(listings);
    });
});

router.param('listing', function(req, res, next, id) {
    var query = Listing.findById(id);

    query.exec(function (err, listing) {
        if(err) {return next(err);}
        if(!listing) {
            return next(new Error("Sorry, can't find the listing"));
        }

        req.listing = listing;
        return next();
    });
});

router.get('/listings/:listing', function(req, res, next) {
    req.listing.populate('questions', function(err, listing) {
        res.json(listing);
    });
});

router.post('/listings', function(req, res, next) {
    var listing = new Listing(req.body);
    listing.save(function(err, listing) {
        if (err) {return next(err); }
        res.json(listing);
    });
});

router.post('/listings/:listing/questions', function(req, res, next) {
    var question = new Question(req.body);
    question.listing = res.listing;

    question.save(function(err, question) {
        if(err) {return next(err);}

        req.listing.questions.push(question);
        req.listing.save(function(err, listing) {
            if (err) {return next(err); }
            res.json(question)
        });
    });
});

router.post("/listings/:listing/like", function(req, res, next) {
    var update = { $inc: { likes: 1}};
    Listing.update({_id: req.listing._id}, update).exec();
    res.json({});
});

module.exports = router;