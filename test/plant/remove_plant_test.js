const assert = require('assert');
const mocha = require('mocha');
const beforeEach = mocha.beforeEach;
const describe = mocha.describe;
const it = mocha.it;
const Plant = require('../../model/plant.model');
const PlantFactory = require('../factories/plant.factory');

describe('Remove plants from the database', () => {
    'use strict';
    let pilea;
    beforeEach((done) => {
        pilea = new Plant( PlantFactory.generate() );
        pilea.save()
            .then(() => {
                assert(!pilea.isNew);
                done();
            });
    });

    it('Find and remove a plant by ID', (done) => {
        Plant.findByIdAndRemove( { _id: pilea._id } )
            .then(() => Plant.findById( pilea._id ))
            .then((plant) => {
                assert(plant === null);
                done();
            });
    });

});