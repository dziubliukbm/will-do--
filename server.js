// get all quries first

var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var logger = require("morgan");



// set up and get all models
var db = require("./models");

// set up PORT
var PORT = process.env.PORT || 3000;

// initialize express
var app = express();
var router = express.Router();

//direct our routs by the routs 
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
//require routs file pass router object 
// configure midleware

//use morgan logger for loggin requests
app.use(logger("dev"));
//pares request body as JSON
app.use(express.urlencoded({ extended:true}));
app.use(express.json());
// male public static folder
app.use(express.static("public"));
// connect to the Mongo DB

app.use(router);

mongoose.connect("mongodb://localhost/scrapedData", {useNewUrlParser: true})

require("./config/apiRoutes")(router, db);
require("./config/routes")(router, db);

app.listen(3000, function() {
    console.log("App running on port ", PORT);
  });