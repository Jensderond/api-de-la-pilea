const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    userObjectId: { type: Schema.Types.ObjectId, ref: 'Room' },
    name: {
        type: String,
        required: true,
        index: true
    },
    description: String
});

const Room = mongoose.model('Room', RoomSchema);

module.exports = Room;