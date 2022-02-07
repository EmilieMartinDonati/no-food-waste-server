const router = require("express").Router();
const ListingModel = require("./../models/Listing.model");
const BusinessModel = require("./../models/Business.model");

router.get("/", (req, res, next) => {
  ListingModel.find()
    .then((allListings) => res.status(200).json(allListings))
    .catch((err) => next(err));
});

router.post("/:businessId/create", async (req, res, next) => {
  try {
    // Retrieve the business Id from params
    const { businessId } = req.params;
    // Create a new listing
    const createdListing = await ListingModel.create(req.body);
    // Attach the new listing to the business
    await BusinessModel.findByIdAndUpdate(
      businessId,
      { $push: { listings: createdListing } },
      { new: true }
    );
    // Send back the listing to the front
    res.status(200).json(createdListing);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
