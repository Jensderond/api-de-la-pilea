const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mocha = require('mocha');
const before = mocha.before;
const beforeEach = mocha.beforeEach;

before((done) => {
    'use strict';
    mongoose.connect('mongodb://localhost/api_test', {
        useMongoClient: true
    });
    mongoose.connection
        .once('open', () => { done(); })
        .on('error', (error) => {
            console.warn('Warning', error);
        });
});

beforeEach((done) => {
    'use strict';
    mongoose.connection.db.dropDatabase(() => {
        //ready to run the next test!
        done();
    });
});
