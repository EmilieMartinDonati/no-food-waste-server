require("dotenv").config();
require("../../config/db.config");
const CategoryModel = require("../../models/Category.model");
const ListingModel = require("../../models/Listing.model");

let colorArray = [];
function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

color1 = getRandomColor();

console.log(typeof color1);

for (let i = 0; i < 9; i++) {
  let color = getRandomColor();
  colorArray.push(color);
}


const categories = [
  {
    name: "Japanese",
    listings: [],
    color: "#f2cc6f",
  },
  {
    name: "Terroir",
    listings: [],
    color: "#fefa48",
  },
  {
    name: "Mexican",
    listings: [],
    color: "#8d9f85"
  },
  {
    name: "Libanese",
    listings: [],
    color: "#d41260"

  },
  {
    name: "Bakery",
    listings: [],
    color: "#fba317"
  },
  {
    name: "Vegetarian",
    listings: [],
    color: "#493263"
  },
  {
    name: "Italian",
    listings: [],
    color: "#ace5a1"
  },
  {
    name: "Supermarket",
    listings: [],
    color: colorArray[7]
  },
  {
    name: "Vegan",
    listings: [],
    color: colorArray[8]
  },
];






async function insertCategories() {
  try {
    await CategoryModel.deleteMany();
    // const listings = await Promise.all([
    //   ListingModel.findOne({ name: "pokeball fusion" }),
    //   ListingModel.findOne({ name: "hawaian pizza" }),
    //   ListingModel.findOne({ name: "fried oreos" }),
    //   ListingModel.findOne({ name: "currywurst" }),
    // ]);

    // categories[0].listings[0] = listings[0];
    // categories[1].listings[0] = listings[3];
    // categories[2].listings[0] = listings[2];
    // categories[4].listings[0] = listings[2];
    // categories[4].listings[1] = listings[1];
    // categories[6].listings[0] = listings[0];
    // categories[8].listings[0] = listings[2];
    // categories[8].listings[1] = listings[1];


    // const inserted = await CategoryModel.insertMany(categories); // insert docs in db
    // console.log(
    //   `seed categories done : ${inserted.length} documents inserted !`
    // );
    process.exit();
  } catch (err) {
    console.error(err);
  }
}

insertCategories();


