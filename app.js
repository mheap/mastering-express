var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nconf = require('nconf');
var winston = require('winston');
var nunjucks = require('nunjucks');
var helmet = require("helmet");


var routes = require('./routes/index');
var users = require('./routes/users');
var popular = require('./routes/popular');
var chat = require("./routes/chat");

var app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

nconf.argv({
    'p': {
        'alias': 'http:port',
        'describe': 'The port to listen on'
    }
});

nconf.env("__");

nconf.file("config.json");

nconf.defaults({
    "http": {
        "port": 3000
    },
    "logger": {
        "fileLevel": "error"
    }
});

winston.add(winston.transports.File, {"filename": "error.log", "level": nconf.get("logger:fileLevel")});

winston.info('Initialised nconf');
winston.info('HTTP Config: ', nconf.get("http"));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require("csurf")({"cookie": true}))
app.use(function(err, req, res, next){
    if (err.code !== 'EBADCSRFTOKEN') { return next(err); }

    res.status(403);
    res.send("Session has expired or has been tampered with");
});

app.use(helmet.xframe("sameorigin"));

app.use(function(req, res, next) {
    if (req.xhr || req.headers['accept'] == 'application/json') {
        req.wants_json = true;
    }
    next();
});

app.use('/', routes);

app.use('/popular', function(req, res, next) {
    console.log('Middleware: %s, %s', req.method, req.url);
    next();
});

app.use(function(req, res, next){
    if (req.method == 'GET' && req.path == '/foo') {
        return res.send("On Foo");
    }
    if (req.method == 'GET' && req.path == '/bar') {
        return res.send("On Bar");
    }
    next();
});

app.use('/users', users);
app.use('/popular', popular);
app.use("/chat", chat);
app.use('/sub', require('./lib/sub'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
