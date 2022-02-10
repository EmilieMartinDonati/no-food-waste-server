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
//Stripe setup
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const uuid = require("uuid").v4;

router.get("/discover", async (req, res, next) => {
  try {
    const listings = await ListingModel.find({
      availableQuantity: { $gt: 0 },
    }).populate("owner");

    res.status(200).json(listings);
  } catch (e) {
    next(e);
  }
});

router.get("/listings", async (req, res, next) => {
  try {
    const categories = await categoryModel.find();

    const listings = await ListingModel.find({
      availableQuantity: { $gt: 0 },
    }).populate("owner");

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
    const chosenCategory = await categoryModel
      .findById(req.body.search)
      .populate({
        path: "listings",
        populate: "owner",
      });
    res.status(200).json(chosenCategory);
  } catch (e) {
    next(e);
  }
});

router.get("/listing/:id", async (req, res, next) => {
  try {
    const foundListing = await ListingModel.findById(req.params.id).populate(
      "owner"
    );
    res.status(200).json(foundListing);
  } catch (e) {
    next(e);
  }
});

router.post("/listing/:id", isAuthenticated, async (req, res, next) => {
  try {
    const currentUserId = req.payload._id;
    const { quantity, listing, buyer } = req.body;

    // Update the listing (decrement the available quantity)
    let foundListing = await ListingModel.findByIdAndUpdate(
      req.params.id,
      {
        $inc: { availableQuantity: -Number(quantity) },
      },
      { new: true }
    );

    // If the listing's available quantity is <= 0, set it as archived/inactive
    if (foundListing.availableQuantity <= 0)
      foundListing = await ListingModel.findByIdAndUpdate(
        req.params.id,
        { archived: true },
        { new: true }
      );

    // So here I need to check whether the user already has this listing.
    const myUser = await userModel.findById(currentUserId).populate({
      path: "bookings",
      populate: {
        path: "listing",
      },
    });

    // Check if we find a booking corresponding to this listing for this user
    const thisBookingAlreadyExists = myUser.bookings.find(
      (elem) => elem.listing?._id.toString() == foundListing?._id.toString()
    );

    if (thisBookingAlreadyExists) {
      // Update the booking bought quantity (instead of creating another booking)
      const updatedBooking = await BookingModel.findOneAndUpdate(
        { listing: foundListing._id },
        { $inc: { quantity: Number(quantity) } },
        { new: true }
      );
      res.status(200).json(updatedBooking);
    } else {
      // If the booking does not exist for this listing, create a booking
      const newReservation = await BookingModel.create({
        buyer,
        listing,
        quantity,
      });

      // And add it to the user's bookings array
      await userModel.findByIdAndUpdate(
        currentUserId,
        { $push: { bookings: newReservation } },
        { new: true }
      );

      res.status(200).json(newReservation);
    }
  } catch (e) {
    next(e);
  }
});

router.get("/account", isAuthenticated, async (req, res, next) => {
  try {
    const currentUserId = req.payload._id;

    const foundUser = await userModel.findById(currentUserId).populate({
      path: "bookings",
      populate: [
        { path: "buyer" },
        {
          path: "listing",
          populate: {
            path: "owner",
          },
        },
      ],
    });

    res.status(200).json(foundUser);
  } catch (e) {
    next(e);
  }
});

router.get("/account/bookings/:id", isAuthenticated, async (req, res, next) => {
  try {
    // const listings = await ListingModel.find().populate("owner");
    const foundBooking = await BookingModel.findById(req.params.id).populate({
      path: "listing",
      populate: {
        path: "owner",
      },
    });

    res.status(200).json(foundBooking);
  } catch (e) {
    next(e);
  }
});

// Route to cancel a booking.

router.delete(
  "/account/bookings/delete/:bookingId/:bookingQuantity",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { bookingId, bookingQuantity } = req.params;

      const booking = await BookingModel.findById(bookingId).populate(
        "listing"
      );

      const listingId = booking.listing._id;

      await ListingModel.findByIdAndUpdate(
        listingId,
        {
          $inc: { availableQuantity: +Number(bookingQuantity) },
        },
        { new: true }
      );

      const { deletedcount } = await BookingModel.findByIdAndRemove(bookingId);

      const currentUserId = req.payload._id;

      await userModel.findByIdAndUpdate(
        currentUserId,
        {
          $pull: { bookings: booking._id },
        },
        { new: true }
      );

      res.status(200).json(deletedcount);
    } catch (e) {
      next(e);
    }
  }
);

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

router.get("/favorites", isAuthenticated, async (req, res, next) => {
  try {
    const userId = req.payload._id;
    const foundUser = await userModel.findById(userId).populate("favorites");
    res.status(200).json(foundUser);
  } catch (e) {
    next(e);
  }
});

router.get("/my-booking/:listingId", async (req, res, next) => {
  try {
    const { listingId } = req.params;

    const booking = await BookingModel.find({ listing: listingId }).populate(
      "buyer listing"
    );

    console.log("This is the found booking >>> line 300", booking);

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
});

// Payment route
router.post("/payment", (req, res, next) => {
  const {
    body: { token, listing },
  } = req.body;

  const idempotencyKey = uuid();

  stripe.customers
    .create({
      email: token?.email,
      source: "tok_us",
      // customer: "pm_card_us",
      id: token.id,
    })
    .then((customer) => {
      console.log("This is customer line 334", customer);
      return stripe.charges.create(
        {
          // Multiply by 100 because values arrive in cents
          amount: listing.price * 100,
          currency: "usd",
          customer: customer.id,
          receipt_email: token.email,
          description: `Purchase of ${listing.name}`,
        },
        { idempotencyKey }
      );
    })
    .then((result) => res.status(200).json(result))
    .catch((error) => next(error));
});

module.exports = router;
