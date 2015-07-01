var express = require("express");
var app = express();

app.get('/', function(req, res){
    res.send("This is our sub-application");
});

module.exports = app;
