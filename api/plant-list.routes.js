var router = require('express').Router();
var mongodb = require('../config/mongo.db');
var driver = require('../config/neo4j.db');
var PlantList = require('../model/plant-list.model');
var session = driver.session();

router.route('/')
	.get((req, res, next) => {
		'use strict';
		var session = driver.session();
		const userObjectId = req.decoded.userId;
		session
			.run(
				'MATCH (pl:PlantList)-[:MADE_BY]->(u:Person {userId:{idParam}}) '+
				'RETURN pl.listId as _id, pl.room as room',
				{ idParam: userObjectId }
			)
			.then((lists) => {
				var plantLists = [];
				lists.records.forEach((rec) => {
					if ( rec._fields[0] !== null ){
						plantLists.push({
							_id: rec.get('_id'),
							room: rec.get('room')
						});
					}
				});
				console.log(plantLists);
				res.status(200).json(plantLists);
				session.close();
			})
			.catch(next);
	})
	.post((req, res, next) => {
		'use strict';
		const newPlantList = new PlantList();
		newPlantList.room = req.body.room;
		newPlantList.userObjectId = req.body.userObjectId;
		console.log(newPlantList.room);
		console.log(newPlantList.userObjectId);
		console.log(newPlantList.id);
		session
			.run(
				'MATCH(user:Person)'+
				'WHERE user.userId = {userParam}'+
				'CREATE(user)<-[r:MADE_BY]-(pl:PlantList {listId: {idParam}, room: {roomParam}})'+
				'RETURN pl.listId as listId, pl.room as room',
				{
					userParam: newPlantList.userObjectId.toString(),
					idParam: newPlantList.id,
					roomParam: newPlantList.room,
				}
			)
			.then((list) => {
				session.close();
				if ( list.records[0].get('listId') !== null ){
					PlantList.create(req.body)
						.then((plantList) => {
							res.status(200).json(plantList);
						})
						.catch(next);
				}
			})
			.catch(function(error){
				console.log(error);
			});
	});

router.route('/:listId')
	.get((req, res, next) => {
		'use strict';

		const userObjectId = req.decoded.userId;
		const listId = req.params.listId;
		console.log(listId);
		session
			.run(
				'MATCH (pl:PlantList {listId:{idParamList}})-[:MADE_BY]->(u:Person {userId:{idParamPerson}})'+
				'RETURN pl.listId as id, pl.room as room',
				{ idParamList: req.params.listId, idParamPerson: userObjectId }
			)
			.then((list) => {
				var plantList = [];
				if ( list.records[0].get('id') !== null ){
					plantList.push({
						_id: list.records[0].get('id'),
						room: list.records[0].get('room')
					});
				}
				res.status(200).json(plantList[0]);
				session.close();
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

		session
			.run(
				'MATCH(pl:PlantList) WHERE pl.listId = {listParam} '+
				'DETACH DELETE pl',
				{
					listParam: req.params.listId
				}
			)
			.then()
			.catch(next);
		PlantList.findByIdAndRemove( { _id: req.params.listId } )
			.exec()
			.then(() => {
				res.status(200).json({ deleted: true });
			})
			.catch(next);
	});

module.exports = router;
