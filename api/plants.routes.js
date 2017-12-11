var router = require('express').Router();
var mongodb = require('../config/mongo.db');
var Plant = require('../model/plant.model');


router.route('/')
	.get((req, res, next) => {
		'use strict';
		session
			.run(
				'MATCH(p:Plant)'+  
				'RETURN p.plantId as plantId, p.name as name, p.type as type, p.origin as origin, p.genus as genus, ' +
				'p.imagePath as imagePath, p.sunLevel as sunLevel, p.waterLevel as waterLevel'
			)
			.then((plants) => {
				session.close();
				var list = [];
				if ( plants.records[0].get('plantId') !== null ){
					//do something
					plants.records.forEach((rec) => {
						if ( rec._fields[0] !== null ){
							plantLists.push({
								_id: rec.get('plantId'),
								name: rec.get('name'),
								type: rec.get('type'),
								origin: rec.get('origin'),
								imagePath: rec.get('imagePath'),
								sunLevel: rec.get('sunLevel'),
								waterLevel: rec.get('waterLevel')
							});
						}
					});
				}
				
				console.log(plantLists);
				res.status(200).json(plantLists);
				session.close();
			})
			.catch(function(error){
				console.log(error);
			});
		Plant.find({})
			.then((plants) => {
				res.status(200).json(plants);
			})
			.catch(next);
	})
	.post((req, res, next) => {
		'use strict';
		var newPlant = new Plant();
		session
			.run(
				'CREATE(plant:Plant { '+ 
				'name: {nameParam}, '+ 
				'description: {descParam}, '+ 
				'type: {typeParam}, '+ 
				'origin: {origParam}, '+ 
				'genus: {genuParam}, '+ 
				'imagePath: {imgParam}, '+ 
				'sunLevel: {sunParam} '+  
				'waterLevel: {watParam} '+ 
				'})'+
				'FOREACH( '+
					'nickname in {nickNamesArrayParam} |' +
					'CREATE(plant)<-[:NICKNAME]-(n:Nickname {name:{nickParam}})' +
					')'+
				'RETURN plant',
				{
					nameParam: newPlantList.id,
					descParam: newPlantList.id,
					typeParam: newPlantList.id,
					origParam: newPlantList.id,
					genuParam: newPlantList.id,
					imgParam: newPlantList.id,
					sunParam: newPlantList.id,
					watParam: newPlantList.id,
					nickNamesArrayParam: newPlantList.nicknames,
				}
			)
			.then((list) => {
				session.close();
				if ( list.records[0].get('listId') !== null ){
					//do something
				}
			})
			.catch(function(error){
				console.log(error);
			});
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