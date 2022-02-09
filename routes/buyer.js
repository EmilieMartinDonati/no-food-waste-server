const router = require("express").Router();
const mongoose = require("mongoose");
const ListingModel = require("../models/Listing.model");
const BusinessModel = require("../models/Business.model");
const BookingModel = require("../models/Booking.model");
const userModel = require("../models/User.model");
const categoryModel = require("../models/Category.model");
const isAuthenticated = require("./../middlewares/jwt.middleware");
const UserModel = require("../models/User.model");

router.get("/discover", async (req, res, next) => {
  try {
    // const businesses = await BusinessModel.find().populate("listings");
    // console.log("those are the businesses", businesses);

    const listings = await ListingModel.find({ availableQuantity: { $gt: 0 } }).populate("owner");
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
    const listings = await ListingModel.find({ availableQuantity: { $gt: 0 } }).populate("owner");
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
    console.log("this is the available quantity", chosenCategory);
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
    // console.log(
    //   "this is the relevant listing retrieved from the db I hope :-) ",
    //   foundListing
    // );
    res.status(200).json(foundListing);
  } catch (e) {
    next(e);
  }
});

router.post("/listing/:id", isAuthenticated, async (req, res, next) => {
  try {
    const currentUserId = req.payload._id;
    // console.log("this is the req.payload in the listing post", req.payload._id);
    const { quantity, payment, listing, buyer } = req.body;
    // console.log("this is the qty type", typeof quantity);
    // console.log("this is the id from params", req.params.id);
    const foundListing = await ListingModel.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { availableQuantity: -Number(quantity) },
      },
      { new: true }
    );
     
    console.log("this is the found listing line 94", foundListing);

    // So here I need to check whether the user already has this listing.
    const myUser = await userModel.findById(currentUserId).populate(
      {
        path: "bookings",
        populate: {
          path: "listing"
        },
      }
    )
    console.log("do I get there line 97 ?", myUser.bookings[0].listing._id, foundListing._id);

    const x = myUser.bookings.find((elem) => elem.listing._id.toString() == foundListing._id.toString());
    console.log("test 108", x);

    if (x) {
      console.log("line 98, do I get there ?")

      // Trouver le bon booking.
      const updatedBooking = await BookingModel.findOneAndUpdate({ listing: foundListing._id },
        { $inc: { quantity: Number(quantity) } },
        { new: true }
      )
      console.log("this is updatedBooking line 118", updatedBooking);
      res.status(200).json(updatedBooking);
    }


    else {
      const newReservation = await BookingModel.create({
        buyer,
        listing,
        quantity,
      });

      const foundUser = await userModel.findByIdAndUpdate(
        currentUserId,
        {
          // $addToset: { bookings : newReservation}
          $push: { bookings: newReservation },
        },
        { new: true }
      );
      // console.log(
      //   "this is foundUser line 58 in the listing post with a ref in the bookings normally",
      //   foundUser
      // );
      console.log(newReservation);
      res.status(200).json(newReservation);
    }
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


// Route to cancel a booking.

router.delete("/account/bookings/delete/:bookingId/:bookingQuantity", isAuthenticated, async (req, res, next) => {
  try {
    console.log("getting there line 158")
    const { bookingId, bookingQuantity } = req.params;
    console.log("my req params", req.params, "my quantity", bookingQuantity, "the id", bookingId);
    const booking = await BookingModel.findById(bookingId).populate("listing");
    const listingId = booking.listing._id;
    console.log("this is the id of the listing that has been booked line 163", listingId);
    const listingToUpdate = await ListingModel.findByIdAndUpdate(listingId, {
      $inc: { availableQuantity: + Number(bookingQuantity) },
    },
      { new: true })
    const { deletedcount } = await BookingModel.findByIdAndRemove(bookingId);

    const currentUserId = req.payload._id;
    console.log("this is the req.payload._id", req.payload._id);
    const user = await userModel.findByIdAndUpdate(currentUserId,
      {
        $pull: { bookings: booking._id }
      },
      { new: true })


    res.status(200).json(deletedcount)
  }
  catch (e) {
    next(e)
  }
})


router.patch(
  "/account/favorites/:businessId/",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const userId = req.payload._id;
      console.log("This is userId line 133", userId);
      const { businessId } = req.params;
      console.log("This is businessId line 135", businessId);

      const user = await UserModel.findById(userId);
      console.log("this is user favorites line 138", user.favorites);

      if (user.favorites.includes(businessId)) {
        console.log("Do I even get here?");
        const updatedUser = await UserModel.findByIdAndUpdate(
          userId,
          { $pull: { favorites: businessId } },
          { new: true }
        );
        console.log("Do I even get here? 2");
        res.status(204).json(updatedUser);
      } else {
        const updatedUser = await UserModel.findByIdAndUpdate(
          userId,
          { $push: { favorites: businessId } },
          { new: true }
        );
        console.log("Or here?");
        res.status(204).json(updatedUser);
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
