var router = require('express').Router();
var mongodb = require('../config/mongo.db');
var Plant = require('../model/plant.model');
const auth = require('../auth/authentication');


router.route('/')
	.get(auth(), (req, res, next) => {
		'use strict';
		console.log('something');
		Plant.find({})
			.then((plants) => {
				console.log(plants);
				res.status(200).json(plants);
			})
			.catch(next);
	})
	.post((req, res, next) => {
		'use strict';
		var plant = new Plant(req.body);
		plant.save()
			.then((newPlant) => {
				res.status(200).json(newPlant);
			})
			.catch(next);
	});

module.exports = router;