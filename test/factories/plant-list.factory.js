var faker = require('faker');
const PlantFactory = require('../factories/plant.factory');
const Plant = require('../../model/plant.model');
faker.locale = 'nl';

class PlantListFactory {
  generate(attrs) {
    let plant = new Plant( PlantFactory.generate() );
    return Object.assign({}, {
        userObjectId: attrs._id,
        plants: [
            { _id: plant._id, lastWatered: '2017-10-10' }
        ],
        room: 'Badkamer'
    }, attrs);
  }
}

module.exports = new PlantListFactory();