const mocha = require('mocha');
const it = mocha.it;
const describe = mocha.describe;
const beforeEach = mocha.beforeEach;
const assert = require('assert');
const Plant = require('../model/plant.model');
const Nickname = require('../model/nickname.model');

describe('Creating plants in the database', () => {
    'use strict';
    let nicknameOne, nicknameTwo, plant;
    beforeEach((done) => {
        nicknameOne = new Nickname({ name: 'Pannekoekenplant' });
        nicknameTwo = new Nickname({ name: 'Money plant' });
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
        plant = 
            new Plant( { name: 'Pilea peperomioides',
                description: 'Pilea peperomioides heeft opvallend grote ronde bladeren ',
                type: 'Kamerplant',
                origin: 'China',
                genus: 'Pilea',
                imagePath: 'https://upload.wikimedia.org/wikipedia' +
                            '/commons/5/5a/Pilea_peperomioides.jpg',
                nicknames: [
                    nicknameOne,
                    nicknameTwo
                ]
            } );
        plant.save()
            .then(() => {
                assert(!plant.isNew);
                done();
            });
    });
});