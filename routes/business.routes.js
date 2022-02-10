const router = require("express").Router();
const BusinessModel = require("../models/Business.model");
const UserModel = require("./../models/User.model");
const uploader = require("./../config/cloudinary");
const isAuthenticated = require("./../middlewares/jwt.middleware");

// Set is Authenticated on every route so we can retrieve the user object in th req (Flo's method)
router.use(isAuthenticated);

// Get all businesses
router.get("/", (req, res, next) => {
  BusinessModel.find()
    // Populate the listings so the we can use it in our listingsList component in the front
    .populate("listings")
    .then((allBusinesses) => res.status(200).json(allBusinesses))
    .catch((err) => console.error(err));
});

// Get one specific business
router.get("/my-business", async (req, res, next) => {
  const ownerdId = req.payload._id;

  console.log("ownerId line 23", ownerdId);

  const business = await BusinessModel.find({ owner: ownerdId });

  console.log("business line 27", business);

  res.status(200).json(business);
});

// Create a business
router.post("/create", uploader.single("picture"), (req, res, next) => {
  const picture = req.file?.path;
  const owner = req.payload._id;

  // The tags key that we receive is a string instead of an array (probably because of formData)
  req.body.tags = req.body.tags.split(",");

  BusinessModel.create({ ...req.body, picture, owner })
    .then((createdBusiness) => res.status(200).json(createdBusiness))
    .catch((err) => next(err));
});

module.exports = router;
