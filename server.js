var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongodb = require('./config/mongo.db');
var config = require('./config/env/env');
var cors = require('cors');
var app = express();
require('dotenv').config({ path: './config/env/.env'});

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
	throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file';
}

module.exports = {};

app.use(cors());

app.use(bodyParser.urlencoded({
	extended: 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
	type: 'application/vnd.api+json'
}));

app.set('port', (process.env.PORT || config.env.webPort));
app.set('env', (process.env.ENV || 'development'));

app.use(logger('dev'));

app.use((req, res, next) => {
	'use strict';
	res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	next();
});

app.use('/plants', require('./api/plants.routes'));
// app.use('/favorites', require('./api/favorites.routes'));
app.use('/plant-list', require('./api/plant-list.routes'));

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
