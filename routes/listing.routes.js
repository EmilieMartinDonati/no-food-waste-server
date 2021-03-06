const router = require("express").Router();
const ListingModel = require("./../models/Listing.model");
const BusinessModel = require("./../models/Business.model");
const CategoryModel = require("./../models/Category.model");

// Get all listings
router.get("/", (req, res, next) => {
  ListingModel.find()
    .populate("owner")
    .then((allListings) => {
      allListings.forEach((listing) => {
        if (
          listing.owner.endTimeSlot.getTime() < new Date().getTime() &&
          listing.recurring === false
        ) {
          listing.archived = true;
        }
      });
      return res.status(200).json(allListings);
    })
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
    // Retrieve the user Id from req payload (thanks to the middleware and the API Handler)And add the owner to the req.body
    req.body.owner = businessId;
    // Create a new listing
    const createdListing = await ListingModel.create(req.body);
    // Attach the new listing to the business
    const foundBusiness = await BusinessModel.findByIdAndUpdate(
      businessId,
      { $push: { listings: createdListing } },
      { new: true }
    );
    // Send back the listing to the front

    // Tags.
    const categories = foundBusiness.tags;
    console.log("retrieved categories line 40", categories);
    categories.forEach(async (catId) => {
      const foundCategory = await CategoryModel.findByIdAndUpdate(catId, {
      $push: {listings: createdListing}
      }, 
      {new: true})
    })
    

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
    const { name, price, availableQuantity, description, recurring, archived } =
      req.body;

    console.log("This is req body / line 69 / listing Routes", req.body);

    const updatedListing = await ListingModel.findByIdAndUpdate(
      listingId,
      { name, price, availableQuantity, description, recurring, archived },
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
