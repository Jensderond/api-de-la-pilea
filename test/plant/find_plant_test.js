const assert = require('assert');
const mocha = require('mocha');
const beforeEach = mocha.beforeEach;
const describe = mocha.describe;
const it = mocha.it;
const Plant = require('../../model/plant.model');
const PlantFactory = require('../factories/plant.factory');

describe('Creating plants in the database', () => {
    'use strict';
    let pilea;
    beforeEach((done) => {
        // let lotsOfPlants = new Plant();
        // lotsOfPlants.
        // TODO: Add a list of plants.
        pilea = new Plant( PlantFactory.generate() );
        pilea.save()
            .then(() => {
                assert(!pilea.isNew);
                done();
            });
    });

    it('Find all plants by name', (done) => {
        Plant.find( { name: pilea.name } )
            .then((plants) => {
                assert(plants[0]._id.toString() === pilea._id.toString());
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