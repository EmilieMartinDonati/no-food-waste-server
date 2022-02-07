require("dotenv").config();
require("../../config/db.config");
const CategoryModel = require("../../models/Category.model");
const ListingModel = require("../../models/Listing.model");

const categories = [
    {name: "japanese",
    listings: []},
    {name: "terroir",
    listings: []},
    {name: "mexican",
    listings: []},
    {name: "libanese",
    listings: []},
    {name: "bakery", 
    listings: []}
]

async function insertCategories() {
try {
    await CategoryModel.deleteMany();
    const listings = await Promise.all([
      ListingModel.findOne({name: "pokeball fusion"}),
      ListingModel.findOne({name: "hawaian pizza"}),
      ListingModel.findOne({name: "fried oreos"}),
      ListingModel.findOne({name: "currywurst"}),
    ]
    );

    categories[0].listings[0] = listings[0];
    categories[1].listings[0] = listings[3];
    categories[2].listings[0] = listings[2];
    categories[4].listings[0] = listings[2];
    categories[4].listings[1] = listings[1];


    const inserted = await CategoryModel.insertMany(categories); // insert docs in db
    console.log(`seed categories done : ${inserted.length} documents inserted !`);
    process.exit();
}
catch (err) {
console.error(err)
}
}

insertCategories();

