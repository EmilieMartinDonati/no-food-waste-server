const router = require("express").Router();
const mongoose = require("mongoose");
const ListingModel = require("../models/Listing.model");
const BusinessModel = require("../models/Business.model");


router.get("/discover", async (req, res, next) => {
    try {
        // const businesses = await BusinessModel.find().populate("listings");
        // console.log("those are the businesses", businesses);

        const listings = await ListingModel.find().populate("owner");
        console.log("those are the listings retrieved from the database and populated I hope", listings);
        res.status(200).json(listings);
    }
    catch (e) {
        next(e)
    }
})

router.get("/listings", async (req, res, next) => {
    try {
        // const businesses = await BusinessModel.find();
        // console.log(businesses);
        const listings = await ListingModel.find().populate("owner");
        console.log("those are the listings retrieved from the database and populated I hope", listings);
        res.status(200).json(listings);
    }
    catch (e) {
        next(e)
    }
})

router.get("/listing/:id", async (req, res, next) => {
    // res.send("fooo")
    try {
        console.log('log line 36, for the individual listings')
        const businesses = await BusinessModel.find();
        console.log(req.params.id);
        console.log(businesses);
        const foundListing = await ListingModel.findById(req.params.id).populate("owner");
        console.log("this is the relevant listing retrieved from the db I hope :-) ", foundListing);
        res.status(200).json(foundListing);
    }
    catch (e) {
        next(e)
    }
})


module.exports = router;

