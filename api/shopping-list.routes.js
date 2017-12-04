var router = require("express").Router();
var mongodb = require("../config/mongo.db");
var ShoppingList = require("../model/shopping-list.model");

router.route("/")
	.get((req, res, next) => {
		ShoppingList.find({})
			.then((shoppingList) => {
				res.status(200).json(shoppingList);
			})
			.catch(next);
	})
	.post((req, res, next) => {
		ShoppingList.insertMany(req.body)
		.then((shoppingList) => {
			res.status(200).json(shoppingList);
		})
		.catch(next);
	});

router.route("/:itemId")
	.put((req, res, next) => {
		ShoppingList.findByIdAndUpdate( { _id: req.params.itemId }, req.body)
			.exec()
			.then((shoppingList) => {
				res.json(shoppingList);
			})
			.catch(next);
	})
	.delete((req, res, next) => {
		ShoppingList.findByIdAndRemove( { _id: req.params.itemId } )
			.exec()
			.then((shoppingList) => {
				res.status(200);
			})
			.catch(next);
	});

module.exports = router;
