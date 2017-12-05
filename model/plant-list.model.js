const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlantListSchema = new Schema({
    userObjectId: { type: Schema.Types.ObjectId, ref: 'User' },
    plantObjectId: { type: Schema.Types.ObjectId, ref: 'Plant' },
    room: String,
    lastWatered: Date
});

const PlantList = mongoose.model('plantlist', PlantListSchema);

module.exports = PlantList;
