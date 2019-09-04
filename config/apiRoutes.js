//geting all quiries first 
var cheerio = require("cheerio");
var axios = require("axios");

module.exports = function (router, db){
router.get("/api/scrape", function (req,res){
    axios.get("http://www.thesempost.com/").then(function (response){
        var $ = cheerio.load(response.data);
        $(".entry").each(function (i,element){
            var result = {};
            result.title = $(element).find(".entry-title a").text();
            result.link = $(element).find(".entry-title a").attr("href");
            result.content = $(element).find(".entry-content").text();
            result.saved = false;
            console.log(result)
            db.Article.create(result).then(function(dbArticle){
                        console.log(dbArticle);
                    })
                    .catch(function(err){
                        console.log(err)
                    })
        })

        res.status(200).end();
        })
})
}