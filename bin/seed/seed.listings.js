require("dotenv").config();
require("../../config/db.config");
const ListingModel = require("../../models/Listing.model");
const BusinessModel = require("../../models/Business.model");

const listings = [
    {
        name: "pokeball fusion",
        owner: null,
        price: 12,
        availableQuantity: 4,
        description: "a nice bowl with vegetables and little animals",
        archived: false,
        recurring: true,
        // publishedDate: newDate(),
    },
    {
        name: "hawaian pizza",
        owner: null,
        price: 9,
        availableQuantity: 3,
        description: "that outrageous heretic pizza we all secretly love but won't admit in public",
        archived: false,
        recurring: true,
        // publishedDate: newDate(),
    },
    {
        name: "fried oreos",
        owner: null,
        price: 4,
        availableQuantity: 1,
        description: "Meh",
        archived: false,
        recurring: true,
        // publishedDate: newDate(),
    },
    {
        name: "currywurst",
        owner: null,
        price: 6,
        availableQuantity: 2,
        description: "a classic, served with ketchup",
        archived: false,
        recurring: true,
        // publishedDate: newDate(),
    }
]

async function insertListings() {
    try {
    // await ListingModel.deleteMany();
    const owners = await Promise.all([
        BusinessModel.findOne({ name: "Pizzayolo" }),
        BusinessModel.findOne({ name: "Pastacopy" }),
        BusinessModel.findOne({ name: "Schadenfreude" }),
    ]);

     listings[0].owner = owners[1];
     listings[1].owner = owners[0];
     listings[2].owner = owners[0];
     listings[3].owner = owners[2];

    const inserted = await ListingModel.insertMany(listings); // insert docs in db
    console.log(`seed listings done : ${inserted.length} documents inserted !`);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

insertListings();