const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlantNicknameSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

const PlantNickname = mongoose.model('PlantNickname', PlantNicknameSchema);

module.exports = PlantNickname;