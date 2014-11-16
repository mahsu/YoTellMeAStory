var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var async = require('async');
var debug = require('debug')('YoStory');
var fs = require('fs');

var app = express();
var server = require('http').createServer(app);
app.set('port', process.env.PORT || 3000);

server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});

GLOBAL.io = require('socket.io')(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

function setupRoutes(callback) {
    var yo = require('./routes/yo');
    var routes = require('./routes/index');
    var location = require('./routes/location');
    app.use('/', routes);
    app.use((process.env.YO_URL || '/yo'), yo);
    app.use('/location/', location);

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
        process.on('uncaughtException', function(err) {
            // handle the error safely
            console.log(err);
        });
    });
    callback();
}


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
        fs.readFile('./wildgarden.txt', function (err, data) {
            if (err) {
                throw err;
            }
            var words = data.toString();
            new Markov(words, function(o){
                GLOBAL.markov = o;
                console.log("Done.");
                done(null, res);
            });
        });
    },
    function (res, done) {
        console.log("Setting up routes.");
        setupRoutes(function () {
            console.log("Done.");
            done(null, null);
        });

    }],
    function (err, res) {
        console.log("Setting up database.");

        mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/yostory', function(err){
            if (!err) {
                GLOBAL.io.on('connection', function(socket){
                    console.log('a user connected');
                    socket.on('disconnect', function(){
                        console.log('user disconnected');
                    });
                });
            }
            else throw err;
        });
        console.log("Done.");

    }
);



