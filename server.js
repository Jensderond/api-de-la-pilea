var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongodb = require('./config/mongo.db');
var config = require('./config/env/env');
var jwt    = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var app = express();
var User = require('./model/user.model');
require('dotenv').config();

if (!process.env.JWT_SECRET || !process.env.DATABASE || !process.env.SALT_ROUNDS) {
	throw 'Make sure you have JWT_SECRET, SALT_ROUNDS and DATABASE in your .env file';
}

module.exports = {};

app.use(bodyParser.urlencoded({
	extended: 'false'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
	type: 'application/vnd.api+json'
}));

app.set('port', (process.env.PORT || config.env.webPort));
app.set('env', (process.env.ENV || 'development'));
app.set('secretJwt', process.env.JWT_SECRET);
const saltRounds = 10;

app.use(logger('dev'));

app.use((req, res, next) => {
	'use strict';
	res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,' +
													'Content-Type,X-Access-Token');
	res.setHeader('Access-Control-Allow-Credentials', true);

	if ('OPTIONS' === req.method) {
		res.sendStatus(200);
	}
	else {
		next();
	}
});


var mainRouter = express.Router();

mainRouter.post('/register', (req, res, next) => {
	'use strict';
	var salt = bcrypt.genSaltSync(saltRounds);
	var hash = bcrypt.hashSync(req.body._password, salt);
	
	let user = new User({
		name: req.body._name,
		email: req.body._email,
		password: hash,
		admin: false,
		age: req.body._age
	});
	User.findOne({ email: user.email })
		.then((usersFound) => {
			if ( usersFound === null ) {
				User.create(user)
				.then((newUser) => {
					res.status(200).json(newUser);
				})
				.catch(next);
			}
			else {
				res.status(403).json({ 
					success: false, 
					message: 'User with this email already exists'
				});
			}
		});
});

mainRouter.post('/authenticate', function(req, res) {
		// find the user
		'use strict';
		console.log(req.body);
		User.findOne({
			email: req.body.email,
		}, function(err, user) {

			if (err) throw err;
			if (!user) {
				res.status(403).json({ success: false, message: 'Authentication failed. User not found.' });
			} else if (user) {
	
				// check if password matches
				if (!bcrypt.compareSync(req.body.password, user.password)) {
					res.status(403).json({ success: false, message: 'Authentication failed. Wrong password.' });
				} else {
	
					// if user is found and password is right
					// create a token
					var payload = {
						name: user.name,
						email: user.email,
						admin: user.admin,
						userId: user._id,
						age: user.age
					};
					var token = jwt.sign(payload, app.get('secretJwt'), {
						expiresIn: 86400 // expires in 24 hours
					});
	
					res.json({
						success: true,
						message: 'Enjoy your token!',
						token: token
					});
				}

			}
	
	});
});

mainRouter.use(function(req, res, next) {
	'use strict';
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.params.token || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('secretJwt'), function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
		
	}
	
});

mainRouter.use('/plants', require('./api/plants.routes'));
mainRouter.use('/users', require('./api/users.routes'));
mainRouter.use('/plant-list', require('./api/plant-list.routes'));

app.use('/api', mainRouter);

app.use((err, req, res) => {
	'use strict';
	var error = {
		message: err.message,
		code: err.code,
		name: err.name,
		status: err.status
	};

	res.status(401).send(error);
});

app.use('*', (req, res) => {
	'use strict';
	res.status(404);
	res.json({
		'error': 'Deze URL is niet beschikbaar.'
	});
});

app.listen(app.get('port'), () => {
	'use strict';
	console.log('Server is listining on ' + app.get('port'));
	console.log('See http://localhost:'+ app.get('port') + '/plants');
});


module.exports = app;
