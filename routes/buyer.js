const router = require("express").Router();
const mongoose = require("mongoose");
const ListingModel = require("../models/Listing.model");
const BusinessModel = require("../models/Business.model");
const BookingModel = require("../models/Booking.model");
const userModel = require("../models/User.model");
const categoryModel = require("../models/Category.model");
const isAuthenticated = require("./../middlewares/jwt.middleware");
const UserModel = require("../models/User.model");
const jwt = require("jsonwebtoken");

router.get("/discover", async (req, res, next) => {
  try {
    // const businesses = await BusinessModel.find().populate("listings");
    // console.log("those are the businesses", businesses);

    const listings = await ListingModel.find().populate("owner");
    // console.log("those are the listings retrieved from the database and populated I hope", listings);
    res.status(200).json(listings);
  } catch (e) {
    next(e);
  }
});

router.get("/listings", async (req, res, next) => {
  try {
    console.log("hello hello helloooooÒ");
    // const businesses = await BusinessModel.find();
    // console.log(businesses);
    const categories = await categoryModel.find();
    console.log("cat line 30 back", categories);
    const listings = await ListingModel.find().populate("owner");
    // console.log("those are the listings retrieved from the database and populated I hope", listings);
    const data = {
      categories: categories,
      listings: listings,
    };
    res.status(200).json(data);
  } catch (e) {
    next(e);
  }
});

router.post("/category", async (req, res, next) => {
  try {
    console.log("req body after post category", req.body);
    const chosenCategory = await categoryModel
      .findById(req.body.search)
      .populate({
        path: "listings",
        populate: "owner",
      });
    console.log("this is the chosen category", chosenCategory);
    res.status(200).json(chosenCategory);
  } catch (e) {
    next(e);
  }
});

router.get("/listing/:id", async (req, res, next) => {
  // res.send("fooo")
  try {
    console.log("log line 36, for the individual listings");
    const businesses = await BusinessModel.find();
    console.log(req.params.id);
    console.log(businesses);
    const foundListing = await ListingModel.findById(req.params.id).populate(
      "owner"
    );
    console.log(
      "this is the relevant listing retrieved from the db I hope :-) ",
      foundListing
    );
    res.status(200).json(foundListing);
  } catch (e) {
    next(e);
  }
});

router.post("/listing/:id", isAuthenticated, async (req, res, next) => {
  try {
    const currentUserId = req.payload._id;
    console.log("this is the req.payload in the listing post", req.payload._id);
    const { quantity, payment, listing, buyer } = req.body;
    console.log("this is the qty type", typeof quantity);
    console.log("this is the id from params", req.params.id);
    const foundListing = await ListingModel.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { availableQuantity: -Number(quantity) },
      },
      { new: true }
    );
    const newReservation = await BookingModel.create({
      buyer,
      listing,
      quantity,
    });
    const foundUser = await userModel.findByIdAndUpdate(
      currentUserId,
      {
        $push: { bookings: newReservation },
      },
      { new: true }
    );
    console.log(
      "this is foundUser line 58 in the listing post with a ref in the bookings normally",
      foundUser
    );
    console.log(newReservation);
    res.status(200).json(newReservation);
  } catch (e) {
    next(e);
  }
});

router.get("/account", isAuthenticated, async (req, res, next) => {
  try {
    const currentUserId = req.payload._id;
    console.log("this is the req.payload._id", req.payload._id);
    const foundUser = await userModel.findById(currentUserId).populate({
      path: "bookings",
      populate: {
        path: "listing buyer",
      },
      // populate: {
      //     path: "buyer"
      // }
    });
    console.log(foundUser);
    res.status(200).json(foundUser);
  } catch (e) {
    next(e);
  }
});

router.get("/account/bookings/:id", isAuthenticated, async (req, res, next) => {
  try {
    const listings = await ListingModel.find().populate("owner");
    const foundBooking = await BookingModel.findById(req.params.id).populate({
      path: "listing",
      populate: {
        path: "owner",
      },
    });
    console.log("this is the found booking", foundBooking);
    res.status(200).json(foundBooking);
  } catch (e) {
    next(e);
  }
});

router.patch(
  "/account/favorites/:businessId/",
  isAuthenticated,
  async (req, res, next) => {
    try {
      // Retrieve the userId from request (thanks to APIhandler and the jwt middleware)
      const userId = req.payload._id;
      // Retrieve the business ID from params
      const { businessId } = req.params;

      // Retrieve the user from the DB thanks to its ID
      const concernedUser = await UserModel.findById(userId);

      // If the user
      if (concernedUser.favorites.includes(businessId)) {
        const updatedUser = await UserModel.findByIdAndUpdate(
          userId,
          { $pull: { favorites: businessId } },
          { new: true }
        );
        const user = updatedUser.toObject();
        delete user.password;
        const authToken = jwt.sign(user, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "2d",
        });
        res.status(200).json(authToken);
      } else {
        const updatedUser = await UserModel.findByIdAndUpdate(
          userId,
          { $push: { favorites: businessId } },
          { new: true }
        );
        const user = updatedUser.toObject();
        delete user.password;
        const authToken = jwt.sign(user, process.env.TOKEN_SECRET, {
          algorithm: "HS256",
          expiresIn: "2d",
        });
        res.status(200).json(authToken);
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
