const mocha = require('mocha');
const before = mocha.before;
const beforeEach = mocha.beforeEach;
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

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
        done();
    });
});
