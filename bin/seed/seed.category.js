require("dotenv").config();
require("../../config/db.config");
const CategoryModel = require("../../models/Category.model");
const ListingModel = require("../../models/Listing.model");

// let colorArray = [];
// function getRandomColor() {
//   var letters = '0123456789ABCDEF';
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

// color1 = getRandomColor();

// console.log(typeof color1);

// for (let i = 0; i < 9; i++) {
//   let color = getRandomColor();
//   colorArray.push(color);
// }


const categories = [
  {
    name: "Japanese",
    listings: [],
    // color: "#c5ffac",
    color: "#ffc9a1",
  },
  {
    name: "Terroir",
    listings: [],
    // color: "#a1ffae",
    color: "#ffbb97",
  },
  {
    name: "Mexican",
    listings: [],
    color: "#97ffd1",
    color: "#ffac8d",
  },
  {
    name: "Libanese",
    listings: [],
    color: "#8dfffe",
    color: "#ff9e83",

  },
  {
    name: "Bakery",
    listings: [],
    // color: "#83cbff",
    color: "#ff8f79",
  },
  {
    name: "Vegetarian",
    listings: [],
    // color: "#798dff",
    color: "#ff806f"
  },
  {
    name: "Italian",
    listings: [],
    // color: "#976fff",
    color: "#ff7264"
  },
  {
    name: "Supermarket",
    listings: [],
    // color: "#d264ff"
    color: "#ff635a"
  },
  {
    name: "Vegan",
    listings: [],
    color: "#ff5550"
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


    const inserted = await CategoryModel.insertMany(categories); // insert docs in db
    // console.log(
    //   `seed categories done : ${inserted.length} documents inserted !`
    // );
    process.exit();
  } catch (err) {
    console.error(err);
  }
}

insertCategories();


