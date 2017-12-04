const mocha = require('mocha');
const it = mocha.it;
const describe = mocha.describe;
const beforeEach = mocha.beforeEach;
const assert = require('assert');
const Plant = require('../model/plant.model');
const PlantNickname = require('../model/plant-nickname.model');
const User = require('../model/user.model');
const PlantList = require('../model/plant-list.model');
const Room = require('../model/room.model');

describe('Creating plants in the database', () => {
    'use strict';
    let nicknameOne, nicknameTwo, pilea, currentUser, roomLiving;
    beforeEach((done) => {
        currentUser = new User({ name: 'Jens de Rond' });
        roomLiving = new Room({ userObjectId: currentUser._id, name: 'Woonkamer', description: 'Kamer waar we tv kijken.' });
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
                done();
            });
    });

    it('Saves a plant to the users plantlist', (done) => {
        let today = new Date();
        let newPlantlist = 
            new PlantList({ userObjectId: currentUser._id,
                plantObjectId: pilea._id, roomObjectId: roomLiving._id, lastWatered: today });

        newPlantlist.save()
            .then(() => {
              assert(!newPlantlist.isNew);
              done();  
            });
    });
});