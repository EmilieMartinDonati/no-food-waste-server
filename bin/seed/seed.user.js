require("dotenv").config();
require("../../config/db.config");
const UserModel = require("../../models/User.model")
const bcrypt = require("bcryptjs");

const password = bcrypt.hashSync("1234");

const users = [
    {
        name: "Lino",
        email: "lino@lino.com",
        password: password,
        role: "business",

    },
    {
        name: "Ettore",
        email: "ettore@ettore.com",
        password: password,
        role: "business",
    },
    {
        name: "Paul",
        email: "paul@paul.com",
        password: password,
        role: "business",
    },
    {
        name: "Em",
        email: "em@em.com",
        password: password,
        role: "user",
        bookings: [],
        favorites: [],
    }
]

async function insertUsers() {
    try {
    await UserModel.deleteMany();
    const inserted = await UserModel.insertMany(users); // insert docs in db
    console.log(`seed users done : ${inserted.length} documents inserted !`);
  } catch (err) {
    console.error(err);
  }
};

insertUsers();
