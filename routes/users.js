var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

var User = require('../models/user');
const userViewPath = '../views/user';
/* GET users listing. */

var isAuthenticated = function(req,res,next) {
  if (req.session.userId) {
  	console.log('logged id');
  	// if userID == user._id
  	next();
  } else {
  	console.log('not logged in');
  	// redirect with data
  	res.render(`${userViewPath}/login`);
  }
};

var isOwnerOrAdmin = function(req,res,next) {
	if (req.session.userId) {
		User.findOne({_id: req.session.userId}).then((user) => {
			if (user.admin || user.username == req.params.username) {
				next();

			} else {
				throw new Error('nope');
			}
		}).catch((err) => {
			console.error(err);
			// res.send(404);
			res.send('not allowed');

		})
	}
}

router.get('/', function(req, res, next) {
	User.find({}).then((all_users) => {
		console.log('all user route', all_users);
		res.render(`${userViewPath}/index`, {all_users, title: "All Users"});
	})
});


// router.get('/add_sample', function(req,res,next) {
// 	var sampleUser = new User({
// 		username: 'sampleUser',
// 		password: 'samplePassword',
// 		admin: true
// 	});

// 	sampleUser.save().then((user) => {
// 		console.log('user added:', user);
// 	}).catch((err) => {
// 		console.error(err);
// 		res.send('wrong');
// 	})

// });



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
		    	req.session.userId = user._id;
					res.redirect('/');
		    } else {
		    	res.render(`${userViewPath}/login`, {username: username});
		    }

			});
	}).catch((err) => {
		console.log('no user found');
  	res.render(`${userViewPath}/login`);

	})
});

router.get('/logout', (req, res,next) => {
	if(req.session) {
		delete req.session.userId;
		res.redirect('/');
	} 
})


router.get('/:username', isAuthenticated ,(req, res, next) => {
	// only in this format so i get used to it
	var {username} = req.params;
	User.findOne({username: username}).then(() => {
		console.log(username);
		res.render(`${userViewPath}/edit`, {username, title: 'User'});
	}).catch((err) => {
		console.err(err);
	})
});

router.get('/edit/:username', isOwnerOrAdmin, (req,res,next) => {
	res.send('worked');
})

module.exports = router;
