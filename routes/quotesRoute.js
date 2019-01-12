const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const AWS = require('aws-sdk');
const appConfig = require('../config/settings.json').appConfig;

router.get("/", (req, res) => {
    console.log("902quotes route hit");
    var quotesObject = fs.readFileSync("./"+appConfig.QUOTES_KEY, 'utf-8');
    var quotesJson = JSON.parse(quotesObject);
    var quotesArray = quotesJson["quotes"];
    var renderData = {
        quotesArray: quotesArray
    };
    res.render("902quotes", renderData);
});

router.post("/", (req, res) => {
    console.log("POST to 902quotes");
    console.log(req.body);
    dataToWrite = [];
    for (let quote of req.body.quotes) {
        if (quote !== "") {
            dataToWrite.push(quote);
        }
    }
    fs.writeFileSync(appConfig.QUOTES_KEY, JSON.stringify({quotes:dataToWrite}));
    AWS.config.loadFromPath('../config/aws-creds.json');
    var s3 = new AWS.S3();
    fs.readFile("./"+config.QUOTES_KEY, function (err, data) {
        if (err) { throw err; }

        params = {Bucket: config.QUOTES_BUCKET, Key: config.QUOTES_KEY, Body: data};
        s3.putObject(params, function(err, data) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("Successfully uploaded quotes to s3.");
            }
        });
    });
    res.redirect("/902quotes");
});

module.exports = router;

