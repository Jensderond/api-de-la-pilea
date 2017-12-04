var router = require("express").Router();
var mongodb = require("../config/mongo.db");
var Recipe = require("../model/recipe.model");

router.route("/")
	.get((req, res, next) => {
		Recipe.find({ favorite: true })
			.then((recipes) => {
				res.status(200).json(recipes);
			})
			.catch(next);
	});

module.exports = router;