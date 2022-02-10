const router = require("express").Router();
const CategoryModel = require("../models/Category.model");

router.post("/", (req, res, next) => {
  CategoryModel.find()
    .then((allCategories) => res.status(200).json(allCategories))
    .catch((err) => next(err));
});

module.exports = router;
