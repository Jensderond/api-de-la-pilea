var router = require('express').Router();
var mongodb = require('../config/mongo.db');
var PlantList = require('../model/plant-list.model');

router.route('/')
	.get((req, res, next) => {
		'use strict';
		PlantList.find({})
			.then((plantList) => {
				res.status(200).json(plantList);
			})
			.catch(next);
	})
	.post((req, res, next) => {
		'use strict';
		PlantList.create(req.body)
			.then((plantList) => {
				res.status(200).json(plantList);
			})
			.catch(next);
	});

router.route('/:listId')
	.put((req, res, next) => {
		'use strict';
		PlantList.findByIdAndUpdate( { _id: req.params.itemId }, req.body)
			.exec()
			.then((plantList) => {
				res.json(plantList);
			})
			.catch(next);
	})
	.delete((req, res, next) => {
		'use strict';
		PlantList.findByIdAndRemove( { _id: req.params.itemId } )
			.exec()
			.then(() => {
				res.status(200).json({ deleted: true });
			})
			.catch(next);
	});

module.exports = router;
