var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req);
	console.log("req params:", req.params);
	var {notAllowed} = req.query || '';
	console.log(notAllowed);
  res.render('index', { title: 'Express', notAllowed });
});


module.exports = router;
