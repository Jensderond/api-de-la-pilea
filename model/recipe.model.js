const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    imagePath: String,
    favorite: Boolean,
    ingredients: [{
        name: String,
        amount: Number
    }]
}, {
    timestamps: true
});


const Recipe = mongoose.model('recipe', RecipeSchema);

module.exports = Recipe;