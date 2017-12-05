const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlantSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    description: String,
    type: String,
    origin: String,
    genus: String,
    imagePath: String,
    sunLevel: Number,
    waterLevel: Number,
    nicknames: [{ name: String }]
});

const Plant = mongoose.model('Plant', PlantSchema);

module.exports = Plant;