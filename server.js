/**
 * Created by rpaulin on 7/17/17.
 */

var express = require("express");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");

var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
var Saved = require("./models/Saved.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


var app = express();

var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// Static directory
app.use(express.static("./public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Database configuration with mongoose
mongoose.connect("mongodb://heroku_hjqqsf1t:d3951on7bivl98a6qmubptr3pv@ds115411.mlab.com:15411/heroku_hjqqsf1t");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
});

app.get("/", function(req, res) {

    Article.find({}, function(error, doc) {
        // Send any errors to the browser
        if (error) {
            res.send(error);
        }
        // Or send the doc to the browser
        else {
            //res.json(doc)
            res.render("index",{articles: doc});
        }
    });



});

// Routes
// ======

// A GET request to scrape the echojs website
app.post("/scrape", function(req, res) {

    Article.remove({},function() {
        // First, we grab the body of the html with request
        request("http://www.echojs.com/", function (error, response, html) {

            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(html);
            // Now, we grab every h2 within an article tag, and do the following:
            $("article h2").each(function (i, element) {

                // Save an empty result object
                var result = {};

                // Add the text and href of every link, and save them as properties of the result object
                result.title = $(this).children("a").text();
                result.link = $(this).children("a").attr("href");

                // Using our Article model, create a new entry
                // This effectively passes the result object to the entry (and the title and link)
                var entry = new Article(result);

                // Now, save that entry to the db
                entry.save(function (err, doc) {
                    // Log any errors
                    if (err) {
                        console.log(err);
                    }
                    // Or log the doc
                    else {
                        console.log(doc);
                    }
                });

            });
            res.send("scraped articles");

        });
    });

});

app.post("/save_article", function(req, res) {

    var entry = new Saved(req.body);

    entry.save(function (err, doc) {
        // Log any errors
        if (err) {
            console.log(err);
        }
        // Or log the doc
        else {
            console.log("article saved");
            res.send(doc)
        }
    });

});

app.get("/saved_articles", function(req, res) {

    Saved.find({}, function(error, doc) {
        // Send any errors to the browser
        if (error) {
            res.send(error);
        }
        // Or send the doc to the browser
        else {
            //res.json(doc)
            res.render("saved",{articles: doc});
        }
    });



});

app.post("/save_note", function(req, res) {

    console.log(req.body.id);
    console.log(req.body.text);

    Saved.findOneAndUpdate({ "_id": req.body.id }, { $push: { "notes": req.body.text } }, { new: true }, function(err, newnote) {
        // Send any errors to the browser
        if (err) {
            res.send(err);
        }
        // Or send the newdoc to the browser
        else {
            res.send(newnote);
        }
    });


});

app.post("/delete_note", function(req, res) {


    Saved.update( {}, { $pullAll: {notes: [req.body.text] } },{multi: true},function(err, delete_note) {
        // Send any errors to the browser
        if (err) {
            res.send(err);
        }
        // Or send the newdoc to the browser
        else {
            res.send(delete_note);
        }
    });


});

// Listen on port 3000
app.listen(PORT, function() {
    console.log("App running on port 3000!");
});
