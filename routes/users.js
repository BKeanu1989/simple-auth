var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

var User = require('../models/user');
const userViewPath = '../views/user';
/* GET users listing. */
router.get('/', function(req, res, next) {
	User.find({}).then((all_users) => {
		console.log('all user route', all_users);
		res.render(`${userViewPath}/index`, {all_users, title: "All Users"});
	})
});

router.post('/add_sample', function(req,res,next) {
	var sampleUser = new User({
		username: 'sampleUser',
		password: 'samplePassword'
	});

	sampleUser.save().then((user) => {
		console.log('user added:', user);
	}).catch((err) => {
		console.error(err);
		res.send('wrong');
	})

});

router.get('/login', (req,res,next) => {
	res.render(`${userViewPath}/login`, {username:''});
})

router.post('/login', (req,res,next) => {
	var {username, password} = req.body;
	var hash;
	var findUser = User.findOne({username: username});
	findUser.then((user) => {
		hash = user.password;
			bcrypt.compare(password, hash).then(function(valid) {
    // valid == true
		    if (valid) {
		    	req.headers["test"] = 'test';
		    	console.log(user);
		    	console.log('matching passwords');
					res.redirect('/');

		    } else {
		    	res.render(`${userViewPath}/login`, {username});
		    }

			});
	}).catch((err) => {
		console.log('no user found');
	})
})

module.exports = router;
