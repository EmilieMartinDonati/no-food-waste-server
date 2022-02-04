require("dotenv").config();
require("../../config/db.config");
const BusinessModel = require("./../../models/Business.model");
const UserModel = require("./../../models/User.model");
const ListingModel = require("./../../models/Listing.model");

const businesses = [
    {
        owner: null,
        name: "Pizzayolo",
        phone: 0670357007,
        address: "4 rue des Bégonias 75019 Paris",
        description: "a pizza maker with a vegan option",
        picture: "https://tse3.mm.bing.net/th?id=OIP.ZPsWj-2PkuCT7KTjyhgkjgHaDK&pid=Api",
        listings: [],
        tags: "Restaurant"
        // StartPickUpDate: newDate(),
        // EndPickUpDate: newDate()
    },
    {
        owner: null,
        name: "Pastacopy",
        phone: 0670356007,
        address: "3 rue des Bégonias 75019 Paris",
        description: "an italian takeaway",
        picture: "https://i.pinimg.com/originals/7d/f2/63/7df263d98a2fc0fa57789229353b6931.jpg",
        listings: [],
        tags: "Restaurant",
        // StartPickUpDate: newDate(),
        // EndPickUpDate: newDate(),
    },
    {
        owner: null,
        name: "Schadenfreude",
        phone: 0670355007,
        address: "2 rue des Bégonias 75019 Paris",
        description: "Creepy currywurst takeaway",
        picture: "https://fastly.4sqi.net/img/general/600x600/6195632_2iSydHZ5TszNPh5IHfwvbBRHvDmPcmUg2M5dHXVSkow.jpg",
        listings: [],
        tags: "Bakery"
        // StartPickUpDate: newDate(),
        // EndPickUpDate: newDate()
    }
]

    async function insertBusinesses() {
        try {
            
           await BusinessModel.deleteMany();

            const users = await Promise.all([
                UserModel.findOne({ name: "Lino" }),
                UserModel.findOne({ name: "Ettore" }),
                UserModel.findOne({ name: "Paul" }),
            ]);

            businesses[0].owner = users[0];
            businesses[1].owner = users[1];
            businesses[2].owner = users[2];

            const listings = await Promise.all([
                    ListingModel.findOne({ name: "pokeball fusion" }),
                    ListingModel.findOne({ name: "hawaian pizza" }),
                    ListingModel.findOne({ name: "fried oreos" }),
                    ListingModel.findOne({ name: "currywurst" })
                ]);

            businesses[0].listings[0] = listings[1];
            businesses[0].listings[1] = listings[2];
            businesses[1].listings[0] = listings[0];
            businesses[2].listings[0] = listings[3];

            const inserted = await BusinessModel.insertMany(businesses); // insert docs in db
            console.log(`seed businesses done : ${inserted.length} documents inserted !`);
            process.exit();
        } catch (err) {
            console.error(err);
        }
    };

insertBusinesses();
