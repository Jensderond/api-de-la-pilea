var router = require("express").Router();
var mongodb = require("../config/mongo.db");
var Recipe = require("../model/recipe.model");

router.route("/")
	.get((req, res, next) => {
		Recipe.find({})
			.then((recipes) => {
				res.status(200).json(recipes);
			})
			.catch(next);
	})
	.post((req, res, next) => {
		var recipe = new Recipe(req.body).save()
		.then((recipe) => {
			res.status(200).json(recipe);
		})
		.catch(next);
	});

router.route("/:recipeId")
	.get((req, res, next) => {
		Recipe.findById(req.params.recipeId)
			.then((recipe) => {
				res.json(recipe);
			})
			.catch(next);
	})
	.put((req, res, next) => {
		Recipe.findOneAndUpdate({ _id: req.params.recipeId }, req.body)
			.exec()
			.then((recipe) => {
				res.json(recipe);
			})
			.catch(next);
	})
	.delete((req, res, next) => {
		Recipe.remove({ _id: req.params.recipeId }).exec()
			.then(() => {
				res.json({ deleted: true });
			})
	});

router.route("/:recipeId/favorite")
	.put((req, res, next) => {
		Recipe.findByIdAndUpdate( { _id: req.params.recipeId }, { favorite: true })
			.exec()
			.then((recipe) => {
				res.json(recipe);
			})
			.catch(next);
	})
	.delete((req, res, next) => {
		Recipe.findByIdAndUpdate( { _id: req.params.recipeId }, { favorite: false })
			.exec()
			.then((recipe) => {
				res.json(recipe);
			})
			.catch(next);
	});

module.exports = router;