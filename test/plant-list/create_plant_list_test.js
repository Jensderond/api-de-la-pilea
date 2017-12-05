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
    let pilea, currentUser;
    beforeEach((done) => {
        currentUser = new User({ name: 'Jens de Rond' });
        pilea = new Plant( PlantFactory.generate() );
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

    it('Saves a plant to the users plantlist', (done) => {
        let today = new Date();
        let newPlantlist = 
            new PlantList({ userObjectId: currentUser._id,
                plant: { _id: pilea._id, name: pilea.name, imagePath: pilea.imagePath }, room: 'Woonkamer', lastWatered: today });

        newPlantlist.save()
            .then(() => {
              assert(!newPlantlist.isNew);
              done();  
            });
    });
});