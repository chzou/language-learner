var express = require('express');
var router = express.Router();
var controller = require("./classifier.js")
var app = express();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'ejs' });
});

router.post('/submitimage', controller.data);
module.exports = router;
