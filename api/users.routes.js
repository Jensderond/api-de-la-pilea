var router = require('express').Router();
var mongodb = require('../config/mongo.db');
var User = require('../model/user.model');


router.route('/')
	.get((req, res, next) => {
		'use strict';
		User.find({})
			.then((users) => {
				res.status(200).json(users);
			})
			.catch(next);
	});

router.route('/:userId')
	.get((req, res, next) => {
		'use strict';
		User.findById( req.params.userId )
			.then((user) => {
				res.status(200).json(user);
			})
			.catch(next);
	})
	.put((req, res, next) => {
		'use strict';
		User.findByIdAndUpdate({ _id: req.params.userId }, req.body)
			.exec()
			.then((user) => {
				res.status(200).json(user);
			})
			.catch(next);
	})
	.delete((req, res, next) => {
		'use strict';
		User.remove({ _id: req.params.userId}).exec()
			.then(() => {
				res.status(200).json({ deleted: true });
			})
			.catch(next);
	});

module.exports = router;