const mocha = require('mocha');
const it = mocha.it;
const describe = mocha.describe;
const beforeEach = mocha.beforeEach;
const assert = require('assert');
const Plant = require('../model/plant.model');
const PlantNickname = require('../model/plant-nickname.model');

describe('Creating plants in the database', () => {
    'use strict';
    let nicknameOne, nicknameTwo, pilea;
    beforeEach((done) => {
        nicknameOne = new PlantNickname({ name: 'Pannekoekenplant' });
        nicknameTwo = new PlantNickname({ name: 'Money plant' });
        nicknameOne.save()
            .then(() => {
                assert(!nicknameOne.isNew);
            });
        nicknameTwo.save()
            .then(() => {
                assert(!nicknameTwo.isNew);
                done();
            });
    });

    it('Saves a plant', (done) => {
        pilea = 
            new Plant( { name: 'Pilea peperomioides',
                description: 'Pilea peperomioides heeft opvallend grote ronde bladeren ',
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
        pilea.save()
            .then(() => {
                assert(!pilea.isNew);
                done();
            });
    });
});