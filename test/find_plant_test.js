const mocha = require('mocha');
const it = mocha.it;
const describe = mocha.describe;
const beforeEach = mocha.beforeEach;
const assert = require('assert');
const Plant = require('../model/plant.model');
const Nickname = require('../model/nickname.model');

describe('Creating plants in the database', () => {
    'use strict';
    let nicknameOne, nicknameTwo, pilea;
    beforeEach((done) => {
        nicknameOne = new Nickname({ name: 'Pannekoekenplant' });
        nicknameTwo = new Nickname({ name: 'Money plant' });
        pilea = new Plant( { name: 'Pilea peperomioides',
            description: 'Pilea peperomioides heeft opvallend grote ronde bladeren',
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

    it('Find all plants by name', (done) => {
        Plant.find( { name: 'Pilea peperomioides' } )
            .then((plants) => {
                assert(plants[0]._id.toString() === pilea._id.toString())
                done();
            });
    });

    it('Find one plant by Id', (done) => {
        Plant.findOne( { _id: pilea._id } )
            .then((plant) => {
                assert(plant.name === pilea.name)
                done();
            });
    });
});