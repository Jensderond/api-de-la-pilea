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
	.get((req, res, next) => {
		'use strict';
		PlantList.findById({ _id: req.params.listId})
			.then((list) => {
				res.status(200).json(list);
			})
			.catch(next);
	})
	.put((req, res, next) => {
		'use strict';
		PlantList.findByIdAndUpdate( { _id: req.params.listId }, req.body)
			.exec()
			.then(() => {
				res.status(200).json({ updated: true });
			})
			.catch(next);
	})
	.delete((req, res, next) => {
		'use strict';
		PlantList.findByIdAndRemove( { _id: req.params.listId } )
			.exec()
			.then(() => {
				res.status(200).json({ deleted: true });
			})
			.catch(next);
	});

router.route('/user/:userId')
	.get((req, res, next) => {
		'use strict';
		PlantList.find({ userObjectId: req.params.userId})
			.then((list) => {
				res.status(200).json(list);
			})
			.catch(next);
	});

module.exports = router;
