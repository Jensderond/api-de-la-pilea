const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NicknameSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

const Nickname = mongoose.model('Nickname', NicknameSchema);

module.exports = Nickname;