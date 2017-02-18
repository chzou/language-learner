var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ejs' });
});

router.post('/submitimage', function(req, res, next) {
  console.log(res);
});
module.exports = router;
