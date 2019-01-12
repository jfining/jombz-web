const express = require('express');
const router = express.Router();
const userData = require("../data/users.js");
const bcrypt = require("bcryptjs");
const SALT_ROUNDS = require("../config/settings.json").appConfig.BCRYPT_SALT_ROUNDS

router.get("/", (req, res) => {
    console.log("register route");
    res.render("registerUser");
});

router.post("/", async function (req, res) {
    console.log("POST to register");
    //hash the password
    hashedPassword = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    username = req.body.username;
    try {
        const user = await userData.createUserByParams(username, hashedPassword, "", "", "", "");
        if (user) {
            console.log(user);
            res.redirect("/login");
        }
        else {
            const renderInfo = {
                has_errors: true,
                error_message: "Failed to create user."
            };
            res.render("registerUser", renderInfo);
        }
    } catch(e) {
        console.log("Error creating user");
        console.log(e.message);
        const renderInfo = {
            has_errors: true,
            error_message: e.message
        };
        response.render("registerUser", renderInfo);
    }
});

module.exports = router;
