const router = require("express").Router();
const mongoose = require("mongoose");
const ListingModel = require("../models/Listing.model");
const BusinessModel = require("../models/Business.model");
const BookingModel = require("../models/Booking.model");


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

router.post("/listing/:id", async (req, res, next) => {
    try {
        const {quantity, payment, listing, buyer} = req.body;
        console.log("this is the id from params", req.params.id);
      const covetedListing = await ListingModel.findById(req.params.id);
    //   console.log("this is the listing I want to book", covetedListing)
      const newReservation = await BookingModel.create({
          buyer,
          listing,
          quantity
      })
      console.log(newReservation)
      res.status(200).json(newReservation)
    }
    catch (e) {
        next(e)
    }
})

router.get("/account/bookings", (req, res, next) => {
    res.send('foo');
})

router.get("/account/bookings/:id", async(req, res, next) => {
    const foundBooking = await BookingModel.findById(req.params.id).populate("listing");
    console.log("this is the found booking", foundBooking);
    res.status(200).json(foundBooking);
})

module.exports = router;

