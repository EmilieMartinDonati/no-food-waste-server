const router = require("express").Router();
const BusinessModel = require("../models/Business.model");
const UserModel = require("./../models/User.model");
const uploader = require("./../config/cloudinary");
const isAuthenticated = require("./../middlewares/jwt.middleware");

router.use(isAuthenticated);

router.get("/", (req, res, next) => {
  BusinessModel.find()
    .then((allBusinesses) => res.status(200).json(allBusinesses))
    .catch((err) => console.error(err));
});

router.post("/create", uploader.single("picture"), (req, res, next) => {
  const picture = req.file?.path;
  const owner = req.payload._id;

  BusinessModel.create({ ...req.body, picture, owner })
    .then((createdBusiness) => res.status(200).json(createdBusiness))
    .catch((err) => next(err));
});

module.exports = router;
