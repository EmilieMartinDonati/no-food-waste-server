const router = require("express").Router();
const ListingModel = require("./../models/Listing.model");
const BusinessModel = require("./../models/Business.model");

// Get all listings
router.get("/", (req, res, next) => {
  ListingModel.find()
    .then((allListings) => res.status(200).json(allListings))
    .catch((err) => next(err));
});

// Get one listing
router.get("/:listingId", (req, res, next) => {
  const { listingId } = req.params;

  ListingModel.findById(listingId)
    .then((listing) => res.status(200).json(listing))
    .catch((err) => next(err));
});

// Create one listing
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
    // Else catch the error
  } catch (error) {
    next(error);
  }
});

// Delete one listing
router.delete("/:businessId/delete/:listingId", async (req, res, next) => {
  try {
    const { listingId, businessId } = req.params;

    const updatedBusinessObject = await BusinessModel.findByIdAndUpdate(
      businessId,
      {
        $pull: { listings: listingId },
      },
      { new: true }
    ).populate("listings");

    await ListingModel.findByIdAndDelete(listingId);

    res.status(202).json(updatedBusinessObject);
  } catch (error) {
    next(error);
  }
});

// Upate one listing
router.patch("/modify/:listingId", async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const { name, price, availableQuantity, description, recurring } = req.body;

    console.log("This is req body / line 69 / listing Routes", req.body);

    const updatedListing = await ListingModel.findByIdAndUpdate(
      listingId,
      { name, price, availableQuantity, description, recurring },
      { new: true }
    );

    console.log(
      "This is updatedListing / line 78 / listing routes",
      updatedListing
    );

    res.status(204).json(updatedListing);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
