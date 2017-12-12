'use strict'; 
const mongoose = require('mongoose');

// Gebruik es6 promises ipv mongoose mpromise
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {
    useMongoClient: true
});
var connection = mongoose.connection
    .once('open', () => {
        console.log('Connected to Mongo on ' + process.env.MONGODB_URI);
    })
    .on('error', (error) => {
        console.warn('Warning', error.toString());
    });

module.exports = connection;