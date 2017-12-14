var router = require('express').Router();
var mongodb = require('../config/mongo.db');
var driver = require('../config/neo4j.db');
var PlantList = require('../model/plant-list.model');
var session = driver.session();

router.route('/')
	.get((req, res, next) => {
		'use strict';
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
					newPlantList
						.save()
						.then((plantList) => {
							res.status(201).json(plantList);
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
		var plantList = [];
		session
			.run(
				'MATCH (pl:PlantList {listId:{idParamList}})-[:MADE_BY]->(u:Person {userId:{idParamPerson}})'+
				'RETURN pl.listId as id, pl.room as room',
				{ 
					idParamList: req.params.listId,
					idParamPerson: userObjectId
				}
			)
			.then((list) => {
				session.close();
				if ( list.records[0].get('id') !== null ) {
					plantList.push({
						_id: list.records[0].get('id'),
						room: list.records[0].get('room'),
						plants: []
					});
				}
				session
					.run(
						'MATCH(p:Plant)-[r:IS_IN]->(pl:PlantList {listId:{idParamList}}) '+
						'RETURN p.plantId as plantId, p.name as name, p.imagePath as imagePath, r.lastWatered as lastWatered',
						{ 
							idParamList: req.params.listId,
							idParamPerson: userObjectId
						}
					)
					.then((plants) => {
						var plantsInList = [];
						if (plants.records[0] !== undefined) {
							plants.records.forEach((rec) => {
								if ( rec._fields[0] !== null ){
									plantsInList.push({
										id: rec.get('plantId'),
										name: rec.get('name'),
										imagePath: rec.get('imagePath'),
										lastWatered: rec.get('lastWatered')
									});
								}
							});
						}
						plantList[0].plants = plantsInList;
						res.status(200).json(plantList[0]);
					})
					.catch(next);
			})
			.catch(next);
	})
	.put((req, res, next) => {
		'use strict';
		const today = new Date();
		const year = today.getUTCFullYear();
		const month = today.getUTCMonth() + 1; //months from 1-12
		const day = today.getUTCDate();
		const hour = today.getUTCHours() + 1;
		const minutes = today.getUTCMinutes();
		const newDate = year + '' + month + '' + day + '' + hour + '' + minutes;
		
		session
			.run(
				'MATCH(pl:PlantList), (p:Plant) WHERE pl.listId = {listParam} AND p.plantId = {plantParam} '+
				'CREATE(pl)<-[r:IS_IN {lastWatered: {dateParam}}]-(p)',
				{
					listParam: req.params.listId,
					plantParam: req.body.plantId,
					dateParam: newDate.toString()
				}
			)
			.then(() => {
				res.status(200).json({ updated: true });
			} )
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

router.route('/:listId/updateName')
	.put((req, res, next) => {
		'use strict';
		session
			.run(
				'MATCH(pl:PlantList) WHERE pl.listId = {listParam}'+
				'SET pl.room = {nameParam}',
				{
					listParam: req.params.listId,
					nameParam: req.body.name
				}
			)
			.then(() => {
				res.status(200).json({ updated: true });
			} )
			.catch(next);
	});

router.route('/:listId/:plantId')
	.put((req, res, next) => {
		'use strict';
		session
			.run(
				'MATCH(pl:PlantList), (p:Plant) WHERE pl.listId = {listParam} AND p.plantId = {plantParam} '+
				'CREATE(pl)<-[:IS_IN]-(p)',
				{
					listParam: req.params.listId,
					plantParam: req.body.plantId
				}
			)
			.then(() => {
				res.status(200).json({ updated: true })
			} )
			.catch(next);
	})
	.delete((req, res, next) => {
		'use strict';
		session
			.run(
				'MATCH(pl:PlantList)<-[r:IS_IN]-(p:Plant) WHERE pl.listId = {listParam} AND p.plantId = {plantParam} '+
				'DELETE r',
				{
					listParam: req.params.listId,
					plantParam: req.params.plantId
				}
			)
			.then(() => {
				res.status(200).json({ deleted: true });
			})
			.catch(next);
	});

router.route('/:listId/:plantId/watered')
	.put((req, res, next) => {
		'use strict';
		const today = new Date();
		const year = today.getUTCFullYear();
		const month = today.getUTCMonth() + 1; //months from 1-12
		const day = today.getUTCDate();
		const hour = today.getUTCHours() + 1;
		const minutes = today.getUTCMinutes();
		const newDate = year + '' + month + '' + day + '' + hour + '' + minutes;

		session
			.run(
				'MATCH(pl:PlantList)<-[r:IS_IN]-(p:Plant) ' +
				'WHERE pl.listId = {listParam} AND p.plantId = {plantParam} ' +
				'SET r.lastWatered = {dateParam}',
				{
					listParam: req.params.listId,
					plantParam: req.params.plantId,
					dateParam: newDate
				}
			)
			.then(() => {
				res.status(200).json({ updated: true });
			} )
			.catch(next);
	});
module.exports = router;
