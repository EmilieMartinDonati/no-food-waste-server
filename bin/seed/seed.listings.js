require("dotenv").config();
require("../../config/db.config");
const ListingModel = require("../../models/Listing.model");
const BusinessModel = require("../../models/Business.model");

 // Test Javascript for generating dates.

//  const randomTime = () => {
//     const hrs = Math.round(Math.random() * 24);
//     const mins = Math.round(Math.random() * 60);    
//     var hFormat = (hrs<10 ? "0" : "");
//     var mFormat = (mins<10 ? "0" : "");
//     var amPm = (hrs<12 ? "AM" : "PM");
//     var is12 = (hrs % 12 === 0);
  
//     return amPm === "AM" && !is12 ? String(hFormat+hrs+ ":" +mFormat+mins+ " " +amPm)
//                   : "AM" && is12  ? String(12 + ":" +mFormat+mins+ " " +amPm)
//                   : is12 ? String(hFormat+hrs+ ":" +mFormat+mins+ " " +amPm)
//                   : String(hFormat+(hrs-12)+ ":" +mFormat+mins+ " " +amPm);
  
//   }
  
//   var resultTime = randomTime();
//   console.log(resultTime);

//   var resultTime2 = randomTime();
//   console.log(resultTime2);

//   var resultTime3 = randomTime();
//   console.log(resultTime3);

//   var resultTime4 = randomTime();
//   console.log(resultTime4);

//   var resultTime5 = randomTime();
//   console.log(resultTime5);


const listings = [
    {
        name: "pokeball fusion",
        owner: null,
        price: 12,
        availableQuantity: 4,
        description: "a nice bowl with vegetables and little animals",
        archived: false,
        recurring: true,
    },
    {
        name: "hawaian pizza",
        owner: null,
        price: 9,
        availableQuantity: 3,
        description: "that outrageous heretic pizza we all secretly love but won't admit in public",
        archived: false,
        recurring: true,
    },
    {
        name: "fried oreos",
        owner: null,
        price: 4,
        availableQuantity: 1,
        description: "Meh",
        archived: false,
        recurring: false,
    },
    {
        name: "currywurst",
        owner: null,
        price: 6,
        availableQuantity: 2,
        description: "a classic, served with ketchup",
        archived: false,
        recurring: true,
    }
]

async function insertListings() {
    try {
    await ListingModel.deleteMany();
    // const owners = await Promise.all([
    //     BusinessModel.findOne({ name: "Pizzayolo" }),
    //     BusinessModel.findOne({ name: "Pastacopy" }),
    //     BusinessModel.findOne({ name: "Schadenfreude" }),
    // ]);

    //  listings[0].owner = owners[1];
    //  listings[1].owner = owners[0];
    //  listings[2].owner = owners[0];
    //  listings[3].owner = owners[2];

    // const inserted = await ListingModel.insertMany(listings); // insert docs in db
    // console.log(`seed listings done : ${inserted.length} documents inserted !`);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

insertListings();