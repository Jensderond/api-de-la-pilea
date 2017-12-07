const assert = require('assert');
const mocha = require('mocha');
const describe = mocha.describe;
const beforeEach = mocha.beforeEach;
const it = mocha.it;
const Plant = require('../../model/plant.model');
const PlantList = require('../../model/plant-list.model');
const PlantFactory = require('../factories/plant.factory');
const PlantListFactory = require('../factories/plant-list.factory');
const User = require('../../model/user.model');

describe('Creating plants in the database', () => {
    'use strict';
    let currentUser, existingPlantList;
    beforeEach((done) => {
        currentUser = new User({ name: 'Jens de Rond', email: 'jens@roundtheweb.nl', password: 'password123', admin: false });
        existingPlantList = new PlantList( PlantListFactory.generate( currentUser ) );
        currentUser.save()
            .then(() => {
                assert(!currentUser.isNew);
            });
        existingPlantList.save()
            .then(() => {
                assert(!existingPlantList.isNew);
                done();
            });
    });

    it('Create a users plant list', (done) => {
        let newPlantlist = new PlantList(PlantListFactory.generate( currentUser ) );

        PlantList.create(newPlantlist)
            .then((plantList) => {
                assert(plantList._id.toString() === newPlantlist._id.toString());
                done();
            });
    });

    it('Add a plant to the PlantList', (done) => {
        let newPlant = new Plant( PlantFactory.generate() );
        let today = new Date();

        PlantList.findById( existingPlantList._id )
            .then((pList) => {
                pList.plants.push({ _id: newPlant._id, lastWatered: today } );
                assert(pList.plants.length === 2);
                done();
            });
    });
});