const mocha = require('mocha');
const it = mocha.it;
const describe = mocha.describe;
const beforeEach = mocha.beforeEach;
const assert = require('assert');
const Plant = require('../../model/plant.model');
const PlantFactory = require('../factories/plant.factory');
const PlantList = require('../../model/plant-list.model');
const User = require('../../model/user.model');

describe('Creating plants in the database', () => {
    'use strict';
    let pilea, today, plantListOne, plantListTwo, currentUser;
    beforeEach((done) => {
        today = new Date();
        pilea = new Plant( PlantFactory.generate() );
        currentUser = new User({ name: 'Jens de Rond', email: 'jens@roundtheweb.nl', password: 'password123', admin: false });
        plantListOne = new PlantList({ userObjectId: currentUser._id,
            plants: { _id: pilea._id, name: pilea.name, imagePath: pilea.imagePath },
             room: 'Woonkamer', lastWatered: today });

        plantListTwo = new PlantList({ userObjectId: currentUser._id,
            plants: { _id: pilea._id, name: pilea.name, imagePath: pilea.imagePath },
             room: 'Badkamer', lastWatered: today });
             
        currentUser.save()
            .then(() => {
                assert(!currentUser.isNew);
            });
        pilea.save()
            .then(() => {
                assert(!pilea.isNew);
            });
        plantListOne.save()
            .then(() => {
                assert(!plantListOne.isNew);
            });
        plantListTwo.save()
            .then(() => {
                assert(!plantListTwo.isNew);
                done();  
            });
    });

    it('Find all plants in a users plants list', (done) => {
        PlantList.find({ userObjectId: currentUser._id })
            .then((plantlist) => {
                assert(plantlist[0].plants[0].id === pilea._id.toString());
                done();
            });
    });

    it('Find plants by room name', (done) => {
        PlantList.findOne({ room: 'Woonkamer' })
            .then((plantlist) => {
                assert(plantlist._id.toString() === plantListOne._id.toString());
                done();
            });
    });
});