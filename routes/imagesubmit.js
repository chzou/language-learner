var express = require('express');
var router = express.Router();


router.post('/submitimage', function(req, res, next){
	res.render('index', { title: 'ejs' });
});

module.exports = router;
