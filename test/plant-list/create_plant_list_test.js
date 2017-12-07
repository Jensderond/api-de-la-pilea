const assert = require('assert');
const mocha = require('mocha');
const describe = mocha.describe;
const beforeEach = mocha.beforeEach;
const it = mocha.it;
const Plant = require('../../model/plant.model');
const PlantList = require('../../model/plant-list.model');
const PlantFactory = require('../factories/plant.factory');
const User = require('../../model/user.model');

describe('Creating plants in the database', () => {
    'use strict';
    let pilea, currentUser, existingPlantList, today;
    beforeEach((done) => {
        today = new Date();
        currentUser = new User({ name: 'Jens de Rond', email: 'jens@roundtheweb.nl', password: 'password123', admin: false });
        pilea = new Plant( PlantFactory.generate() );
        existingPlantList = 
            new PlantList({ userObjectId: currentUser._id,
                plants: { _id: pilea._id, lastWatered: today }, 
                room: 'Badkamer' });
        existingPlantList.save()
            .then(() => {
            assert(!existingPlantList.isNew);
            })
        currentUser.save()
            .then(() => {
                assert(!currentUser.isNew);
            });
        pilea.save()
            .then(() => {
                assert(!pilea.isNew);
                done();
            });
    });

    it('Create a users plant list', (done) => {
        let newPlantlist = 
            new PlantList({ userObjectId: currentUser._id,
                plants: { }, 
                room: 'Woonkamer' });
        PlantList.create(newPlantlist)
            .then((plantList) => {
                assert(plantList._id.toString() === newPlantlist._id.toString());
                done();
            })
    });

    it('Add a plant to the PlantList', (done) => {
        let newPlant = new Plant( PlantFactory.generate() );
        
        PlantList.findOne( { _id: existingPlantList._id } )
            .then((pList) => {
                pList.plants.push({ _id: newPlant._id, lastWatered: today } );
                assert(pList.plants.length === 2)
                done();
            });
    });
});