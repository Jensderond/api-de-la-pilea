const mongoose = require('mongoose');
const config = require('./env/env');

// Gebruik es6 promises ipv mongoose mpromise
mongoose.Promise = global.Promise;
mongoose.connect(config.dburl, {
    useMongoClient: true
});
var connection = mongoose.connection
    .once('open', () => {
        'use strict'; 
        console.log('Connected to Mongo on ' + config.dburl);
    })
    .on('error', (error) => {
        'use strict';
        console.warn('Warning', error.toString());
    });

module.exports = connection;