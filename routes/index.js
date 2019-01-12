const path = require('path');
const quotesRoute = require('./quotesRoute.js');
const registerRoute = require('./registerRoute.js');
const cloudChannelsRoute = require('./cloudChannels.js');
const userData = require("../data/users.js");
const guid = require("guid");
const bcrypt = require("bcryptjs");

const constructorMethod = (app) => {
    app.use(async function(request, response, next) {
        if (request.path === "/login" || request.path === "/logout") {
            next();
            return;
        }
        if (request.cookies.AuthCookie && request.cookies.Username) {
            const authCookie = request.cookies.AuthCookie;
            const username = request.cookies.Username;
            const user = await userData.getUserByUsername(username);
    
            if (user) {
                if (user.sessions.includes(authCookie)) {
                    next();
                    return;
                    /*
                    if (request.path === "/private") {
                        next();
                        return;
                    }
                    else {
                        response.redirect("/private");
                    }
                    */
                }
                else {
                    const renderInfo = {
                          has_errors: true,
                          error_message: "Invalid session. Please login again."
                      };
                      //need to remove cookies
                      response.clearCookie("AuthCookie");
                      response.clearCookie("Username");
                    response.render("login", renderInfo);
                }
            }
            else {
                const renderInfo = {
                      has_errors: true,
                      error_message: "Invalid session. Please login again."
                  };
                //need to remove cookies here
                response.clearCookie("AuthCookie");
                response.clearCookie("Username");
                response.render("login", renderInfo);
            }
        }
        else {
            if (request.path === "/register") {
                next();
                return;
            }
            else {
                const renderInfo = {
                      has_errors: true,
                      error_message: "You must be logged in to view this page."
                  };
                  response.render("login", renderInfo);
            }
        }
    });
    
    app.get("/login", async function(request, response) {
        const renderInfo = {
            has_errors: false,
            error_message: ""
        };
        response.render("login", renderInfo);
    });

    app.post("/login", async function(request, response) {
        if (request.body.username && request.body.password) {
            username = request.body.username;
            password = request.body.password;
        }
        else {
            const renderInfo = {
                has_errors: true,
                error_message: "Incorrect Username/Password. Please try again."
            };	
            response.render("login", renderInfo);
        }
        
        const user = await userData.getUserByUsername(username);
    
        if (user) {
            if (await bcrypt.compare(password, user["hashedPassword"])) {
                sessionId = guid.create().toString();
                await userData.addSessionForUser(username, sessionId);
                response.cookie("AuthCookie", sessionId);
                response.cookie("Username", username);
                response.redirect("/");
            }
            else {
                const renderInfo = {
                    has_errors: true,
                    error_message: "Incorrect Username/Password. Please try again."
                };	
                response.render("login", renderInfo);
            }
        }
        else {
            const renderInfo = {
                has_errors: true,
                error_message: "User not found. Please try again."
            };	
            response.render("login", renderInfo);
        }
    });
    
    app.get("/private", async function(request, response) {
        if (request.cookies.Username) {
            const username = request.cookies.Username;
            const user = await userData.getUserByUsername(username);
            response.render("userInfo", user);
        }
    });
    
    app.get("/logout", async function(request, response) {
        if (request.cookies.Username) {
            const username = request.cookies.Username;
            if (request.cookies.AuthCookie) {
                const authCookie = request.cookies.AuthCookie;
                updatedUser = await userData.removeSessionForUser(username, authCookie);
                if (updatedUser) {
                    response.clearCookie("AuthCookie");
                    response.clearCookie("Username");
                    response.render("logout");
                }
            }
        }
    });

    app.use("/register", registerRoute);

    app.use("/902quotes", quotesRoute);

    app.use("/cloudchannels", cloudChannelsRoute);

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

