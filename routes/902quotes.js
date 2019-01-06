const path = require('path');

const constructorMethod = (app) => {

    app.get("/902quotes", (req, res) => {
        console.log("902quotes route hit");
        res.render("902quotes");
    });

    app.post("/902quotes", (req, res) => {
        console.log("POST to 902quotes");
        res.render("902quotes");
    });

    app.use("*", (req, res) => {
        console.log("404 handler triggered");
        res.status(404).sendFile(path.resolve('public/html/404.html'));
    })
};

module.exports = constructorMethod;

