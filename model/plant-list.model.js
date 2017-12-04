const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlantListSchema = new Schema({
    userObjectId: Schema.Types.ObjectId,
    plantObjectId: Schema.Types.ObjectId,
    lastWatered: Number
});

const PlantList = mongoose.model('plantlist', PlantListSchema);

module.exports = PlantList;
