const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const staticAssets = express.static(__dirname + '/public');
const cookieParser = require('cookie-parser');
const appConfig = require('./config/settings.json').appConfig

const configRoutes = require("./routes");
const exphbs  = require('express-handlebars');

app.use("/public", staticAssets);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(appConfig.LISTEN_PORT, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:" + appConfig.LISTEN_PORT.toString());
});
