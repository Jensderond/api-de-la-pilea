const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShoppingListSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});


const ShoppingList = mongoose.model('shoppinglist', ShoppingListSchema);

module.exports = ShoppingList;
