$(document).ready(function () {
    var socket = io();

    window.queue = [];
    socket.on('data', function (data) {
        if (calcDistance(window.loc, data.loc) <= window.radius) {
            var user = data.username;
            data = data.sentence;
            window.queue.push(data.sentence);
            $('#user-container').append("<li href='#'>" + user + "</li>");
        }
    });

    window.canWrite = true;

    setInterval(function () {
        if (window.canWrite) {
            var new_sentence = window.queue.shift();
            if (typeof new_sentence !== "undefined") {
                window.canWrite = false;
                insertSentence(new_sentence);
            }
        }
    }, 100);

    //always scrpll to bottom
    function scrollBottom() {
        $("html, body").animate({scrollTop: $(document).height()}, "fast");
    }

    setInterval(scrollBottom, 750);

    /*var colors = ["#00CC99", "#FFD119","#000066","#33CC33","#0066FF","#990099"];
     var colIndex = 0;*/


    var insertSentence = function (sentence) {
        var space = sentence.indexOf(" ");
        var uname = sentence.substring(0, space).toUpperCase();
        var phrase = sentence.substring(space, sentence.length);
        phrase = phrase + "  ";

        var el = $("#putIn");
        var name = "name" + parseInt(Math.random() * 10000000);
        var sent = "sent" + parseInt(Math.random() * 10000000);
        el.append("<a id ='user'><span id='" + name + "'></span></a>");
        addWord(uname.toUpperCase(), name);

        el.append("<a id ='nonUser'><span id='" + sent + "'></span></a>");
        setTimeout(function () {
            addWords(" " + phrase, sent);
        }, 2000);
    };

    function addWord(finalWords, id) {
        $("#" + id).typed({
            strings: [finalWords],
            typeSpeed: 20,
            backSpeed: 0,
            startDelay: 0,
            backDelay: 0,
            callback: function () {
                /*setTimeout(function() {
                 $('.typed-cursor').css('visibility', 'hidden');
                 }, 3000)*/
            }
        });
    }

    function addWords(finalWords, id) {
        $("#" + id).typed({
            strings: [finalWords],
            typeSpeed: 20,
            backSpeed: 50,
            startDelay: 0,
            backDelay: 2000,
            callback: function () {
                setTimeout(function () {
                    $('.typed-cursor').css('visibility', 'hidden');
                }, 3000);
                window.canWrite = true;
            }
        });
    }

    window.loc = [0, 0]; //lat, lon
    window.accuracy = 0; //+/- meters
    window.radius = 1000;

    var geoOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function geoSuccess(pos) {
        var crd = pos.coords;
        window.loc = [crd.latitude, crd.longitude];
        console.log(window.loc);
        window.accuracy = crd.accuracy;

        $.ajax({
            url: "/location",
            data: {'lat': window.loc[0], 'lon': window.loc[1]},
            type: "get",
            success: function (data) {
                console.log(data);
                if (data.length > 0) {
                    for (var i = data.length - 1; i >= 0; i--) {
                        var yloc = data[i].loc;
                        var yrelatedword = data[i].relatedword;
                        var sentence = data[i].sentence;
                        var username = data[i].username;
                        if (calcDistance(window.loc, yloc) <= window.radius && sentence != "") {
                            console.log(sentence);
                            window.queue.push(data[i].sentence);
                        }
                    }
                }
            }
        });

    }

    function geoError(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
    }

    if (navigator.geolocation.getCurrentPosition)
        navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);


    function calcDistance(loc1, loc2) {
        var lat1 = loc1[0];
        var lon1 = loc1[1];
        var lat2 = loc2[0];
        var lon2 = loc2[1];
        var R = 6371; // km
        var angle1 = lat1 * Math.PI / 180;
        var angle2 = lat2 * Math.PI / 180;

        var deltaAngle = (lat2 - lat1) * Math.PI / 180;
        var deltaLong = (lon2 - lon1) * Math.PI / 180;

        var a = Math.sin(deltaAngle / 2) * Math.sin(deltaAngle / 2) +
            Math.cos(angle1) * Math.cos(angle2) *
            Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

}());

$("#menu-toggle").click(function (e) {
    e.preventDefault();
    $('#wrapper').toggleClass("toggled");
});

$('#menuToggle, .menu-close').on('click', function () {
    $('#menuToggle').toggleClass('active');
    $('body').toggleClass('body-push-toleft');
    $('#theMenu').toggleClass('menu-open');
});


(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    i[r] = i[r] || function () {
        (i[r].q = i[r].q || []).push(arguments)
    }, i[r].l = 1 * new Date();
    a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA-56798911-1', 'auto');
ga('send', 'pageview');
