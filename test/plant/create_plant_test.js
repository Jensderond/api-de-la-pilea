const mocha = require('mocha');
const it = mocha.it;
const describe = mocha.describe;
const beforeEach = mocha.beforeEach;
const assert = require('assert');
const Plant = require('../../model/plant.model');
const PlantFactory = require('../factories/plant.factory');

describe('Creating plants in the database', () => {

    it('Saves a plant', (done) => {
        let pilea = new Plant(PlantFactory.generate());
        pilea.save()
            .then(() => {
                assert(!pilea.isNew);
                done();
            });
    });
});