const path = require('path');
const quotesRoute = require('./quotesRoute.js');

const constructorMethod = (app) => {
    app.use("/902quotes", quotesRoute);

    app.use("/devUpdate", (req, res) => {
        const exec = require('child_process').exec;
        const child = exec('/bin/bash /home/ec2-user/updateRepo.sh',
            (error, stdout, stderr) => {
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
                if (error !== null) {
                    console.log(`exec error: ${error}`);
                }
            });
        res.send("done");
    });

    app.get("/", (req, res) => {
        console.log("home page visited");
        res.render("home");
    });

    app.use("*", (req, res) => {
        console.log("404 handler triggered");
        res.status(404).sendFile(path.resolve('public/html/404.html'));
    })
};

module.exports = constructorMethod;

