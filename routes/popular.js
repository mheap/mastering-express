var express = require('express');
var router = express.Router();
var instagram = require("../lib/instagram");
var models = require("../models");


var ig = new instagram("f1c5d63dc50b401ebe0a98c2276f6fe9", "154457cb15c347d182298967f8e63010");

/* GET home page. */
router.get('/', function(req, res, next) {
  ig.get_most_popular_with_cache(function(err, media, limit){
    if (err) { throw err; }
    if (req.wants_json){
        return res.send(media);
    }
    res.render('popular', { media: media });

  });

});

var handler = function(req, res, next) {
  res.render("form", {greeting: req.body.greeting, "csrfToken": req.csrfToken()});
};

router.get("/form", handler);
router.post("/form", handler);

router.get("/:id", function(req, res, next) {
  models.Comment.findAll({
      "where": {
          "id": req.params.id
      }
  }).then(function(comments){
    setTimeout(function(){
      for (var i=0; i < comments.length; i++) {
          io.emit('new-comment-' + req.params.id, comments[i]);
      }
    }, 500);
  });

    var media = ig.get_media_from_id(req.params.id);
    res.render("single", { media: media} );
});

module.exports = router;
