const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const User = require("../models/User.model");
const isAuthenticated = require("../middlewares/jwt.middleware");
// Route pour le signup.

router.post("/signup", async (req, res, next) => {
    const { name, email, password, role } = req.body;
    console.log(req.body);
    if (email === "" || name === "" || password === "") {
        res.status(400).json({ message: "please enter all fields with a valid value" });
    }
    // Add logic for unsufficient password with a regex.
    try {
        // Here find by email in the user model.
        const foundUser = User.findOne({email});
        if (foundUser) {
            res.status(400).json({ message: "it seems that you already have an account." });
            return;
        }
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPass = bcrypt.hashSync(password, salt);


        // Utilisation du user model.
        const createdUser = await User.create({
            name,
            email,
            password: hashedPass,
            role: role
        });

        const user = createdUser.toObject();
        delete user.password;
        // Sending the user as json to the client
        res.status(201).json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal servor error" });
    }
});

// Route pour le signup.

router.post("/login", async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const foundUser = await User.findOne({ email });
        if (!foundUser) {
            res.status.apply(401).json({ message: "wrong email" });
            return;
        }
        const goodPass = bcrypt.compareSync(password, foundUser.password);
        if (goodPass) {
            const user = foundUser.toObject();
            delete user.password;
            const authToken = jwt.sign(user, process.env.TOKEN_SECRET, {
                algorithm: "HS256",
                expiresIn: "6d",
            });
            //! Sending the authToken to the client :
            res.status(200).json({ authToken });
        } else {
            res.status(401).json("wrong password");
        }
    }
    catch (error) {
        console.log(error);
        res.status(500)
            .json({
                message: "Something went wrong"
            });
    }
});

router.post("/account", isAuthenticated, (req, res, next) => {
    console.log("req payload", req.payload);
	res.status(200).json(req.payload);
});


module.exports = router;