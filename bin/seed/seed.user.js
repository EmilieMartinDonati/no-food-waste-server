require("dotenv").config();
require("../../config/db.config");
const UserModel = require("../../models/User.model")

const users = [
    {
        name: "Lino",
        email: "lino@lino.com",
        password: "lino",
        role: "business",

    },
    {
        name: "Ettore",
        email: "ettore@ettore.com",
        password: "ettore",
        role: "business",
    },
    {
        name: "Paul",
        email: "paul@paul.com",
        password: "paul",
        role: "business",
    },
    {
        name: "Em",
        email: "em@em.com",
        password: "em",
        role: "user",
        bookings: [],
        favorites: [],
    }
]

async function insertUsers() {
    try {
    // await UserModel.deleteMany();
    const inserted = await UserModel.insertMany(users); // insert docs in db
    console.log(`seed users done : ${inserted.length} documents inserted !`);
  } catch (err) {
    console.error(err);
  }
};

insertUsers();
