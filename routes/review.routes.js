var express = require('express');
var router = express.Router();
const reviewModel = require("../models/Review.model")
const isAuthenticated = require("../middlewares/jwt.middleware");
const BusinessModel = require("../models/Business.model");
const ReviewModel = require('../models/Review.model');

router.post("/review/create", isAuthenticated, async (req, res, next) => {
    try {
        console.log("do I get there");
        const { content, favoriteId } = req.body;
        console.log(content);
        //Create review.
        console.log("two req line 8 for create review", req.body, req.payload._id);
        const insertedReview = await reviewModel.create({
            content,
            writer: req.payload._id
        })

       const foundBusiness = await BusinessModel.findByIdAndUpdate(favoriteId, 
        {$push: {reviews: insertedReview._id}}, 
        {new: true}).populate({
            path: "reviews",
            populate : {path: "writer"}
        })
        res.status(200).json(foundBusiness);
    }
    catch (e) {
        next(e)
    }
})

module.exports = router;

// Delete comment

router.delete("/review/delete/:reviewid", async (req, res, next) => {
    try {
    const {reviewid} = req.params;
    console.log("this is foreviewid", reviewid);
    const foundReview = await ReviewModel.findById(reviewid);
    // const foundBusiness = await BusinessModel.findOne({ 
    //     reviews: { 
    //        $elemMatch: { id: "620542d5c930d6357d25d457"} 
    //     }
    //  }); 
     console.log("this is the business for the delete", foundBusiness);
     res.status(200).json(foundReview);
    }
    
    catch (e) {
        next(e)
    }
})

// Update comment

router.patch("review/update", async (req, res, next) => {
    res.json("foo")
})