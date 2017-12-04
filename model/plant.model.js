const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlantSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    type: String,
    origin: String,
    genus: String,
    imagePath: String,
    sunLevel: Number,
    waterLevel: Number,
    nicknames: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Nickname' } ]
});

const Plant = mongoose.model('Plant', PlantSchema);

module.exports = Plant;