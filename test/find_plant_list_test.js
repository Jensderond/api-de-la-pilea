const mocha = require('mocha');
const it = mocha.it;
const describe = mocha.describe;
const beforeEach = mocha.beforeEach;
const assert = require('assert');
const Plant = require('../model/plant.model');
const PlantNickname = require('../model/plant-nickname.model');
const PlantList = require('../model/plant-list.model');
const User = require('../model/user.model');
const Room = require('../model/room.model');

describe('Creating plants in the database', () => {
    'use strict';
    let nicknameOne, nicknameTwo, pilea, today, plantListOne, plantListTwo, currentUser, roomLiving;
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
        roomLiving = new Room({ userObjectId: currentUser._id, name: 'Woonkamer', description: 'Kamer waar we tv kijken.' });
        plantListOne = new PlantList({ userObjectId: currentUser._id,
            plantObjectId: pilea._id, roomObjectId: roomLiving._id, lastWatered: today });
        plantListTwo = new PlantList({ userObjectId: currentUser._id,
            plantObjectId: pilea._id, roomObjectId: roomLiving._id, lastWatered: today });

        roomLiving.save()
            .then(() => {
                assert(!roomLiving.isNew);
            });
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

    it('Find all plants in a users plants list', (done) => {
        PlantList.find({ userObjectId: currentUser._id })
            .then((plantlist) => {
                assert(plantlist[0].plantObjectId.toString() === pilea._id.toString());
                assert(plantlist[1].plantObjectId.toString() === pilea._id.toString());
                done();
            });
    });

    it('Find plants by room name', (done) => {
        Room.findOne({ name: 'Woonkamer' })
            .then((roomsFound) => {
                PlantList.find({ roomObjectId: roomsFound._id })
                    .then((plantlist) => {
                        assert(plantlist[0].plantObjectId.toString() === pilea._id.toString());
                        assert(plantlist[1].plantObjectId.toString() === pilea._id.toString());
                        done();
                    });
            });
        
    });
});