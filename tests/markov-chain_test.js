var Markov = require("../markov-chain.js");
var fs = require('fs');
var nodeunit = require('nodeunit');

var m;
var mm;
var cycle;
var large;
//cycle = new Markov(["I know I"]);
//mm = new Markov(["I like to know and eat chicken. Meow I am a cat. I am a dog. I am a chicken. I like yo. Yo, I like hacking. Poop, know know I am xDDD."], function() {
//    callback();
//});

/*var garden = null;
 fs.readFile('../wildgarden.txt', function (err, data) {
 if (err) {
 throw err;
 }
 words = data.toString().replace(/(\r\n|\n|\r)/gm," ");
 word_arr = words.match(/[^\.!\?]+[\.!\?]+/g);
 garden = new Markov(word_arr);
 });*/
exports.testTraverse = nodeunit.testCase({
    "setUp": function (callback) {
        console.log("setting up");
        m = new Markov(["I like to know."], function() {
            console.log("Setup done");
            callback();
        });
    },
    "tearDown": function (callback) {
        callback();
    },
    "traverse test" : function (test) {
        console.log("starting test");
        m.traverse("I", 3, function(str) {
            test.equal(str, "I like to");
            test.done();
        });
    }
});

exports.cycleTraverse = nodeunit.testCase({
    "setUp": function (callback) {
        console.log("setting up");
        cycle = new Markov(["I know I"], function() {
            console.log("Setup done");
            callback();
        });
    },
    "tearDown": function (callback) {
        callback();
    },
    "traverse test" : function (test) {
        console.log("starting test");
        cycle.traverse("know", 9, function(str) {
            test.equal(str, "know I know I know I know I know");
            test.done();
        });
    }
});

exports.largeTraverse = nodeunit.testCase({
    "setUp": function (callback) {
        console.log("setting up");
        fs.readFile('../test.txt', function (err, data) {
            if (err) {
                throw err;
            }
            var words = data.toString().replace(/(\r\n|\n|\r)/gm," ");
            var word_arr = words.match(/[^\.!\?]+[\.!\?]+/g);
            large = new Markov(word_arr, function() {
                console.log("Setup done");
                callback();
            });
        });
    },
    "tearDown": function (callback) {
        callback();
    },
    "traverse test" : function (test) {
        console.log("starting test");
        large.traverse("I", null, function(str) {
            console.log(str);
            test.notEqual(str, "");
            test.done();
        });
        //test.equal(cycle.traverse("know",9), "know I know I know I know I know");
        //test.equal(cycle.traverse("know"), "know I know I know I know I know I know I know I know I know I know I");
        //setTimeout(function () {
        //    test.done();
        //}, 10);
    }
});

//module.exports = {

/*'test longer traverse' : function (test) {
 test.equal(mm.traverse("I",3), "I am a");
 setTimeout(function () {
 test.done();
 }, 10);
 },*/

/*'test large transverse' : function (test) {
 str = large.traverse("I");
 for (var i=0; i < 100; i++) {
 console.log(large.traverse("I"));
 }
 test.notEqual(str, "");
 setTimeout(function () {
 test.done();
 console.log(str);
 }, 10);
 },*/

/*'test large transverse' : function (test) {
 str = garden.traverse("I");
 for (var i=0; i < 100; i++) {
 console.log(garden.traverse("I"));
 }
 test.notEqual(str, "");
 setTimeout(function () {
 test.done();
 console.log(str);
 }, 10);
 }*/
//};