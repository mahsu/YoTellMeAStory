var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var async = require('async');
mongoose.connect("mongodb://localhost/yostory");
var debug = require('debug')('YoStory');


var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/test', function () {
    res.send("test")
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
var yo, routes;

function setupRoutes(callback) {
    yo = require('./routes/yo');
    routes = require('./routes/index');
    app.use('/', routes);
    app.use('/yo', yo);
    app.use('/location/:lat/:lon', routes);

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handlers

// development error handler
// will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

// production error handler
// no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });
callback();
}


//var markov = require("./markov-generator");
var dictionary = require('./importDictionary');
var Markov = require('./markov-chain.js');

async.waterfall([
    function (done) {
        console.log("Setting up dictionary");
        dictionary.setup(function (err, res) {
            GLOBAL.dictionary = res;
            console.log("Done.");
            done(null, res);
        })
    },
    function (res, done) {
        console.log("Setting up Markov chain.");
        GLOBAL.markov = new Markov("I like to meow.");
        console.log("Done.");
        done(null, res);
    },
    function (res, done) {
        setupRoutes(function () {
            done(null, null);
        });

    }
], function (err, res) {

    app.set('port', process.env.PORT || 3000);

    var server = app.listen(app.get('port'), function () {
        console.log('Express server listening on port ' + server.address().port);
    });
});



