const BusinessModel = require("../models/Business.model");
const UserModel = require("./../models/User.model");

const router = require("express").Router();

router.get("/", (req, res, next) => {
  BusinessModel.find()
    .then((allBusinesses) => res.status(200).json(allBusinesses))
    .catch((err) => console.error(err));
});

router.post("/create", (req, res, next) => {
  console.log("THIS IS REQ BODY LINE 13", req.body);
  console.log("THIS IS REQ SESSION LINE 14", req.session);

  BusinessModel.create(req.body)
    .then((createdBusiness) => res.status(200).json(createdBusiness))
    .catch((err) => next(err));

  // UserModel.findById(req)
});

module.exports = router;
