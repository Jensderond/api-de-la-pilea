var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongodb = require('./config/mongo.db');
var config = require('./config/env/env');
var jwt    = require('jsonwebtoken');
var app = express();
var User = require('./model/user.model');
require('dotenv').config({ path: './config/env/.env'});

if (!process.env.JWT_SECRET || !process.env.DATABASE) {
	throw 'Make sure you have JWT_SECRET, and DATABASE in your .env file';
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

app.use(logger('dev'));

app.use((req, res, next) => {
	'use strict';
	res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	res.setHeader('Access-Control-Allow-Credentials', true);

	if ('OPTIONS' === req.method) {
		res.sendStatus(200);
	}
	else {
		next();
	}
});


var mainRouter = express.Router();

mainRouter.post('/authenticate', function(req, res) {
		// find the user
		User.findOne({
			email: req.body.email,
			password: req.body.password
		}, function(err, user) {
	
			console.log('hi' + user);

			if (err) throw err;
			if (!user) {
				res.json({ success: false, message: 'Authentication failed. User not found.' });
			} else if (user) {
	
				// check if password matches
				if (user.password != req.body.password) {
					res.json({ success: false, message: 'Authentication failed. Wrong password.' });
				} else {
	
					// if user is found and password is right
					// create a token
					var payload = {
						name: user.name,
						email: user.email,
						admin: user.admin
					}
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
	
	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

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

app.use((err, req, res, next) => {
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
