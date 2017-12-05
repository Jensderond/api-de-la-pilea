var router = require('express').Router();
var mongodb = require('../config/mongo.db');
var Plant = require('../model/plant.model');
const auth = require('../auth/authentication');


router.route('/')
	.get(auth(), (req, res, next) => {
		'use strict';
		Plant.find({})
			.then((plants) => {
				res.status(200).json(plants);
			})
			.catch(next);
	})
	.post(auth(), (req, res, next) => {
		'use strict';
		Plant.create(req.body)
			.then((newPlant) => {
				res.status(200).json(newPlant);
			})
			.catch(next);
	});

router.route('/:plantId')
	.get(auth(), (req, res, next) => {
		'use strict';
		Plant.findById( req.params.plantId )
			.then((plant) => {
				res.status(200).json(plant);
			})
			.catch(next);
	})
	.put(auth(), (req, res, next) => {
		'use strict';
		// var plant = new Plant(req.body);
		// plant.save()
		Plant.findByIdAndUpdate({ _id: req.params.plantId }, req.body)
			.exec()
			.then((plant) => {
				res.status(200).json(plant);
			})
			.catch(next);
	})
	.delete(auth(), (req, res, next) => {
		'use strict';
		Plant.remove({ _id: req.params.plantId}).exec()
			.then(() => {
				res.status(200).json({ deleted: true });
			})
			.catch(next);
	});

module.exports = router;