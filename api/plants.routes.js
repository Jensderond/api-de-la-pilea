var router = require('express').Router();
var mongodb = require('../config/mongo.db');
var Plant = require('../model/plant.model');


router.route('/')
	.get((req, res, next) => {
		'use strict';
		Plant.find({})
			.then((plants) => {
				res.status(200).json(plants);
			})
			.catch(next);
	})
	.post((req, res, next) => {
		'use strict';
		Plant.create(req.body)
			.then((newPlant) => {
				res.status(200).json(newPlant);
			})
			.catch(next);
	});

router.route('/:plantId')
	.get((req, res, next) => {
		'use strict';
		Plant.findById( req.params.plantId )
			.then((plant) => {
				res.status(200).json(plant);
			})
			.catch(next);
	})
	.put((req, res, next) => {
		'use strict';
		Plant.findByIdAndUpdate({ _id: req.params.plantId }, req.body)
			.exec()
			.then(() => Plant.findById({ _id: req.params.plantId }))
			.then((plant) => {
				res.status(200).json(plant);
			})
			.catch(next);
	})
	.delete((req, res, next) => {
		'use strict';
		Plant.remove({ _id: req.params.plantId})
			.exec()
			.then(() => {
				res.status(200).json({ deleted: true });
			})
			.catch(next);
	});

module.exports = router;