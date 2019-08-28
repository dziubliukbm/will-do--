// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");
// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "scraperDB";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
// Main route (simple Hello World Message)
// app.get("/", function(req, res) {
//   res.send("main pages");
// });

// Retrieve data from the db
app.get("/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.scrapedData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/", function(req, res) {
  // Make a request via axios for the news section of `ycombinator`
  axios.get("http://www.thesempost.com/").then(function(response) {
    // Load the html body from axios into cheerio
    var $ = cheerio.load(response.data);
    // For each element with a "title" class
    // console.log($(".entry-title"))
    $(".entry").each(function(i, element) {
      // Save the text and href of each link enclosed in the current element
      var title = $(element).find('.entry-title a').text();
      // console.log("title???", title);
      var content = $(element).find('.entry-content').text();
      // console.log(i, content);
     
      if (title && content) {
        // Insert the data in the scrapedData db
        db.scrapedData.insert({
          title: title,
          content: content
        },
        function(err, inserted) {
          if (err) {
            // Log the error if one is encountered during the query
            // console.log(err);
          }
          else {
            // console.log(inserted);
          }
        });
      }
    });
 
  });
  // db.scrapedData.find({}).limit(20);
  db.scrapedData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      // console.log(found)
        // (elem=> console.log(elem[1]));
      res.render("index", {articles : found}); 
    }
  });
});



// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
