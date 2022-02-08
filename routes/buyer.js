const router = require("express").Router();
const mongoose = require("mongoose");
const ListingModel = require("../models/Listing.model");
const BusinessModel = require("../models/Business.model");
const BookingModel = require("../models/Booking.model");
const userModel = require("../models/User.model");
const isAuthenticated = require("./../middlewares/jwt.middleware");


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

router.post("/listing/:id", isAuthenticated, async (req, res, next) => {
    try {
        const currentUserId = req.payload._id;
        console.log("this is the req.payload in the listing post", req.payload._id);
        const { quantity, payment, listing, buyer } = req.body;
        console.log("this is the id from params", req.params.id);
        const covetedListing = await ListingModel.findById(req.params.id);
        const newReservation = await BookingModel.create({
            buyer,
            listing,
            quantity
        })
        const foundUser = await userModel.findByIdAndUpdate(currentUserId, {
             $push: { bookings: newReservation } },
      { new: true });
        console.log("this is foundUser line 58 in the listing post with a ref in the bookings normally", foundUser);
        console.log(newReservation);
        res.status(200).json(newReservation)
    }
    catch (e) {
        next(e)
    }
})


router.get("/account", isAuthenticated, async (req, res, next) => {
    try {
        const currentUserId = req.payload._id;
        console.log("this is the req.payload._id", req.payload._id);
        const foundUser = await userModel.findOne({ _id: currentUserId }).populate({
            path: "bookings",
            populate: {
                path: "listing buyer"
            },
            // populate: {
            //     path: "buyer"
            // }
        }
        );
        console.log(foundUser);
        res.status(200).json(foundUser);
    }
    catch (e) {
        next(e)
    }
})

// router.get("/account/bookings", isAuthenticated, async (req, res, next) => {
//     try {
//         const user = req.payload._id;
//         console.log("this is the user from the middleware", user);
//         const userBookings = await bookingModel.find({ buyer: user });
//         console.log(userBookings);
//         res.status(200).json(userBookings);
//     }
//     catch (e) {
//         next(e)
//     }
// })

router.get("/account/bookings/:id", isAuthenticated, async (req, res, next) => {
    try {
        const listings = await ListingModel.find().populate("owner");
        const foundBooking = await BookingModel.findById(req.params.id).populate({
            path: "listing",
            populate: {
                path: "owner"
            }
        }
        );
        console.log("this is the found booking", foundBooking);
        res.status(200).json(foundBooking);
    }
    catch (e) {
        next(e)
    }
})

module.exports = router;

