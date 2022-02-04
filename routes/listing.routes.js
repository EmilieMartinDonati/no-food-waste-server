const router = require("express").Router();
const ListingModel = require("../models/Listing.model");

router.get("/", (req, res, next) => {
  ListingModel.find()
    .then((allListings) => res.status(200).json(allListings))
    .catch((err) => next(err));
});

router.post("/create", (req, res, next) => {
  ListingModel.create(req.body)
    .then((createdListing) => res.status(200).json(createdListing))
    .catch((err) => next(err));
});

module.exports = router;
