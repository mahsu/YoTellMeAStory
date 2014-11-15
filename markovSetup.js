var express = require('express');
var router = express.Router();

router.get('/:name', function(req, res) {
    var name = req.param("name");
    //res.send(convert(name));
});

module.exports = router;