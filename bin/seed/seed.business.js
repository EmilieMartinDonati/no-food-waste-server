require("../../config/db.config.js");
require("dotenv").config();
const BusinessModel = require("./../../models/Business.model")

const businesses = [
    {
        owner: null,
        name: "Lino",
        phone: 0670357007,
        adress : "4 rue des Bégonias 75019 Paris",
        description: "a pizza maker with a vegan option",
        picture: "https://tse3.mm.bing.net/th?id=OIP.ZPsWj-2PkuCT7KTjyhgkjgHaDK&pid=Api",
        listings: null,
        tags: ["Restaurant"],
        pickupTimeSlots: Date.now(),
    },
    {
        owner: null,
        name: "Jacky",
        phone: 0670356007,
        adress : "3 rue des Bégonias 75019 Paris",
        description: "an american takeaway",
        picture: "https://i.pinimg.com/originals/7d/f2/63/7df263d98a2fc0fa57789229353b6931.jpg",
        listings: null,
        tags: ["Restaurant"],
        pickupTimeSlots: Date.now(),
    },
    {
        owner: null,
        name: "Klaus",
        phone: 0670355007,
        adress : "2 rue des Bégonias 75019 Paris",
        description: "Currywurst takeaway",
        picture: "https://fastly.4sqi.net/img/general/600x600/6195632_2iSydHZ5TszNPh5IHfwvbBRHvDmPcmUg2M5dHXVSkow.jpg",
        listings: null,
        tags: ["Restaurant"],
        pickupTimeSlots: Date.now(),
    }
]

(async function insertBusinesses () {
    try {
    const inserted = await BusinessModel.insertMany(businesses); // insert docs in db
    console.log(`seed businesses done : ${inserted.length} documents inserted !`);
    process.exit();
  } catch (err) {
    console.error(err);
  }
})()
