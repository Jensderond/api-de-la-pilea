var faker = require('faker');
faker.locale = 'nl';

class PlantFactory {
  generateList(count, attrs = {}) {
    let list = []
    while(count) {
      list.push(this.generate(attrs));
      count--;
    }
    return list;
  }

  generate(attrs) {
    return Object.assign({}, {
        name: faker.name.firstName(),
        type: faker.name.jobTitle(),
        origin: faker.random.locale(),
        genus: faker.hacker.verb(),
        imagePath: faker.image.nature(),
        sunLevel: faker.random.number(10),
        waterLevel: faker.random.number(10),
        nicknames: [{ name: faker.lorem.slug() }]
    }, attrs);
  }
}

module.exports = new PlantFactory();