'use strict';
var router = require('express').Router();
var mongodb = require('../config/mongo.db');
var Plant = require('../model/plant.model');
var driver = require('../config/neo4j.db');
var session = driver.session();

router.route('/')
	.get((req, res, next) => {
		session
			.run(
				'MATCH(p:Plant)'+  
				'RETURN p.plantId as plantId, p.name as name, p.description as description, p.imagePath as imagePath'
			)
			.then((plants) => {
				session.close();
				var list = [];
				if ( plants.records[0] ) {
				if ( plants.records[0].get('plantId') !== null ){
						//do something
						plants.records.forEach((rec) => {
							if ( rec._fields[0] !== null ){
								list.push({
									_id: rec.get('plantId'),
									name: rec.get('name'),
									description: rec.get('description'),
									imagePath: rec.get('imagePath')
								});
							}
						});
					}
				}
				res.status(200).json(list);
				session.close();
			})
			.catch(next);
	})
	.post((req, res, next) => {
		var newPlant = new Plant(req.body);
		session
			.run(
				'CREATE(plant:Plant { '+ 
				'plantId: {idParam}, '+ 
				'name: {nameParam}, '+ 
				'description: {descParam}, '+ 
				'type: {typeParam}, '+ 
				'origin: {origParam}, '+ 
				'genus: {genuParam}, '+ 
				'imagePath: {imgParam}, '+ 
				'sunLevel: {sunParam}, '+  
				'waterLevel: {watParam} '+ 
				'})'+
				'RETURN plant.plantId as plantId',
				{
					idParam: newPlant.id,
					nameParam: newPlant.name,
					descParam: newPlant.description,
					typeParam: newPlant.type,
					origParam: newPlant.origin,
					genuParam: newPlant.genus,
					imgParam: newPlant.imagePath,
					sunParam: newPlant.sunLevel,
					watParam: newPlant.waterLevel
				}
			)
			.then((list) => {
				session.close();
				if ( list.records[0] !== null ){
					const plantId = list.records[0].get('plantId');
					for (var i = 0; i < newPlant.nicknames.length; i++ )
					{
						session
							.run(
								'MATCH(p) WHERE p.plantId = {idParam}' +
								'CREATE (p)<-[:NICKNAME_OF]-(n:Nickname { name: {nickParam} })',
								{
									idParam: plantId,
									nickParam: newPlant.nicknames[i].name
								}
							)
							.then( () => {
								session.close();
							})
							.catch(next);
					}
				}
			})
			.catch(next);
		newPlant.save()
			.then((newPlant) => {
				res.status(201).json(newPlant);
			})
			.catch(next);
	});
router.route('/favorites')
	.get((req, res, next) => {
		session
			.run(
				'MATCH(p:Plant)-[:IS_IN]->(pl:PlantList) '+
				'RETURN p.plantId as plantId, p.name as name, p.description as description, '+
				'p.imagePath as imagePath, COUNT(p) as score '+  
				'ORDER BY score DESC LIMIT 5'
			)
			.then((plants) => {
				session.close();
				var list = [];
				if ( plants.records[0] ) {
					if ( plants.records[0].get('plantId') !== null ){
						plants.records.forEach((rec) => {
							if ( rec._fields[0] !== null ){
								list.push({
									_id: rec.get('plantId'),
									name: rec.get('name'),
									description: rec.get('description'),
									imagePath: rec.get('imagePath')
								});
							}
						});
					}
				}
				console.log('Hi '+ list);
				res.status(200).json(list);
			})
			.catch(next);
	});

router.route('/:plantId')
	.get((req, res, next) => {
		const plantId = req.params.plantId;
		var plant;
		session
			.run(
				'MATCH (p:Plant { plantId: {idParam} } )'+
				'RETURN p.plantId as plantId, p.name as name, p.description as description, p.type as type, p.origin as origin, p.genus as genus, ' +
				'p.imagePath as imagePath, p.sunLevel as sunLevel, p.waterLevel as waterLevel',
				{ 
					idParam: plantId
				}
			)
			.then((list) => {
				session.close();
				if ( list.records[0] ) {
					if ( list.records[0].get('plantId') !== null ){
						plant = {
							_id: list.records[0].get('plantId'),
							name: list.records[0].get('name'),
							description: list.records[0].get('description'),
							type: list.records[0].get('type'),
							origin: list.records[0].get('origin'),
							genus: list.records[0].get('genus'),
							imagePath: list.records[0].get('imagePath'),
							sunLevel: list.records[0].get('sunLevel'),
							waterLevel: list.records[0].get('waterLevel'),
							nicknames: []
						};
					}
				}
				session
					.run(
						'MATCH (n:Nickname)-[:NICKNAME_OF]->(p:Plant { plantId: {idParam} }) '+
						'RETURN p.plantId as plantId, n.name as nickname',
						{
							idParam: plantId
						}
					)
					.then((nicknames) => {
						session.close();
						var nicknameList = [];
						if ( nicknames.records[0] !== undefined ) {
							if ( nicknames.records[0].get( 'plantId' ) !== null ) {
								nicknames.records.forEach( (rec) => {
									nicknameList.push({
										name: rec.get('nickname')
									});
								});
							}
						}
						//Set nicknames if there are any found
						if ( plant !== undefined ) {
							plant.nicknames = nicknameList;
						}
						//Return the plant with all the info
						res.status(200).json(plant);
					})
					.catch(next);
			})
			.catch(next);
	})
	.put((req, res, next) => {
		Plant.findByIdAndUpdate({ _id: req.params.plantId }, req.body)
			.exec()
			.then(() => Plant.findById({ _id: req.params.plantId }))
			.then((plant) => {
				res.status(200).json(plant);
			})
			.catch(next);
	})
	.delete((req, res, next) => {
		session
			.run(
				'MATCH(p:Plant) WHERE p.plantId = {idParam} '+
				'DETACH DELETE p',
				{
					idParam: req.params.plantId
				}
			)
			.then()
			.catch(next);
		Plant.findByIdAndRemove({ _id: req.params.plantId})
			.exec()
			.then(() => {
				res.status(200).json({ deleted: true });
			})
			.catch(next);
	});

module.exports = router;