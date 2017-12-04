const mocha = require('mocha');
const it = mocha.it;
const describe = mocha.describe;
const beforeEach = mocha.beforeEach;
const assert = require('assert');
const Plant = require('../model/plant.model');
const PlantNickname = require('../model/plant-nickname.model');
const PlantList = require('../model/plant-list.model');
const User = require('../model/user.model');

describe('Creating plants in the database', () => {
    'use strict';
    let nicknameOne, nicknameTwo, pilea, today, plantListOne, plantListTwo, currentUser;
    beforeEach((done) => {
        today = new Date();
        nicknameOne = new PlantNickname({ name: 'Pannekoekenplant' });
        nicknameTwo = new PlantNickname({ name: 'Money plant' });
        pilea = new Plant( { name: 'Pilea peperomioides',
            description: 'Pilea peperomioides heeft opvallend grote ronde bladeren',
            type: 'Kamerplant',
            origin: 'China',
            genus: 'Pilea',
            imagePath: 'https://upload.wikimedia.org/wikipedia' +
                        '/commons/5/5a/Pilea_peperomioides.jpg',
            sunLevel: 3,
            waterLevel: 2,
            nicknames: [
                nicknameOne,
                nicknameTwo
            ]
        } );
        currentUser = new User({ name: 'Jens de Rond' });
        plantListOne = new PlantList({ userObjectId: currentUser._id,
            plantObjectId: pilea._id, lastWatered: today.getDate() });
        plantListTwo = new PlantList({ userObjectId: currentUser._id,
            plantObjectId: pilea._id, lastWatered: today.getDate() });


        currentUser.save()
            .then(() => {
                assert(!currentUser.isNew);
            });
        nicknameOne.save()
            .then(() => {
                assert(!nicknameOne.isNew);
            });
        nicknameTwo.save()
            .then(() => {
                assert(!nicknameTwo.isNew);
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

    it('Find all plants by name in a users plants list', (done) => {
        PlantList.find({ userObjectId: currentUser._id })
            .then((plantlist) => {
                assert(plantlist[0].plantObjectId.toString() === pilea._id.toString());
                assert(plantlist[1].plantObjectId.toString() === pilea._id.toString());
                done();
            });
    });

    it('Find one plant by Id', (done) => {
        Plant.findOne( { _id: pilea._id } )
            .then((plant) => {
                assert(plant.name === pilea.name);
                done();
            });
    });
});