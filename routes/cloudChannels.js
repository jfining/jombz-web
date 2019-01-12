const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    console.log("cloud channels route");
    res.render("cloudChannels");
});

module.exports = router;
