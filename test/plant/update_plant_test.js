const assert = require('assert');
const mocha = require('mocha');
const beforeEach = mocha.beforeEach;
const describe = mocha.describe;
const it = mocha.it;
const Plant = require('../../model/plant.model');
const PlantFactory = require('../factories/plant.factory');

describe('Update plants in the database', () => {
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

    it('Find one plant by Id and update the name', (done) => {
        pilea.name = "Boterbloem";
        Plant.findByIdAndUpdate( { _id: pilea._id }, pilea )
            .exec()
            .then(() => Plant.findById({ _id: pilea._id }))
            .then((plant) => {
                assert(plant.name === pilea.name);
                done();
            });
    });


});